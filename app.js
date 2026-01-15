import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { initUserStorage, STORAGE_ROOT } from './storage.js';
import { db } from './db.js';
import { authenticateToken } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4444;

// Setup Logging
const LOG_FILE = path.join(STORAGE_ROOT, 'cabinet.log');
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
  const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
  logStream.write(`[${new Date().toISOString()}] [INFO] ${msg}\n`);
  originalLog.apply(console, args);
};

console.error = (...args) => {
  const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
  logStream.write(`[${new Date().toISOString()}] [ERROR] ${msg}\n`);
  originalError.apply(console, args);
};

// Middleware
app.use(helmet({
  hsts: false, // Disable HSTS to prevent forcing HTTPS
  crossOriginOpenerPolicy: false, // Disable COOP to prevent warnings on HTTP
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "font-src": ["'self'", "https:", "data:"],
      "form-action": ["'self'"],
      "frame-ancestors": ["'self'"],
      "img-src": ["'self'", "data:", "blob:"],
      "object-src": ["'none'"],
      "script-src": ["'self'"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "media-src": ["'self'", "data:", "blob:"],
      "frame-src": ["'self'", "blob:"],
      "connect-src": ["'self'", "ws:", "wss:", "data:", "blob:"],
    },
  },
}));
app.use(cors());
app.use(morgan('combined', { stream: logStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create API Router
const api = express.Router();

// Serve Static Frontend (Phase 3)
app.use(express.static(path.join(__dirname, 'dist')));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper: Calculate SHA-256 Hash
const calculateHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user.username !== 'admin') return res.sendStatus(403);
  next();
};

// Async Error Handler Wrapper to prevent 502 crashes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// --- Auth Routes ---

api.post('/auth/register', asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    await db.read();
    const existing = db.data.users.find(u => u.username === username);
    if (existing) return res.status(400).json({ error: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), username, password: hashedPassword };
    
    db.data.users.push(user);
    await db.write();

    await initUserStorage(user.id);

    res.json({ status: 'success', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

api.post('/auth/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.username === username);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username }, 
    process.env.JWT_SECRET || 'dev-secret-key', 
    { expiresIn: '24h' }
  );
  res.json({ token, userId: user.id });
}));

// --- File Routes ---

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = req.user.id; 
      await initUserStorage(userId);
      const uploadPath = path.join(STORAGE_ROOT, userId, 'user_data');
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const MAX_UPLOAD_SIZE = process.env.MAX_UPLOAD_SIZE || 500 * 1024 * 1024; // 500MB default

const upload = multer({ 
  storage,
  limits: { fileSize: Number(MAX_UPLOAD_SIZE) }
});

api.post('/upload', authenticateToken, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const parentId = req.body.parentId === 'null' || req.body.parentId === '' ? null : req.body.parentId;
  await db.read();
  const user = db.data.users.find(u => u.id === req.user.id);
  
  // Check Quota
  const currentUsage = user.usedSpace || 0;
  const quota = user.quota || 53687091200; // Fallback 50GB
  if (currentUsage + req.file.size > quota) {
    await fs.promises.unlink(req.file.path); // Delete the temp file
    return res.status(413).json({ error: 'Storage quota exceeded' });
  }

  const fileId = uuidv4();
  const fileHash = await calculateHash(req.file.path);

  // Task 4.1: Generate Thumbnail
  let thumbnailUrl = null;
  if (req.file.mimetype.startsWith('image/')) {
    try {
      const thumbnailFilename = `${fileId}.webp`;
      const thumbnailPath = path.join(STORAGE_ROOT, req.user.id, 'thumbnails', thumbnailFilename);
      
      await sharp(req.file.path)
        .resize(300, 300, { fit: 'cover' })
        .toFile(thumbnailPath);
        
      thumbnailUrl = `/api/thumbnails/${fileId}`;
    } catch (err) {
      console.error('Thumbnail generation failed:', err);
    }
  } else if (req.file.mimetype.startsWith('video/')) {
    // Task 5.1: Video Thumbnail
    try {
      const thumbnailFilename = `${fileId}.webp`;
      const thumbnailPath = path.join(STORAGE_ROOT, req.user.id, 'thumbnails');
      
      await new Promise((resolve, reject) => {
        ffmpeg(req.file.path)
          .screenshots({
            timestamps: ['10%'],
            filename: thumbnailFilename,
            folder: thumbnailPath,
            size: '300x300'
          })
          .on('end', resolve)
          .on('error', reject);
      });
      thumbnailUrl = `/api/thumbnails/${fileId}`;
    } catch (err) {
      console.error('Video thumbnail failed:', err);
    }
  }

  const fileData = {
    id: fileId,
    ownerId: req.user.id,
    name: req.file.originalname,
    extension: path.extname(req.file.originalname).substring(1),
    mimeType: req.file.mimetype,
    size: req.file.size,
    hash: fileHash,
    path: req.file.path,
    parentId: parentId || null,
    thumbnail: thumbnailUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.data.files.push(fileData);
  
  // Update User Usage
  user.usedSpace = (user.usedSpace || 0) + req.file.size;
  await db.write();

  res.json({ status: 'success', file: fileData });
}));

api.get('/files', authenticateToken, asyncHandler(async (req, res) => {
  await db.read();
  db.data ||= { files: [], shares: [], users: [], folders: [] };
  const files = db.data.files.filter(f => f.ownerId === req.user.id);
  res.json({ files });
}));

api.patch('/files/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { name, parentId } = req.body;
  await db.read();
  const file = db.data.files.find(f => f.id === req.params.id && f.ownerId === req.user.id);
  
  if (!file) return res.status(404).json({ error: 'File not found' });

  if (name) file.name = name;
  if (parentId !== undefined) file.parentId = parentId;
  
  file.updatedAt = new Date().toISOString();
  await db.write();
  res.json({ status: 'success', file });
}));

// Folder Routes
api.get('/folders', authenticateToken, asyncHandler(async (req, res) => {
  await db.read();
  db.data ||= { files: [], shares: [], users: [], folders: [] };
  const folders = db.data.folders.filter(f => f.ownerId === req.user.id);
  res.json({ folders });
}));

api.post('/folders', authenticateToken, asyncHandler(async (req, res) => {
  const { name, parentId } = req.body;
  if (!name) return res.status(400).json({ error: 'Folder name required' });

  const folder = {
    id: uuidv4(),
    ownerId: req.user.id,
    name,
    parentId: parentId || null,
    createdAt: new Date().toISOString()
  };

  db.data.folders.push(folder);
  await db.write();
  res.json({ status: 'success', folder });
}));

api.delete('/folders/:id', authenticateToken, asyncHandler(async (req, res) => {
  await db.read();
  const index = db.data.folders.findIndex(f => f.id === req.params.id && f.ownerId === req.user.id);
  if (index === -1) return res.status(404).json({ error: 'Folder not found' });

  // Optional: Check if folder is empty or implement recursive delete
  // For now, we just delete the folder. Files inside will be orphaned (hidden) or we can move them to root.
  // Let's prevent deletion if not empty for safety.
  const hasFiles = db.data.files.some(f => f.parentId === req.params.id);
  const hasFolders = db.data.folders.some(f => f.parentId === req.params.id);
  
  if (hasFiles || hasFolders) {
    return res.status(400).json({ error: 'Folder is not empty' });
  }

  db.data.folders.splice(index, 1);
  await db.write();
  res.json({ status: 'success' });
}));

// Admin Routes
api.get('/users', authenticateToken, isAdmin, asyncHandler(async (req, res) => {
  await db.read();
  const users = db.data.users.map(u => ({ 
    id: u.id, 
    username: u.username,
    quota: u.quota || 53687091200,
    usedSpace: u.usedSpace || 0
  }));
  res.json({ users });
}));

api.post('/users', authenticateToken, isAdmin, asyncHandler(async (req, res) => {
  const { username, password, quota } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  await db.read();
  if (db.data.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    quota: quota ? parseInt(quota) : 53687091200,
    usedSpace: 0
  };

  db.data.users.push(user);
  await db.write();
  await initUserStorage(user.id);

  res.json({ status: 'success', user: { id: user.id, username: user.username } });
}));

api.patch('/users/:id/password', authenticateToken, isAdmin, asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  await db.read();
  const user = db.data.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.password = await bcrypt.hash(password, 10);
  await db.write();
  res.json({ status: 'success' });
}));

api.patch('/users/:id/quota', authenticateToken, isAdmin, asyncHandler(async (req, res) => {
  const { quota } = req.body; // Expecting bytes
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.quota = parseInt(quota);
  await db.write();
  res.json({ status: 'success', quota: user.quota });
}));

api.delete('/users/:id', authenticateToken, isAdmin, asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete self' });
  
  await db.read();
  const index = db.data.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  
  // Clean up user storage
  const userDir = path.join(STORAGE_ROOT, req.params.id);
  try {
    await fs.promises.rm(userDir, { recursive: true, force: true });
  } catch (e) {
    console.error('Failed to cleanup user storage:', e);
  }

  db.data.users.splice(index, 1);
  await db.write();
  res.json({ status: 'success' });
}));

api.get('/admin/backup/db', authenticateToken, isAdmin, (req, res) => {
  const dbPath = path.join(STORAGE_ROOT, 'database.json');
  res.download(dbPath, `cabinet-backup-${new Date().toISOString().split('T')[0]}.json`);
});

api.get('/admin/logs', authenticateToken, isAdmin, (req, res) => {
  const logPath = path.join(STORAGE_ROOT, 'cabinet.log');
  if (!fs.existsSync(logPath)) return res.status(404).send('No logs available');

  if (req.query.download === 'true') {
    return res.download(logPath, `cabinet-logs-${new Date().toISOString()}.log`);
  }
  res.sendFile(logPath);
});

api.delete('/files/:id', authenticateToken, asyncHandler(async (req, res) => {
  await db.read();
  const fileIndex = db.data.files.findIndex(f => f.id === req.params.id && f.ownerId === req.user.id);
  
  if (fileIndex === -1) return res.status(404).json({ error: 'File not found' });
  
  const file = db.data.files[fileIndex];
  
  try {
    // Delete file from disk
    if (fs.existsSync(file.path)) {
      await fs.promises.unlink(file.path);
    }
    
    // Delete thumbnail if exists
    const thumbnailPath = path.join(STORAGE_ROOT, req.user.id, 'thumbnails', `${file.id}.webp`);
    if (fs.existsSync(thumbnailPath)) {
      await fs.promises.unlink(thumbnailPath);
    }

    db.data.files.splice(fileIndex, 1);
    
    // Update User Usage
    const user = db.data.users.find(u => u.id === req.user.id);
    if (user) {
      user.usedSpace = Math.max(0, (user.usedSpace || 0) - file.size);
    }
    await db.write();
    
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

// Task 5.1: File Content / Video Stream
api.get('/files/:id/content', authenticateToken, asyncHandler(async (req, res) => {
  try {
    await db.read();
    const file = db.data.files.find(f => f.id === req.params.id && f.ownerId === req.user.id);
    if (!file) return res.status(404).send('File not found');

    if (!fs.existsSync(file.path)) {
      return res.status(404).send('File not found on disk');
    }

    res.sendFile(file.path, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) res.status(500).send('Error sending file');
      }
    });
  } catch (error) {
    console.error('Content Error:', error);
    res.status(500).send('Internal Server Error');
  }
}));

// Task 4.1: Serve Thumbnails
api.get('/thumbnails/:id', authenticateToken, (req, res) => {
  const thumbnailPath = path.join(STORAGE_ROOT, req.user.id, 'thumbnails', req.params.id + '.webp');
  res.sendFile(thumbnailPath, (err) => {
    if (err) res.sendStatus(404);
  });
});

// --- Share Routes (Task 4.2) ---

api.post('/shares', authenticateToken, asyncHandler(async (req, res) => {
  const { fileId, password, expiresAt, maxDownloads } = req.body;
  if (!fileId) return res.status(400).json({ error: 'File ID required' });

  await db.read();
  const file = db.data.files.find(f => f.id === fileId && f.ownerId === req.user.id);
  if (!file) return res.status(404).json({ error: 'File not found' });

  // Generate short ID (8 chars)
  const shareId = crypto.randomBytes(4).toString('hex');
  
  let passwordHash = null;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const shareData = {
    id: shareId,
    fileId: file.id,
    creatorId: req.user.id,
    createdAt: new Date().toISOString(),
    active: true,
    currentDownloads: 0,
    isPasswordProtected: !!password,
    passwordHash,
    expiresAt: expiresAt || null,
    maxDownloads: maxDownloads ? parseInt(maxDownloads) : null
  };

  db.data.shares.push(shareData);
  await db.write();

  res.json({ status: 'success', shareId, link: `/s/${shareId}` });
}));

// Swagger Docs (Task 5.3)
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
api.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount API Router
app.use('/api', api);

// Public Share Link Consumption (Keep at root for short URLs)
app.get('/s/:id', asyncHandler(async (req, res) => {
  await db.read();
  const share = db.data.shares.find(s => s.id === req.params.id);
  
  if (!share || !share.active) return res.status(404).send('Link not found or expired');

  // Task 4.3: Check Expiration
  if (share.expiresAt && new Date() > new Date(share.expiresAt)) {
    return res.status(410).send('Link expired');
  }

  // Task 4.3: Check Max Downloads
  if (share.maxDownloads && share.currentDownloads >= share.maxDownloads) {
    return res.status(410).send('Download limit reached');
  }

  // Task 4.3: Check Password
  if (share.isPasswordProtected) {
    const providedPassword = req.query.password || req.headers['x-share-password'];
    if (!providedPassword || !(await bcrypt.compare(providedPassword, share.passwordHash))) {
      return res.status(401).json({ error: 'Password required' });
    }
  }

  const file = db.data.files.find(f => f.id === share.fileId);
  if (!file) return res.status(404).send('File source not found');

  // Update download count
  share.currentDownloads = (share.currentDownloads || 0) + 1;
  await db.write();

  res.download(file.path, file.name);
}));

// SPA Fallback
app.get('*', (req, res) => {
  const index = path.join(__dirname, 'dist/index.html');
  if (fs.existsSync(index)) {
    res.sendFile(index);
  } else {
    res.status(404).send('Cabinet is running, but the frontend build is missing.');
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: err.message });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Cabinet Backend running on port ${PORT}`);
});