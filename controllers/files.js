import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { pdf } from 'pdf-to-img';
import { db } from '../db.js';
import { STORAGE_ROOT } from '../storage.js';
import { createDecryptionStream, encryptFile } from '../crypto.js';
import { ENCRYPTION_KEY, PREVIEW_MAX_SIZE, THUMBNAIL_CONCURRENCY } from '../config.js';
import logger from '../logger.js';

let activeThumbnailJobs = 0;
const thumbnailWaiters = [];

const withThumbnailSlot = async (fn) => {
  if (activeThumbnailJobs >= THUMBNAIL_CONCURRENCY) {
    await new Promise((resolve) => thumbnailWaiters.push(resolve));
  }
  activeThumbnailJobs += 1;
  try {
    return await fn();
  } finally {
    activeThumbnailJobs -= 1;
    thumbnailWaiters.shift()?.();
  }
};

const calculateHash = (filePath) => new Promise((resolve, reject) => {
  const hash = crypto.createHash('sha256');
  const stream = fsSync.createReadStream(filePath);
  stream.on('error', reject);
  stream.on('data', (chunk) => hash.update(chunk));
  stream.on('end', () => resolve(hash.digest('hex')));
});

const detectFileType = async (filePath) => {
  const handle = await fs.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(16);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    const b = buffer.subarray(0, bytesRead);
    if (b.length >= 4 && b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) return 'image';
    if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image';
    if (b.subarray(0, 4).toString() === 'GIF8') return 'image';
    if (b.length >= 12 && b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'image';
    if (b.subarray(0, 4).toString() === '%PDF') return 'pdf';
    if (b.length >= 12 && b.subarray(4, 8).toString() === 'ftyp') return 'video';
    return 'unknown';
  } finally {
    await handle.close();
  }
};

const validateParent = async (ownerId, parentId) => {
  if (!parentId) return true;
  return Boolean(await db.get(
    'SELECT id FROM folders WHERE id = ? AND ownerId = ?',
    [parentId, ownerId]
  ));
};

const reserveQuota = async (userId, size) => {
  await db.exec('BEGIN IMMEDIATE');
  try {
    const result = await db.run(
      'UPDATE users SET usedSpace = usedSpace + ? WHERE id = ? AND usedSpace + ? <= quota',
      [size, userId, size]
    );
    if (result.changes !== 1) {
      await db.exec('ROLLBACK');
      return false;
    }
    await db.exec('COMMIT');
    return true;
  } catch (error) {
    await db.exec('ROLLBACK').catch(() => {});
    throw error;
  }
};

const releaseQuota = async (userId, size) => {
  await db.run(
    'UPDATE users SET usedSpace = MAX(0, usedSpace - ?) WHERE id = ?',
    [size, userId]
  );
};

const generateThumbnail = async (req, fileId) => {
  if (req.file.size > PREVIEW_MAX_SIZE) return null;

  const kind = await detectFileType(req.file.path);
  if (kind === 'unknown') return null;

  const thumbnailFilename = `${fileId}.webp`;
  const thumbnailDir = path.join(STORAGE_ROOT, req.user.id, 'thumbnails');
  const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

  return withThumbnailSlot(async () => {
    try {
      if (kind === 'image') {
        await sharp(req.file.path).resize(300, 300, { fit: 'cover' }).webp().toFile(thumbnailPath);
      } else if (kind === 'video') {
        await new Promise((resolve, reject) => {
          ffmpeg(req.file.path)
            .screenshots({
              timestamps: ['10%'],
              filename: thumbnailFilename,
              folder: thumbnailDir,
              size: '300x300'
            })
            .on('end', resolve)
            .on('error', reject);
        });
      } else if (kind === 'pdf') {
        const document = await pdf(req.file.path, { scale: 1 });
        for await (const page of document) {
          await sharp(page).resize(300, 300, { fit: 'cover' }).webp().toFile(thumbnailPath);
          break;
        }
      }
      return `/api/files/${fileId}/thumbnail`;
    } catch (error) {
      logger.warn('Thumbnail generation skipped', { fileId, error: error.message });
      await fs.rm(thumbnailPath, { force: true }).catch(() => {});
      return null;
    }
  });
};

const getReadableFile = async (userId, fileId) => db.get(
  `SELECT f.*
   FROM files f
   WHERE f.id = ?
     AND (
       f.ownerId = ?
       OR EXISTS (
         SELECT 1 FROM shared_files sf
         WHERE sf.fileId = f.id AND sf.userId = ?
       )
     )`,
  [fileId, userId, userId]
);

export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const parentId = ['null', '', undefined].includes(req.body.parentId) ? null : req.body.parentId;
  if (!(await validateParent(req.user.id, parentId))) {
    await fs.rm(req.file.path, { force: true });
    return res.status(400).json({ error: 'Invalid destination folder' });
  }

  if (!(await reserveQuota(req.user.id, req.file.size))) {
    await fs.rm(req.file.path, { force: true });
    return res.status(413).json({ error: 'Storage quota exceeded' });
  }

  const fileId = req.fileId || uuidv4();
  const encryptedPath = `${req.file.path}.enc`;
  let thumbnailUrl = null;

  try {
    const fileHash = await calculateHash(req.file.path);
    thumbnailUrl = await generateThumbnail(req, fileId);

    await encryptFile(req.file.path, encryptedPath, ENCRYPTION_KEY);
    await fs.rm(req.file.path, { force: true });
    await fs.rename(encryptedPath, req.file.path);

    const now = new Date().toISOString();
    await db.run(
      `INSERT INTO files
       (id, ownerId, name, extension, mimeType, size, hash, path, parentId, thumbnail, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fileId,
        req.user.id,
        req.file.originalname,
        path.extname(req.file.originalname).substring(1),
        req.file.mimetype || 'application/octet-stream',
        req.file.size,
        fileHash,
        req.file.path,
        parentId,
        thumbnailUrl,
        now,
        now
      ]
    );

    return res.status(201).json({
      status: 'success',
      file: {
        id: fileId,
        name: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype || 'application/octet-stream',
        parentId,
        thumbnail: thumbnailUrl,
        createdAt: now,
        updatedAt: now
      }
    });
  } catch (error) {
    await Promise.allSettled([
      fs.rm(req.file.path, { force: true }),
      fs.rm(encryptedPath, { force: true }),
      thumbnailUrl
        ? fs.rm(path.join(STORAGE_ROOT, req.user.id, 'thumbnails', `${fileId}.webp`), { force: true })
        : Promise.resolve()
    ]);
    await releaseQuota(req.user.id, req.file.size);
    throw error;
  }
};

export const getFiles = async (req, res) => {
  const files = await db.all(
    `SELECT DISTINCT
       f.id, f.ownerId, f.name, f.extension, f.mimeType, f.size, f.hash, f.path,
       CASE WHEN f.ownerId = ? THEN f.parentId ELSE NULL END AS parentId,
       f.thumbnail, f.createdAt, f.updatedAt
     FROM files f
     LEFT JOIN shared_files sf ON sf.fileId = f.id
     WHERE f.ownerId = ? OR sf.userId = ?
     ORDER BY f.createdAt DESC`,
    [req.user.id, req.user.id, req.user.id]
  );
  res.json({ files });
};

export const patchFile = async (req, res) => {
  const { name, parentId } = req.body;
  const file = await db.get(
    'SELECT * FROM files WHERE id = ? AND ownerId = ?',
    [req.params.id, req.user.id]
  );
  if (!file) return res.status(404).json({ error: 'File not found' });

  const newName = name !== undefined ? String(name).trim() : file.name;
  if (!newName) return res.status(400).json({ error: 'File name cannot be empty' });

  const newParentId = parentId !== undefined ? parentId : file.parentId;
  if (!(await validateParent(req.user.id, newParentId))) {
    return res.status(400).json({ error: 'Invalid destination folder' });
  }

  const updatedAt = new Date().toISOString();
  await db.run(
    'UPDATE files SET name = ?, parentId = ?, updatedAt = ? WHERE id = ?',
    [newName, newParentId || null, updatedAt, req.params.id]
  );

  res.json({
    status: 'success',
    file: { ...file, name: newName, parentId: newParentId || null, updatedAt }
  });
};

export const shareFileWithUser = async (req, res) => {
  const username = String(req.body.username || '').trim();
  if (!username) return res.status(400).json({ error: 'Username required' });

  const file = await db.get(
    'SELECT id FROM files WHERE id = ? AND ownerId = ?',
    [req.params.id, req.user.id]
  );
  if (!file) return res.status(404).json({ error: 'File not found' });

  const target = await db.get('SELECT id FROM users WHERE username = ?', [username]);
  if (!target) return res.status(404).json({ error: 'User not found' });
  if (target.id === req.user.id) return res.status(400).json({ error: 'File is already yours' });

  await db.run(
    `INSERT INTO shared_files (fileId, userId, sharedBy, createdAt)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(fileId, userId) DO NOTHING`,
    [file.id, target.id, req.user.id, new Date().toISOString()]
  );

  res.status(201).json({ status: 'success' });
};

export const deleteFile = async (req, res) => {
  const file = await db.get(
    'SELECT * FROM files WHERE id = ? AND ownerId = ?',
    [req.params.id, req.user.id]
  );
  if (!file) return res.status(404).json({ error: 'File not found' });

  const stagedPath = `${file.path}.deleting-${uuidv4()}`;
  await fs.rename(file.path, stagedPath);

  try {
    await db.exec('BEGIN IMMEDIATE');
    await db.run('DELETE FROM shared_files WHERE fileId = ?', [file.id]);
    await db.run('DELETE FROM shares WHERE fileId = ?', [file.id]);
    await db.run('DELETE FROM files WHERE id = ?', [file.id]);
    await db.run(
      'UPDATE users SET usedSpace = MAX(0, usedSpace - ?) WHERE id = ?',
      [file.size, req.user.id]
    );
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK').catch(() => {});
    await fs.rename(stagedPath, file.path).catch(() => {});
    throw error;
  }

  await fs.rm(stagedPath, { force: true }).catch((error) => {
    logger.error('Failed to remove staged file', { fileId: file.id, error: error.message });
  });
  await fs.rm(
    path.join(STORAGE_ROOT, req.user.id, 'thumbnails', `${file.id}.webp`),
    { force: true }
  ).catch(() => {});

  res.json({ status: 'success' });
};

const parseRange = (header, size) => {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return false;

  let start;
  let end;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return false;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
  }

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) {
    return false;
  }
  return { start, end: Math.min(end, size - 1) };
};

export const getFileContent = async (req, res) => {
  const file = await getReadableFile(req.user.id, req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });

  const isDownload = req.query.download === 'true';
  const range = parseRange(req.headers.range, file.size);
  if (range === false) {
    res.setHeader('Content-Range', `bytes */${file.size}`);
    return res.sendStatus(416);
  }

  if (isDownload) {
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`);
  }
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', isDownload ? 'application/octet-stream' : (file.mimeType || 'application/octet-stream'));

  if (range && (file.mimeType?.startsWith('video/') || file.mimeType?.startsWith('audio/'))) {
    const length = range.end - range.start + 1;
    res.status(206);
    res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.size}`);
    res.setHeader('Content-Length', length);
    const stream = await createDecryptionStream(file.path, ENCRYPTION_KEY, range);
    return stream.pipe(res);
  }

  res.setHeader('Content-Length', file.size);
  const stream = await createDecryptionStream(file.path, ENCRYPTION_KEY);
  stream.on('error', (error) => {
    logger.error('File stream failed', { fileId: file.id, error: error.message });
    if (!res.headersSent) res.sendStatus(500);
    else res.destroy(error);
  });
  stream.pipe(res);
};

export const getThumbnail = async (req, res) => {
  const file = await getReadableFile(req.user.id, req.params.id);
  if (!file?.thumbnail) return res.status(404).json({ error: 'Thumbnail not found' });

  const thumbnailPath = path.join(STORAGE_ROOT, file.ownerId, 'thumbnails', `${file.id}.webp`);
  try {
    await fs.access(thumbnailPath);
    res.type('image/webp').sendFile(thumbnailPath);
  } catch {
    res.status(404).json({ error: 'Thumbnail not found' });
  }
};
