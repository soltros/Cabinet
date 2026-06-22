import { db } from '../db.js';

export const getStats = async (req, res) => {
  const users = await db.all('SELECT quota, usedSpace FROM users');
  const totalUsers = users.length;
  
  const filesCount = await db.get('SELECT COUNT(*) as c FROM files');
  const totalFiles = filesCount.c;

  const sharesCount = await db.get('SELECT COUNT(*) as c FROM shares WHERE active = 1');
  const totalShares = sharesCount.c;
  
  const totalStorageUsed = users.reduce((acc, u) => acc + (u.usedSpace || 0), 0);
  const totalStorageQuota = users.reduce((acc, u) => acc + (u.quota || 53687091200), 0);

  res.json({
    totalUsers,
    totalFiles,
    totalShares,
    totalStorageUsed,
    totalStorageQuota
  });
};

export const getAdminShares = async (req, res) => {
  const shares = await db.all(`
    SELECT s.*, f.name as fileName, f.size as fileSize, u.username as creatorName
    FROM shares s
    LEFT JOIN files f ON s.fileId = f.id
    LEFT JOIN users u ON s.creatorId = u.id
  `);
  
  res.json({ shares });
};

export const deleteAdminShare = async (req, res) => {
  const share = await db.get('SELECT * FROM shares WHERE id = ?', [req.params.id]);
  if (!share) return res.status(404).json({ error: 'Share not found' });

  await db.run('UPDATE shares SET active = 0 WHERE id = ?', [req.params.id]);
  res.json({ status: 'success' });
};

export const getUsers = async (req, res) => {
  const users = await db.all('SELECT id, username, quota, usedSpace, role FROM users');
  res.json({ users });
};

export const createUser = async (req, res) => {
  const { username, password, quota } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  const existing = await db.get('SELECT id FROM users WHERE username = ?', [username]);
  if (existing) return res.status(400).json({ error: 'User exists' });

  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  const { v4: uuidv4 } = await import('uuid');
  const id = uuidv4();
  
  await db.run(
    'INSERT INTO users (id, username, password, quota, usedSpace, role) VALUES (?, ?, ?, ?, ?, ?)',
    [id, username, hashedPassword, quota || 53687091200, 0, 'user']
  );

  const { initUserStorage } = await import('../storage.js');
  await initUserStorage(id);

  res.json({ status: 'success' });
};

export const updateUser = async (req, res) => {
  const { password, quota } = req.body;
  const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (password) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);
  }
  
  if (quota) {
    await db.run('UPDATE users SET quota = ? WHERE id = ?', [quota, req.params.id]);
  }

  res.json({ status: 'success' });
};

export const deleteUser = async (req, res) => {
  if (req.params.id === '00000000-0000-0000-0000-000000000000') {
    return res.status(400).json({ error: 'Cannot delete default admin' });
  }

  const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });

  await db.run('DELETE FROM shares WHERE creatorId = ?', [req.params.id]);
  await db.run('DELETE FROM files WHERE ownerId = ?', [req.params.id]);
  await db.run('DELETE FROM folders WHERE ownerId = ?', [req.params.id]);
  await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);

  res.json({ status: 'success' });
};
