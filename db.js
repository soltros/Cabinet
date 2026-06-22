import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import { STORAGE_ROOT, initUserStorage } from './storage.js';
import logger from './logger.js';

await fs.mkdir(STORAGE_ROOT, { recursive: true });
const file = path.join(STORAGE_ROOT, 'database.sqlite');

logger.info(`[DB] Loading database from: ${file}`);

const db = await open({
  filename: file,
  driver: sqlite3.Database
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    quota INTEGER NOT NULL,
    usedSpace INTEGER NOT NULL DEFAULT 0,
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
    downloads INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(fileId) REFERENCES files(id),
    FOREIGN KEY(creatorId) REFERENCES users(id)
  );
`);

// Seed Admin
const adminUser = await db.get('SELECT id FROM users WHERE username = ?', ['admin']);
if (!adminUser) {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const ADMIN_ID = '00000000-0000-0000-0000-000000000000';
  await db.run(
    'INSERT INTO users (id, username, password, quota, usedSpace, role) VALUES (?, ?, ?, ?, ?, ?)',
    [ADMIN_ID, 'admin', hashedPassword, 50 * 1024 * 1024 * 1024, 0, 'admin']
  );
  await initUserStorage(ADMIN_ID);
  logger.info('Default admin user created: admin / admin123');
}

export { db };