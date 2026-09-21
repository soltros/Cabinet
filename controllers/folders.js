import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';

const validateParent = async (ownerId, parentId) => {
  if (!parentId) return true;
  return Boolean(await db.get(
    'SELECT id FROM folders WHERE id = ? AND ownerId = ?',
    [parentId, ownerId]
  ));
};

export const getFolders = async (req, res) => {
  const folders = await db.all(
    'SELECT * FROM folders WHERE ownerId = ? ORDER BY createdAt ASC',
    [req.user.id]
  );
  res.json({ folders });
};

export const createFolder = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const parentId = req.body.parentId || null;
  if (!name) return res.status(400).json({ error: 'Folder name required' });
  if (!(await validateParent(req.user.id, parentId))) {
    return res.status(400).json({ error: 'Invalid parent folder' });
  }

  const folder = {
    id: uuidv4(),
    ownerId: req.user.id,
    name,
    parentId,
    createdAt: new Date().toISOString()
  };

  await db.run(
    'INSERT INTO folders (id, ownerId, name, parentId, createdAt) VALUES (?, ?, ?, ?, ?)',
    [folder.id, folder.ownerId, folder.name, folder.parentId, folder.createdAt]
  );

  res.status(201).json({ status: 'success', folder });
};

export const deleteFolder = async (req, res) => {
  const folder = await db.get(
    'SELECT * FROM folders WHERE id = ? AND ownerId = ?',
    [req.params.id, req.user.id]
  );
  if (!folder) return res.status(404).json({ error: 'Folder not found' });

  const hasFiles = await db.get(
    'SELECT id FROM files WHERE parentId = ? AND ownerId = ? LIMIT 1',
    [req.params.id, req.user.id]
  );
  const hasFolders = await db.get(
    'SELECT id FROM folders WHERE parentId = ? AND ownerId = ? LIMIT 1',
    [req.params.id, req.user.id]
  );

  if (hasFiles || hasFolders) {
    return res.status(409).json({ error: 'Folder is not empty' });
  }

  await db.run('DELETE FROM folders WHERE id = ? AND ownerId = ?', [req.params.id, req.user.id]);
  res.json({ status: 'success' });
};
