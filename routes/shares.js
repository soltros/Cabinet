import express from 'express';
import { authenticateToken, asyncHandler } from '../middlewares/auth.js';
import { createShare, getShares, deleteShare } from '../controllers/shares.js';

const router = express.Router();

router.post('/', authenticateToken, asyncHandler(createShare));
router.get('/', authenticateToken, asyncHandler(getShares));
router.delete('/:id', authenticateToken, asyncHandler(deleteShare));

export default router;
