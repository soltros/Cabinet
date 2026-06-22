import express from 'express';
import { authenticateToken, isAdmin, asyncHandler } from '../middlewares/auth.js';
import { getStats, getAdminShares, deleteAdminShare, getUsers, createUser, updateUser, deleteUser } from '../controllers/admin.js';

const router = express.Router();

router.use(authenticateToken, isAdmin);

router.get('/stats', asyncHandler(getStats));
router.get('/shares', asyncHandler(getAdminShares));
router.delete('/shares/:id', asyncHandler(deleteAdminShare));
router.get('/users', asyncHandler(getUsers));
router.post('/users', asyncHandler(createUser));
router.put('/users/:id', asyncHandler(updateUser));
router.delete('/users/:id', asyncHandler(deleteUser));

export default router;
