import express from 'express';
import { register, login } from '../controllers/auth.js';
import { asyncHandler } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

export default router;
