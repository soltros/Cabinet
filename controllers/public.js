import fs from 'fs/promises';
import fsSync from 'fs';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { createDecryptionStream, deriveKey } from '../crypto.js';
import logger from '../logger.js';

export const getShareInfo = async (req, res) => {
  const share = await db.get('SELECT * FROM shares WHERE id = ?', [req.params.id]);
  if (!share || !share.active) return res.status(404).json({ error: 'Link not found or expired' });

  if (share.expiresAt && new Date() > new Date(share.expiresAt)) return res.status(410).json({ error: 'Link expired' });
  if (share.downloadLimit && share.downloads >= share.downloadLimit) return res.status(410).json({ error: 'Download limit reached' });

  const file = await db.get('SELECT * FROM files WHERE id = ?', [share.fileId]);
  if (!file) return res.status(404).json({ error: 'File source not found' });

  res.json({
    name: file.name,
    size: file.size,
    mimeType: file.mimeType,
    isPasswordProtected: !!share.password,
    id: share.id
  });
};

export const verifyShare = async (req, res) => {
  const { password } = req.body;
  const share = await db.get('SELECT * FROM shares WHERE id = ?', [req.params.id]);
  if (!share || !share.active) return res.status(404).json({ error: 'Link not found' });

  if (share.expiresAt && new Date() > new Date(share.expiresAt)) return res.status(410).json({ error: 'Link expired' });
  if (share.downloadLimit && share.downloads >= share.downloadLimit) return res.status(410).json({ error: 'Download limit reached' });

  if (share.password) {
    if (!password || !(await bcrypt.compare(password, share.password))) {
      return res.status(401).json({ error: 'Invalid password' });
    }
  }

  res.json({ status: 'success' });
};

export const downloadShare = async (req, res) => {
  const { password } = req.body;
  const share = await db.get('SELECT * FROM shares WHERE id = ?', [req.params.id]);
  if (!share || !share.active) return res.status(404).json({ error: 'Link not found' });

  if (share.expiresAt && new Date() > new Date(share.expiresAt)) return res.status(410).json({ error: 'Link expired' });
  if (share.downloadLimit && share.downloads >= share.downloadLimit) return res.status(410).json({ error: 'Download limit reached' });

  if (share.password) {
    if (!password || !(await bcrypt.compare(password, share.password))) {
      return res.status(401).json({ error: 'Password required' });
    }
  }

  const file = await db.get('SELECT * FROM files WHERE id = ?', [share.fileId]);
  if (!file) return res.status(404).json({ error: 'File not found' });

  await db.run('UPDATE shares SET downloads = downloads + 1 WHERE id = ?', [share.id]);

  try {
    const stat = await fs.stat(file.path);
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
      logger.error('Public download stream error:', err);
      if (!res.headersSent) res.sendStatus(500);
    });
    stream.pipe(res);
  } catch (error) {
    logger.error('Public download error:', error);
    res.status(500).send('Internal Server Error');
  }
};
