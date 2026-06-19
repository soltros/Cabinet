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
import { pdf } from 'pdf-to-img';
import { fileURLToPath } from 'url';
import { initUserStorage, STORAGE_ROOT } from './storage.js';
import { db } from './db.js';
import { authenticateToken } from './auth.js';
import { deriveKey, encryptFile, createDecryptionStream } from './crypto.js';

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
  const msg = args.map(arg => {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch (e) {
        return '[Unserializable Object]';
      }
    }
    return String(arg);
  }).join(' ');
  logStream.write(`[${new Date().toISOString()}] [INFO] ${msg}\n`);
  originalLog.apply(console, args);
};

console.error = (...args) => {
  const msg = args.map(arg => {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch (e) {
        return '[Unserializable Object]';
      }
    }
    return String(arg);
  }).join(' ');
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

    // Input Validation: Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and dashes.' });
    }

    await db.read();
    const existing = db.data.users.find(u => u.username === username);
    if (existing) return res.status(400).json({ error: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      quota: 53687091200, // 50GB default
      usedSpace: 0
    };
    
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
    req.fileId = uuidv4();
    cb(null, req.fileId);
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

  const fileId = req.fileId || uuidv4();
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
  } else if (req.file.mimetype === 'application/pdf') {
    // Task 5.2: PDF Thumbnail
    try {
      const thumbnailFilename = `${fileId}.webp`;
      const thumbnailPath = path.join(STORAGE_ROOT, req.user.id, 'thumbnails', thumbnailFilename);
      
      const document = await pdf(req.file.path, { scale: 1 });
      for await (const page of document) {
        await sharp(page)
          .resize(300, 300, { fit: 'cover' })
          .toFile(thumbnailPath);
        break; // Only thumbnail the first page
      }
      thumbnailUrl = `/api/thumbnails/${fileId}`;
    } catch (err) {
      console.error('PDF thumbnail generation failed:', err);
    }
  }

  // Server-Side Encryption
  try {
    const encryptedPath = req.file.path + '.enc';
    const key = deriveKey(process.env.ENCRYPTION_KEY || 'dev-secret-key');
    await encryptFile(req.file.path, encryptedPath, key);
    await fs.promises.unlink(req.file.path);
    await fs.promises.rename(encryptedPath, req.file.path);
  } catch (err) {
    console.error('File encryption failed:', err);
    return res.status(500).json({ error: 'File encryption failed' });
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
  const files = db.data.files.filter(f => 
    f.ownerId === req.user.id || 
    (f.sharedWith && f.sharedWith.includes(req.user.id))
  );
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

api.post('/files/:id/share', authenticateToken, asyncHandler(async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  await db.read();
  const file = db.data.files.find(f => f.id === req.params.id && f.ownerId === req.user.id);
  if (!file) return res.status(404).json({ error: 'File not found or permission denied' });

  const targetUser = db.data.users.find(u => u.username === username);
  if (!targetUser) return res.status(404).json({ error: 'User not found' });

  if (targetUser.id === req.user.id) return res.status(400).json({ error: 'Cannot share with yourself' });

  file.sharedWith = file.sharedWith || [];
  if (!file.sharedWith.includes(targetUser.id)) {
    file.sharedWith.push(targetUser.id);
    await db.write();
  }

  res.json({ status: 'success' });
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

  // Input Validation: Validate username format
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ error: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and dashes.' });
  }

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

  // Database Integrity: Remove user's files, folders, and shares
  db.data.files = db.data.files.filter(f => f.ownerId !== req.params.id);
  db.data.folders = db.data.folders.filter(f => f.ownerId !== req.params.id);
  db.data.shares = db.data.shares.filter(s => s.creatorId !== req.params.id);

  // Database Integrity: Remove user from other files' sharedWith lists
  db.data.files.forEach(f => {
    if (f.sharedWith) {
      f.sharedWith = f.sharedWith.filter(uid => uid !== req.params.id);
    }
  });

  db.data.users.splice(index, 1);
  await db.write();
  res.json({ status: 'success' });
}));

api.get('/admin/backup/db', authenticateToken, isAdmin, (req, res) => {
  const dbPath = path.join(STORAGE_ROOT, 'database.json');
  res.download(dbPath, `cabinet-backup-${new Date().toISOString().split('T')[0]}.json`);
});

api.get('/admin/logs', authenticateToken, isAdmin, asyncHandler(async (req, res) => {
  const logPath = path.join(STORAGE_ROOT, 'cabinet.log');
  if (!fs.existsSync(logPath)) return res.status(404).send('No logs available');

  if (req.query.download === 'true') {
    return res.download(logPath, `cabinet-logs-${new Date().toISOString()}.log`);
  }

  try {
    const stats = await fs.promises.stat(logPath);
    const limit = 50000; // ~50KB limit to avoid browser memory freeze
    const start = Math.max(0, stats.size - limit);
    const length = stats.size - start;

    const fd = await fs.promises.open(logPath, 'r');
    const buffer = Buffer.alloc(length);
    await fd.read(buffer, 0, length, start);
    await fd.close();

    let logsText = buffer.toString('utf8');
    if (start > 0) {
      logsText = `... [Truncated ${Math.round(start / 1024)} KB of older logs] ...\n` + logsText;
    }
    res.send(logsText);
  } catch (err) {
    console.error('Error reading logs:', err);
    res.status(500).send('Error reading logs');
  }
}));

api.post('/admin/scrub', authenticateToken, isAdmin, asyncHandler(async (req, res) => {
  await db.read();
  const initialCount = db.data.files.length;
  
  // Filter files that exist on disk
  const validFiles = db.data.files.filter(file => fs.existsSync(file.path));

  const removedCount = initialCount - validFiles.length;
  db.data.files = validFiles;

  // Recalculate used space for all users
  db.data.users.forEach(user => {
    const userFiles = db.data.files.filter(f => f.ownerId === user.id);
    user.usedSpace = userFiles.reduce((acc, f) => acc + f.size, 0);
  });

  await db.write();
  res.json({ status: 'success', removedCount });
}));

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
    
    // Clean up public share links associated with the deleted file
    db.data.shares = db.data.shares.filter(s => s.fileId !== req.params.id);
    
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
    const file = db.data.files.find(f => 
      f.id === req.params.id && 
      (f.ownerId === req.user.id || (f.sharedWith && f.sharedWith.includes(req.user.id)))
    );
    if (!file) return res.status(404).send('File not found');

    if (!fs.existsSync(file.path)) {
      return res.status(404).send('File not found on disk');
    }

    const stat = await fs.promises.stat(file.path);
    const IV_SIZE = 16;
    const totalPlaintextSize = Math.max(0, stat.size - IV_SIZE);
    const key = deriveKey(process.env.ENCRYPTION_KEY || 'dev-secret-key');
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalPlaintextSize - 1;
      
      const chunksize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalPlaintextSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': file.mimeType || 'application/octet-stream',
        'Content-Disposition': req.query.download === 'true' ? `attachment; filename="${encodeURIComponent(file.name)}"` : 'inline'
      });
      
      const stream = createDecryptionStream(file.path, key, { start, end });
      stream.on('error', (err) => {
        console.error('Decryption stream range error:', err);
        if (!res.headersSent) res.sendStatus(500);
      });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': totalPlaintextSize,
        'Content-Type': file.mimeType || 'application/octet-stream',
        'Content-Disposition': req.query.download === 'true' ? `attachment; filename="${encodeURIComponent(file.name)}"` : 'inline'
      });
      
      const stream = createDecryptionStream(file.path, key);
      stream.on('error', (err) => {
        console.error('Decryption stream error:', err);
        if (!res.headersSent) res.sendStatus(500);
      });
      stream.pipe(res);
    }
  } catch (error) {
    console.error('Content Error:', error);
    res.status(500).send('Internal Server Error');
  }
}));

// Task 4.1: Serve Thumbnails
api.get('/thumbnails/:id', authenticateToken, asyncHandler(async (req, res) => {
  try {
    await db.read();
    const file = db.data.files.find(f => f.id === req.params.id);
    if (!file) return res.sendStatus(404);

    const hasAccess = file.ownerId === req.user.id || (file.sharedWith && file.sharedWith.includes(req.user.id));
    if (!hasAccess) return res.sendStatus(403);

    const thumbnailPath = path.join(STORAGE_ROOT, file.ownerId, 'thumbnails', file.id + '.webp');
    res.sendFile(thumbnailPath, (err) => {
      if (err) res.sendStatus(404);
    });
  } catch (error) {
    console.error('Thumbnail serve error:', error);
    res.sendStatus(500);
  }
}));

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

// Public Share Info (No Auth Required)
api.get('/public/shares/:id', asyncHandler(async (req, res) => {
  await db.read();
  const share = db.data.shares.find(s => s.id === req.params.id);
  if (!share || !share.active) return res.status(404).json({ error: 'Link not found or expired' });

  // Task 4.3: Check Expiration
  if (share.expiresAt && new Date() > new Date(share.expiresAt)) return res.status(410).json({ error: 'Link expired' });
  // Task 4.3: Check Max Downloads
  if (share.maxDownloads && share.currentDownloads >= share.maxDownloads) return res.status(410).json({ error: 'Download limit reached' });

  const file = db.data.files.find(f => f.id === share.fileId);
  if (!file) return res.status(404).json({ error: 'File source not found' });

  res.json({
    name: file.name,
    size: file.size,
    mimeType: file.mimeType,
    isPasswordProtected: share.isPasswordProtected,
    id: share.id
  });
}));

// Public Share Verify Password (No Auth Required)
api.post('/public/shares/:id/verify', asyncHandler(async (req, res) => {
  const { password } = req.body;
  await db.read();
  const share = db.data.shares.find(s => s.id === req.params.id);
  if (!share || !share.active) return res.status(404).json({ error: 'Link not found' });

  if (share.expiresAt && new Date() > new Date(share.expiresAt)) return res.status(410).json({ error: 'Link expired' });
  if (share.maxDownloads && share.currentDownloads >= share.maxDownloads) return res.status(410).json({ error: 'Download limit reached' });

  if (share.isPasswordProtected) {
    if (!password || !(await bcrypt.compare(password, share.passwordHash))) {
      return res.status(401).json({ error: 'Invalid password' });
    }
  }

  res.json({ status: 'success' });
}));

// Public Share Download (No Auth Required)
api.post('/public/shares/:id/download', asyncHandler(async (req, res) => {
  const { password } = req.body;
  await db.read();
  const share = db.data.shares.find(s => s.id === req.params.id);
  if (!share || !share.active) return res.status(404).json({ error: 'Link not found' });

  if (share.expiresAt && new Date() > new Date(share.expiresAt)) return res.status(410).json({ error: 'Link expired' });
  if (share.maxDownloads && share.currentDownloads >= share.maxDownloads) return res.status(410).json({ error: 'Download limit reached' });

  if (share.isPasswordProtected) {
    if (!password || !(await bcrypt.compare(password, share.passwordHash))) {
      return res.status(401).json({ error: 'Password required' });
    }
  }

  const file = db.data.files.find(f => f.id === share.fileId);
  if (!file) return res.status(404).json({ error: 'File not found' });

  // Update download count
  share.currentDownloads = (share.currentDownloads || 0) + 1;
  await db.write();

  try {
    const stat = await fs.promises.stat(file.path);
    const IV_SIZE = 16;
    const totalPlaintextSize = Math.max(0, stat.size - IV_SIZE);
    const key = deriveKey(process.env.ENCRYPTION_KEY || 'dev-secret-key');

    res.writeHead(200, {
      'Content-Length': totalPlaintextSize,
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name)}"`
    });

    const stream = createDecryptionStream(file.path, key);
    stream.on('error', (err) => {
      console.error('Public download stream error:', err);
      if (!res.headersSent) res.sendStatus(500);
    });
    stream.pipe(res);
  } catch (error) {
    console.error('Public download error:', error);
    res.status(500).send('Internal Server Error');
  }
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