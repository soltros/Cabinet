import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, asyncHandler } from '../middlewares/auth.js';
import { uploadFile, getFiles, patchFile, deleteFile, getFileContent, getThumbnail } from '../controllers/files.js';
import { STORAGE_ROOT, initUserStorage } from '../storage.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = req.user.id; 
      await initUserStorage(userId);
      const uploadPath = path.join(STORAGE_ROOT, userId, 'user_data');
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    req.fileId = uuidv4();
    cb(null, req.fileId);
  }
});

const MAX_UPLOAD_SIZE = process.env.MAX_UPLOAD_SIZE || 500 * 1024 * 1024; // 500MB default

const upload = multer({ 
  storage,
  limits: { fileSize: Number(MAX_UPLOAD_SIZE) }
});

router.post('/', authenticateToken, upload.single('file'), asyncHandler(uploadFile));
router.get('/', authenticateToken, asyncHandler(getFiles));
router.patch('/:id', authenticateToken, asyncHandler(patchFile));
router.delete('/:id', authenticateToken, asyncHandler(deleteFile));
router.get('/:id/content', authenticateToken, asyncHandler(getFileContent));
router.get('/:id/thumbnail', authenticateToken, asyncHandler(getThumbnail));

export default router;
