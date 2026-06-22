import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';

export const createShare = async (req, res) => {
  const { fileId, password, expiresInHours, downloadLimit } = req.body;
  
  const file = await db.get('SELECT * FROM files WHERE id = ? AND ownerId = ?', [fileId, req.user.id]);
  if (!file) return res.status(404).json({ error: 'File not found' });

  const id = uuidv4();
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  let expiresAt = null;
  if (expiresInHours) {
    const d = new Date();
    d.setHours(d.getHours() + parseInt(expiresInHours));
    expiresAt = d.toISOString();
  }

  const share = {
    id,
    fileId,
    creatorId: req.user.id,
    password: hashedPassword,
    expiresAt,
    downloadLimit: downloadLimit ? parseInt(downloadLimit) : null,
    downloads: 0,
    active: 1,
    createdAt: new Date().toISOString()
  };

  await db.run(
    `INSERT INTO shares (id, fileId, creatorId, password, expiresAt, downloadLimit, downloads, active, createdAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [share.id, share.fileId, share.creatorId, share.password, share.expiresAt, share.downloadLimit, share.downloads, share.active, share.createdAt]
  );

  res.json({ status: 'success', link: `/s/${id}` });
};

export const getShares = async (req, res) => {
  const shares = await db.all(
    `SELECT s.*, f.name as fileName 
     FROM shares s 
     JOIN files f ON s.fileId = f.id 
     WHERE s.creatorId = ? AND s.active = 1`, 
    [req.user.id]
  );
  
  const sanitized = shares.map(s => {
    const { password, ...rest } = s;
    return { ...rest, hasPassword: !!password };
  });

  res.json({ shares: sanitized });
};

export const deleteShare = async (req, res) => {
  const share = await db.get('SELECT * FROM shares WHERE id = ? AND creatorId = ?', [req.params.id, req.user.id]);
  if (!share) return res.status(404).json({ error: 'Share not found' });

  await db.run('UPDATE shares SET active = 0 WHERE id = ?', [req.params.id]);
  res.json({ status: 'success' });
};
