import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_ROOT, initUserStorage } from './storage.js';

// Initialize DB in the persistent storage volume
await fs.mkdir(STORAGE_ROOT, { recursive: true });
const file = path.join(STORAGE_ROOT, 'database.json');
const adapter = new JSONFile(file);

console.log(`[DB] Loading database from: ${file}`);

// Default schema
const defaultData = { files: [], shares: [], users: [], folders: [] };
const db = new Low(adapter, defaultData);

// Read data or initialize with defaults
await db.read();

// Ensure schema integrity (in case of partial data or empty object)
db.data ||= { ...defaultData };
db.data.files ||= [];
db.data.shares ||= [];
db.data.users ||= [];
db.data.folders ||= [];

// Static Admin ID to prevent data loss on DB reset
const ADMIN_ID = '00000000-0000-0000-0000-000000000000';

// Seed Default Admin
if (!db.data.users.find(u => u.username === 'admin')) {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const userId = ADMIN_ID;
  db.data.users.push({
    id: userId,
    username: 'admin',
    password: hashedPassword,
    quota: 50 * 1024 * 1024 * 1024, // 50GB
    usedSpace: 0
  });
  await initUserStorage(userId);
  console.log('Default admin user created: admin / admin123');
}

await db.write();

console.log(`[DB] Database loaded. Users: ${db.data.users.length}, Files: ${db.data.files.length}`);

export { db };