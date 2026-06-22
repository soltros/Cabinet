import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] || req.query.token;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', async (err, userPayload) => {
    if (err) return res.sendStatus(403);
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userPayload.id]);
    if (!user) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
