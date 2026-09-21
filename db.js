import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import { STORAGE_ROOT, initUserStorage } from './storage.js';
import logger from './logger.js';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  DEFAULT_USER_QUOTA
} from './config.js';

await fs.mkdir(STORAGE_ROOT, { recursive: true });
const file = path.join(STORAGE_ROOT, 'database.sqlite');

logger.info(`[DB] Loading database from: ${file}`);

const db = await open({
  filename: file,
  driver: sqlite3.Database
});

await db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;');

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    quota INTEGER NOT NULL,
    usedSpace INTEGER NOT NULL DEFAULT 0 CHECK (usedSpace >= 0),
    role TEXT NOT NULL DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    ownerId TEXT NOT NULL,
    name TEXT NOT NULL,
    extension TEXT,
    mimeType TEXT,
    size INTEGER NOT NULL,
    hash TEXT,
    path TEXT NOT NULL,
    parentId TEXT,
    thumbnail TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(ownerId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS folders (
    id TEXT PRIMARY KEY,
    ownerId TEXT NOT NULL,
    name TEXT NOT NULL,
    parentId TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(ownerId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS shares (
    id TEXT PRIMARY KEY,
    fileId TEXT NOT NULL,
    creatorId TEXT NOT NULL,
    password TEXT,
    expiresAt TEXT,
    downloadLimit INTEGER,
    downloads INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(fileId) REFERENCES files(id),
    FOREIGN KEY(creatorId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS shared_files (
    fileId TEXT NOT NULL,
    userId TEXT NOT NULL,
    sharedBy TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    PRIMARY KEY(fileId, userId),
    FOREIGN KEY(fileId) REFERENCES files(id),
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(sharedBy) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_files_owner_parent ON files(ownerId, parentId);
  CREATE INDEX IF NOT EXISTS idx_folders_owner_parent ON folders(ownerId, parentId);
  CREATE INDEX IF NOT EXISTS idx_shares_creator_active ON shares(creatorId, active);
  CREATE INDEX IF NOT EXISTS idx_shares_file ON shares(fileId);
  CREATE INDEX IF NOT EXISTS idx_shared_files_user ON shared_files(userId);
`);

const ADMIN_ID = '00000000-0000-0000-0000-000000000000';
const adminUser = await db.get('SELECT id, password FROM users WHERE id = ?', [ADMIN_ID]);

if (!adminUser) {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await db.run(
    'INSERT INTO users (id, username, password, quota, usedSpace, role) VALUES (?, ?, ?, ?, 0, ?)',
    [ADMIN_ID, ADMIN_USERNAME, hashedPassword, DEFAULT_USER_QUOTA, 'admin']
  );
  await initUserStorage(ADMIN_ID);
  logger.info(`Initial administrator created: ${ADMIN_USERNAME}`);
} else if (await bcrypt.compare('admin123', adminUser.password)) {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await db.run(
    'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
    [ADMIN_USERNAME, hashedPassword, 'admin', ADMIN_ID]
  );
  logger.warn('Replaced legacy default administrator credentials from configuration');
}

export { db };
