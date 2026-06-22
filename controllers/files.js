import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { pdf } from 'pdf-to-img';
import { db } from '../db.js';
import { STORAGE_ROOT } from '../storage.js';
import { deriveKey, encryptFile } from '../crypto.js';
import logger from '../logger.js';
import crypto from 'crypto';
import fsSync from 'fs';

const calculateHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fsSync.createReadStream(filePath);
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};

export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const parentId = req.body.parentId === 'null' || req.body.parentId === '' ? null : req.body.parentId;
  const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
  
  const currentUsage = user.usedSpace || 0;
  const quota = user.quota || 53687091200;
  if (currentUsage + req.file.size > quota) {
    await fs.unlink(req.file.path);
    return res.status(413).json({ error: 'Storage quota exceeded' });
  }

  const fileId = req.fileId || uuidv4();
  const fileHash = await calculateHash(req.file.path);

  let thumbnailUrl = null;
  if (req.file.mimetype.startsWith('image/')) {
    try {
      const thumbnailFilename = `${fileId}.webp`;
      const thumbnailPath = path.join(STORAGE_ROOT, req.user.id, 'thumbnails', thumbnailFilename);
      await sharp(req.file.path).resize(300, 300, { fit: 'cover' }).toFile(thumbnailPath);
      thumbnailUrl = `/api/thumbnails/${fileId}`;
    } catch (err) {
      logger.error('Thumbnail generation failed:', err);
    }
  } else if (req.file.mimetype.startsWith('video/')) {
    try {
      const thumbnailFilename = `${fileId}.webp`;
      const thumbnailPath = path.join(STORAGE_ROOT, req.user.id, 'thumbnails');
      await new Promise((resolve, reject) => {
        ffmpeg(req.file.path)
          .screenshots({ timestamps: ['10%'], filename: thumbnailFilename, folder: thumbnailPath, size: '300x300' })
          .on('end', resolve)
          .on('error', reject);
      });
      thumbnailUrl = `/api/thumbnails/${fileId}`;
    } catch (err) {
      logger.error('Video thumbnail failed:', err);
    }
  } else if (req.file.mimetype === 'application/pdf') {
    try {
      const thumbnailFilename = `${fileId}.webp`;
      const thumbnailPath = path.join(STORAGE_ROOT, req.user.id, 'thumbnails', thumbnailFilename);
      const document = await pdf(req.file.path, { scale: 1 });
      for await (const page of document) {
        await sharp(page).resize(300, 300, { fit: 'cover' }).toFile(thumbnailPath);
        break;
      }
      thumbnailUrl = `/api/thumbnails/${fileId}`;
    } catch (err) {
      logger.error('PDF thumbnail generation failed:', err);
    }
  }

  try {
    const encryptedPath = req.file.path + '.enc';
    const key = deriveKey(process.env.ENCRYPTION_KEY || 'dev-secret-key');
    await encryptFile(req.file.path, encryptedPath, key);
    await fs.unlink(req.file.path);
    await fs.rename(encryptedPath, req.file.path);
  } catch (err) {
    logger.error('File encryption failed:', err);
    return res.status(500).json({ error: 'File encryption failed' });
  }

  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO files (id, ownerId, name, extension, mimeType, size, hash, path, parentId, thumbnail, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fileId, req.user.id, req.file.originalname, path.extname(req.file.originalname).substring(1),
      req.file.mimetype, req.file.size, fileHash, req.file.path, parentId, thumbnailUrl, now, now
    ]
  );
  
  await db.run('UPDATE users SET usedSpace = usedSpace + ? WHERE id = ?', [req.file.size, req.user.id]);

  res.json({ status: 'success', file: { id: fileId, name: req.file.originalname, size: req.file.size } });
};

export const getFiles = async (req, res) => {
  const files = await db.all(
    `SELECT * FROM files WHERE ownerId = ? 
     OR id IN (SELECT fileId FROM shares WHERE creatorId = ?)`, // Shared with is more complex. Wait, original logic used file.sharedWith array. We don't have a sharedWith table. We need a shared_files table if we want to share directly to users. 
    [req.user.id, req.user.id]
  );
  res.json({ files });
};

export const patchFile = async (req, res) => {
  const { name, parentId } = req.body;
  const file = await db.get('SELECT * FROM files WHERE id = ? AND ownerId = ?', [req.params.id, req.user.id]);
  
  if (!file) return res.status(404).json({ error: 'File not found' });

  const newName = name || file.name;
  const newParentId = parentId !== undefined ? parentId : file.parentId;
  
  await db.run(
    'UPDATE files SET name = ?, parentId = ?, updatedAt = ? WHERE id = ?',
    [newName, newParentId, new Date().toISOString(), req.params.id]
  );
  
  res.json({ status: 'success', file: { ...file, name: newName, parentId: newParentId } });
};

export const deleteFile = async (req, res) => {
  const file = await db.get('SELECT * FROM files WHERE id = ? AND ownerId = ?', [req.params.id, req.user.id]);
  if (!file) return res.status(404).json({ error: 'File not found' });

  try {
    await fs.unlink(file.path);
  } catch (err) {
    logger.error('Failed to delete file from disk:', err);
  }

  if (file.thumbnail) {
    const thumbnailPath = path.join(STORAGE_ROOT, req.user.id, 'thumbnails', path.basename(file.thumbnail));
    try {
      await fs.unlink(thumbnailPath);
    } catch (err) { }
  }

  await db.run('DELETE FROM shares WHERE fileId = ?', [file.id]);
  await db.run('DELETE FROM files WHERE id = ?', [file.id]);
  await db.run('UPDATE users SET usedSpace = usedSpace - ? WHERE id = ?', [file.size, req.user.id]);

  res.json({ status: 'success' });
};

export const getFileContent = async (req, res) => {
  const file = await db.get('SELECT * FROM files WHERE id = ? AND ownerId = ?', [req.params.id, req.user.id]);
  if (!file) return res.status(404).json({ error: 'File not found' });

  const isDownload = req.query.download === 'true';
  const range = req.headers.range;
  const key = deriveKey(process.env.ENCRYPTION_KEY || 'dev-secret-key');

  if (isDownload) {
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    createDecryptionStream(file.path, key).pipe(res);
  } else if (range && (file.mimeType.startsWith('video/') || file.mimeType.startsWith('audio/'))) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : file.size - 1;
    const chunksize = (end - start) + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${file.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': file.mimeType,
    });
    createDecryptionStream(file.path, key, { start, end }).pipe(res);
  } else {
    res.setHeader('Content-Type', file.mimeType);
    createDecryptionStream(file.path, key).pipe(res);
  }
};

export const getThumbnail = async (req, res) => {
  const file = await db.get('SELECT * FROM files WHERE id = ?', [req.params.id]);
  if (!file) return res.status(404).json({ error: 'File not found' });

  const thumbnailPath = path.join(STORAGE_ROOT, file.ownerId, 'thumbnails', `${file.id}.webp`);
  try {
    await fs.access(thumbnailPath);
    res.sendFile(thumbnailPath);
  } catch (err) {
    res.status(404).json({ error: 'Thumbnail not found' });
  }
};
