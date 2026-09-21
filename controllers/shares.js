import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';

const parseDownloadLimit = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : false;
};

const parseExpiration = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) return false;
  return date.toISOString();
};

export const createShare = async (req, res) => {
  const { fileId, password } = req.body;
  const downloadLimit = parseDownloadLimit(req.body.downloadLimit);
  const expiresAt = parseExpiration(req.body.expiresAt);

  if (downloadLimit === false) return res.status(400).json({ error: 'downloadLimit must be a positive integer' });
  if (expiresAt === false) return res.status(400).json({ error: 'expiresAt must be a future date' });

  const file = await db.get(
    'SELECT id FROM files WHERE id = ? AND ownerId = ?',
    [fileId, req.user.id]
  );
  if (!file) return res.status(404).json({ error: 'File not found' });

  const share = {
    id: uuidv4(),
    fileId,
    creatorId: req.user.id,
    password: password ? await bcrypt.hash(password, 12) : null,
    expiresAt,
    downloadLimit,
    downloads: 0,
    active: 1,
    createdAt: new Date().toISOString()
  };

  await db.run(
    `INSERT INTO shares
     (id, fileId, creatorId, password, expiresAt, downloadLimit, downloads, active, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      share.id, share.fileId, share.creatorId, share.password, share.expiresAt,
      share.downloadLimit, share.downloads, share.active, share.createdAt
    ]
  );

  res.status(201).json({
    status: 'success',
    link: `/s/${share.id}`,
    share: {
      id: share.id,
      fileId: share.fileId,
      expiresAt: share.expiresAt,
      downloadLimit: share.downloadLimit,
      downloads: 0,
      active: true,
      hasPassword: Boolean(share.password),
      createdAt: share.createdAt
    }
  });
};

export const getShares = async (req, res) => {
  const shares = await db.all(
    `SELECT s.id, s.fileId, s.expiresAt, s.downloadLimit, s.downloads, s.active,
            s.createdAt, (s.password IS NOT NULL) AS hasPassword, f.name AS fileName
     FROM shares s
     JOIN files f ON s.fileId = f.id
     WHERE s.creatorId = ? AND s.active = 1
     ORDER BY s.createdAt DESC`,
    [req.user.id]
  );
  res.json({ shares });
};

export const deleteShare = async (req, res) => {
  const result = await db.run(
    'UPDATE shares SET active = 0 WHERE id = ? AND creatorId = ?',
    [req.params.id, req.user.id]
  );
  if (result.changes !== 1) return res.status(404).json({ error: 'Share not found' });
  res.json({ status: 'success' });
};
