import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';

export const getFolders = async (req, res) => {
  const folders = await db.all('SELECT * FROM folders WHERE ownerId = ?', [req.user.id]);
  res.json({ folders });
};

export const createFolder = async (req, res) => {
  const { name, parentId } = req.body;
  if (!name) return res.status(400).json({ error: 'Folder name required' });

  const id = uuidv4();
  const folder = {
    id,
    ownerId: req.user.id,
    name,
    parentId: parentId || null,
    createdAt: new Date().toISOString()
  };

  await db.run(
    'INSERT INTO folders (id, ownerId, name, parentId, createdAt) VALUES (?, ?, ?, ?, ?)',
    [folder.id, folder.ownerId, folder.name, folder.parentId, folder.createdAt]
  );

  res.json({ status: 'success', folder });
};

export const deleteFolder = async (req, res) => {
  const folder = await db.get('SELECT * FROM folders WHERE id = ? AND ownerId = ?', [req.params.id, req.user.id]);
  if (!folder) return res.status(404).json({ error: 'Folder not found' });

  const hasFiles = await db.get('SELECT id FROM files WHERE parentId = ? LIMIT 1', [req.params.id]);
  const hasFolders = await db.get('SELECT id FROM folders WHERE parentId = ? LIMIT 1', [req.params.id]);
  
  if (hasFiles || hasFolders) {
    return res.status(400).json({ error: 'Folder is not empty' });
  }

  await db.run('DELETE FROM folders WHERE id = ?', [req.params.id]);
  res.json({ status: 'success' });
};
