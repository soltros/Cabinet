import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET } from '../config.js';
import logger from '../logger.js';

const getCookie = (req, name) => {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return null;
};

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = bearer || getCookie(req, 'cabinet_token');

    if (!token) {
      logger.debug('Authentication rejected: no token', {
        requestId: req.requestId || null,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
      });
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.debug('Authentication rejected: invalid token', {
        requestId: req.requestId || null,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        reason: error?.name || 'verification_failed'
      });
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const user = await db.get(
      'SELECT id, username, quota, usedSpace, role FROM users WHERE id = ?',
      [payload.id]
    );
    if (!user) {
      logger.debug('Authentication rejected: user no longer exists', {
        requestId: req.requestId || null,
        userId: payload.id,
        method: req.method,
        url: req.originalUrl
      });
      return res.status(401).json({ error: 'Invalid session' });
    }

    logger.debug('Authentication accepted', {
      requestId: req.requestId || null,
      userId: user.id,
      username: user.username,
      role: user.role,
      method: req.method,
      url: req.originalUrl
    });

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
