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

// Default schema
const defaultData = { files: [], shares: [], users: [], folders: [] };
const db = new Low(adapter, defaultData);

// Read data or initialize with defaults
await db.read();
db.data ||= defaultData;

// Seed Default Admin
if (!db.data.users.find(u => u.username === 'admin')) {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const userId = uuidv4();
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

export { db };