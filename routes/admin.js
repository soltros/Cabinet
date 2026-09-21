import express from 'express';
import { authenticateToken, isAdmin, asyncHandler } from '../middlewares/auth.js';
import {
  getStats, getAdminShares, deleteAdminShare, getUsers, createUser, updateUser,
  deleteUser, getLogs, backupDatabase, scrubDatabase
} from '../controllers/admin.js';

const router = express.Router();

router.use(authenticateToken, isAdmin);

router.get('/stats', asyncHandler(getStats));
router.get('/shares', asyncHandler(getAdminShares));
router.delete('/shares/:id', asyncHandler(deleteAdminShare));
router.get('/users', asyncHandler(getUsers));
router.post('/users', asyncHandler(createUser));
router.patch('/users/:id', asyncHandler(updateUser));
router.delete('/users/:id', asyncHandler(deleteUser));
router.get('/logs', asyncHandler(getLogs));
router.get('/backup/db', asyncHandler(backupDatabase));
router.post('/scrub', asyncHandler(scrubDatabase));

export default router;
