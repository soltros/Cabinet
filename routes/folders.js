import express from 'express';
import { authenticateToken, asyncHandler } from '../middlewares/auth.js';
import { getFolders, createFolder, deleteFolder } from '../controllers/folders.js';

const router = express.Router();

router.get('/', authenticateToken, asyncHandler(getFolders));
router.post('/', authenticateToken, asyncHandler(createFolder));
router.delete('/:id', authenticateToken, asyncHandler(deleteFolder));

export default router;
