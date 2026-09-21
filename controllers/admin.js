import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import { initUserStorage, STORAGE_ROOT } from '../storage.js';
import { DEFAULT_USER_QUOTA } from '../config.js';
import logger from '../logger.js';

const validateUsername = (username) => /^[a-zA-Z0-9_-]{3,20}$/.test(username || '');
const validatePassword = (password) => typeof password === 'string' && password.length >= 12;

export const getStats = async (req, res) => {
  const row = await db.get(
    `SELECT COUNT(*) AS totalUsers,
            COALESCE(SUM(usedSpace), 0) AS totalStorageUsed,
            COALESCE(SUM(quota), 0) AS totalStorageQuota
     FROM users`
  );
  const files = await db.get('SELECT COUNT(*) AS totalFiles FROM files');
  const shares = await db.get('SELECT COUNT(*) AS totalShares FROM shares WHERE active = 1');
  res.json({ ...row, ...files, ...shares });
};

export const getAdminShares = async (req, res) => {
  const shares = await db.all(
    `SELECT s.id, s.fileId, s.creatorId, s.expiresAt, s.downloadLimit,
            s.downloads, s.active, s.createdAt,
            (s.password IS NOT NULL) AS hasPassword,
            f.name AS fileName, f.size AS fileSize, u.username AS creatorName
     FROM shares s
     LEFT JOIN files f ON s.fileId = f.id
     LEFT JOIN users u ON s.creatorId = u.id
     ORDER BY s.createdAt DESC`
  );
  res.json({ shares });
};

export const deleteAdminShare = async (req, res) => {
  const result = await db.run('UPDATE shares SET active = 0 WHERE id = ?', [req.params.id]);
  if (result.changes !== 1) return res.status(404).json({ error: 'Share not found' });
  res.json({ status: 'success' });
};

export const getUsers = async (req, res) => {
  const users = await db.all(
    'SELECT id, username, quota, usedSpace, role FROM users ORDER BY username COLLATE NOCASE'
  );
  res.json({ users });
};

export const createUser = async (req, res) => {
  const username = String(req.body.username || '').trim();
  const { password } = req.body;
  const quota = Number(req.body.quota || DEFAULT_USER_QUOTA);

  if (!validateUsername(username)) return res.status(400).json({ error: 'Invalid username' });
  if (!validatePassword(password)) return res.status(400).json({ error: 'Password must be at least 12 characters' });
  if (!Number.isSafeInteger(quota) || quota <= 0) return res.status(400).json({ error: 'Invalid quota' });

  const existing = await db.get('SELECT id FROM users WHERE username = ?', [username]);
  if (existing) return res.status(409).json({ error: 'User exists' });

  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 12);
  await db.run(
    'INSERT INTO users (id, username, password, quota, usedSpace, role) VALUES (?, ?, ?, ?, 0, ?)',
    [id, username, hashedPassword, quota, 'user']
  );
  try {
    await initUserStorage(id);
  } catch (error) {
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    throw error;
  }

  res.status(201).json({ status: 'success', user: { id, username, quota, usedSpace: 0, role: 'user' } });
};

export const updateUser = async (req, res) => {
  const user = await db.get('SELECT id, usedSpace FROM users WHERE id = ?', [req.params.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (req.body.password !== undefined) {
    if (!validatePassword(req.body.password)) {
      return res.status(400).json({ error: 'Password must be at least 12 characters' });
    }
    await db.run(
      'UPDATE users SET password = ? WHERE id = ?',
      [await bcrypt.hash(req.body.password, 12), req.params.id]
    );
  }

  if (req.body.quota !== undefined) {
    const quota = Number(req.body.quota);
    if (!Number.isSafeInteger(quota) || quota < user.usedSpace) {
      return res.status(400).json({ error: 'Quota must be an integer at least as large as current usage' });
    }
    await db.run('UPDATE users SET quota = ? WHERE id = ?', [quota, req.params.id]);
  }

  res.json({ status: 'success' });
};

export const deleteUser = async (req, res) => {
  const ADMIN_ID = '00000000-0000-0000-0000-000000000000';
  if (req.params.id === ADMIN_ID) {
    return res.status(400).json({ error: 'Cannot delete the bootstrap administrator' });
  }

  const user = await db.get('SELECT id FROM users WHERE id = ?', [req.params.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const userDir = path.join(STORAGE_ROOT, req.params.id);
  const stagedDir = `${userDir}.deleting-${uuidv4()}`;
  let staged = false;
  try {
    await fs.rename(userDir, stagedDir);
    staged = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  try {
    await db.exec('BEGIN IMMEDIATE');
    await db.run('DELETE FROM shared_files WHERE userId = ? OR sharedBy = ?', [req.params.id, req.params.id]);
    await db.run('DELETE FROM shares WHERE creatorId = ? OR fileId IN (SELECT id FROM files WHERE ownerId = ?)', [req.params.id, req.params.id]);
    await db.run('DELETE FROM files WHERE ownerId = ?', [req.params.id]);
    await db.run('DELETE FROM folders WHERE ownerId = ?', [req.params.id]);
    await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK').catch(() => {});
    if (staged) await fs.rename(stagedDir, userDir).catch(() => {});
    throw error;
  }

  if (staged) {
    await fs.rm(stagedDir, { recursive: true, force: true }).catch((error) => {
      logger.error('Failed to remove deleted user storage', { userId: req.params.id, error: error.message });
    });
  }
  res.json({ status: 'success' });
};

export const getLogs = async (req, res) => {
  const logPath = path.join(STORAGE_ROOT, 'cabinet.log');
  try {
    if (req.query.download === 'true') return res.download(logPath, 'cabinet.log');
    const content = await fs.readFile(logPath, 'utf8');
    res.type('text/plain').send(content.slice(-1024 * 1024));
  } catch (error) {
    if (error.code === 'ENOENT') return res.type('text/plain').send('');
    throw error;
  }
};

export const backupDatabase = async (req, res) => {
  const backup = {
    exportedAt: new Date().toISOString(),
    users: await db.all('SELECT id, username, quota, usedSpace, role FROM users'),
    files: await db.all('SELECT * FROM files'),
    folders: await db.all('SELECT * FROM folders'),
    shares: await db.all('SELECT id, fileId, creatorId, expiresAt, downloadLimit, downloads, active, createdAt FROM shares'),
    sharedFiles: await db.all('SELECT * FROM shared_files')
  };
  res.setHeader('Content-Disposition', `attachment; filename="cabinet-backup-${new Date().toISOString().slice(0, 10)}.json"`);
  res.json(backup);
};

export const scrubDatabase = async (req, res) => {
  const files = await db.all('SELECT id, ownerId, path, size FROM files');
  let removedCount = 0;

  for (const file of files) {
    try {
      await fs.access(file.path);
    } catch {
      await db.exec('BEGIN IMMEDIATE');
      try {
        await db.run('DELETE FROM shared_files WHERE fileId = ?', [file.id]);
        await db.run('DELETE FROM shares WHERE fileId = ?', [file.id]);
        await db.run('DELETE FROM files WHERE id = ?', [file.id]);
        await db.run(
          'UPDATE users SET usedSpace = MAX(0, usedSpace - ?) WHERE id = ?',
          [file.size, file.ownerId]
        );
        await db.exec('COMMIT');
        removedCount += 1;
      } catch (error) {
        await db.exec('ROLLBACK').catch(() => {});
        throw error;
      }
    }
  }

  res.json({ status: 'success', removedCount });
};
