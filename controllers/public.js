import bcrypt from 'bcryptjs';
import { pipeline } from 'stream/promises';
import { db } from '../db.js';
import { createDecryptionStream } from '../crypto.js';
import { ENCRYPTION_KEY } from '../config.js';
import logger from '../logger.js';

const getUsableShare = async (id) => {
  const share = await db.get(
    `SELECT s.*, f.name, f.size, f.mimeType, f.path
     FROM shares s
     JOIN files f ON f.id = s.fileId
     WHERE s.id = ? AND s.active = 1`,
    [id]
  );
  if (!share) return { error: [404, 'Link not found'] };
  if (share.expiresAt && Date.now() >= new Date(share.expiresAt).getTime()) {
    return { error: [410, 'Link expired'] };
  }
  if (share.downloadLimit !== null && share.downloads >= share.downloadLimit) {
    return { error: [410, 'Download limit reached'] };
  }
  return { share };
};

const checkPassword = async (share, password) => {
  if (!share.password) return true;
  return typeof password === 'string' && bcrypt.compare(password, share.password);
};

export const getShareInfo = async (req, res) => {
  const result = await getUsableShare(req.params.id);
  if (result.error) return res.status(result.error[0]).json({ error: result.error[1] });
  const { share } = result;
  res.json({
    id: share.id,
    name: share.name,
    size: share.size,
    mimeType: share.mimeType,
    isPasswordProtected: Boolean(share.password),
    downloadLimit: share.downloadLimit,
    downloads: share.downloads,
    expiresAt: share.expiresAt
  });
};

export const verifyShare = async (req, res) => {
  const result = await getUsableShare(req.params.id);
  if (result.error) return res.status(result.error[0]).json({ error: result.error[1] });
  if (!(await checkPassword(result.share, req.body.password))) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  res.json({ status: 'success' });
};

export const downloadShare = async (req, res) => {
  const result = await getUsableShare(req.params.id);
  if (result.error) return res.status(result.error[0]).json({ error: result.error[1] });
  const { share } = result;

  if (!(await checkPassword(share, req.body.password))) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const reservation = await db.run(
    `UPDATE shares
     SET downloads = downloads + 1
     WHERE id = ?
       AND active = 1
       AND (expiresAt IS NULL OR expiresAt > ?)
       AND (downloadLimit IS NULL OR downloads < downloadLimit)`,
    [share.id, new Date().toISOString()]
  );
  if (reservation.changes !== 1) {
    return res.status(410).json({ error: 'Share is no longer available' });
  }

  try {
    res.status(200);
    res.setHeader('Content-Length', share.size);
    res.setHeader('Content-Type', share.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(share.name)}`);

    const stream = await createDecryptionStream(share.path, ENCRYPTION_KEY);
    await pipeline(stream, res);
  } catch (error) {
    await db.run(
      'UPDATE shares SET downloads = MAX(0, downloads - 1) WHERE id = ?',
      [share.id]
    ).catch(() => {});
    logger.error('Public download failed', { shareId: share.id, error: error.message });
    if (!res.headersSent) res.status(500).json({ error: 'Download failed' });
  }
};
