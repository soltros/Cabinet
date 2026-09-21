import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, asyncHandler } from '../middlewares/auth.js';
import {
  uploadFile, getFiles, patchFile, deleteFile, getFileContent, getThumbnail, shareFileWithUser
} from '../controllers/files.js';
import { STORAGE_ROOT, initUserStorage } from '../storage.js';
import { MAX_UPLOAD_SIZE } from '../config.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const paths = await initUserStorage(req.user.id);
      cb(null, paths.data);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    req.fileId = uuidv4();
    cb(null, req.fileId);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE, files: 1 }
});

router.post('/', authenticateToken, upload.single('file'), asyncHandler(uploadFile));
router.get('/', authenticateToken, asyncHandler(getFiles));
router.post('/:id/share', authenticateToken, asyncHandler(shareFileWithUser));
router.patch('/:id', authenticateToken, asyncHandler(patchFile));
router.delete('/:id', authenticateToken, asyncHandler(deleteFile));
router.get('/:id/content', authenticateToken, asyncHandler(getFileContent));
router.get('/:id/thumbnail', authenticateToken, asyncHandler(getThumbnail));

export default router;
