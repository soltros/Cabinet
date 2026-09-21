import express from 'express';
import { asyncHandler } from '../middlewares/auth.js';
import { rateLimit } from '../middlewares/rateLimit.js';
import { getShareInfo, verifyShare, downloadShare } from '../controllers/public.js';

const router = express.Router();

const sharePasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => `${req.ip}:${req.params.id}`
});

router.get('/shares/:id', asyncHandler(getShareInfo));
router.post('/shares/:id/verify', sharePasswordLimiter, asyncHandler(verifyShare));
router.post('/shares/:id/download', sharePasswordLimiter, asyncHandler(downloadShare));

export default router;
