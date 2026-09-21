import express from 'express';
import { register, login, logout, me } from '../controllers/auth.js';
import { authenticateToken, asyncHandler } from '../middlewares/auth.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => `${req.ip}:${String(req.body?.username || '').toLowerCase()}`
});

router.post('/register', authLimiter, asyncHandler(register));
router.post('/login', authLimiter, asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', authenticateToken, asyncHandler(me));

export default router;
