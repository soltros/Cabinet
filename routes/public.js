import express from 'express';
import { asyncHandler } from '../middlewares/auth.js';
import { getShareInfo, verifyShare, downloadShare } from '../controllers/public.js';

const router = express.Router();

router.get('/shares/:id', asyncHandler(getShareInfo));
router.post('/shares/:id/verify', asyncHandler(verifyShare));
router.post('/shares/:id/download', asyncHandler(downloadShare));

export default router;
