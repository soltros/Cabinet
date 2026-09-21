import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import { initUserStorage } from '../storage.js';
import logger from '../logger.js';
import {
  ALLOW_REGISTRATION,
  DEFAULT_USER_QUOTA,
  JWT_SECRET,
  COOKIE_SECURE,
  REGISTRATION_CODE
} from '../config.js';

const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
const cookieOptions = [
  'HttpOnly',
  'Path=/',
  'SameSite=Strict',
  'Max-Age=86400',
  COOKIE_SECURE ? 'Secure' : null
].filter(Boolean).join('; ');

const validatePassword = (password) =>
  typeof password === 'string' && password.length >= 12;

export const register = async (req, res) => {
  const { username, password, registrationCode } = req.body;

  if (!ALLOW_REGISTRATION && !REGISTRATION_CODE) {
    return res.status(403).json({ error: 'Registration is disabled' });
  }
  if (REGISTRATION_CODE && registrationCode !== REGISTRATION_CODE) {
    return res.status(400).json({ error: 'Invalid sign-up code' });
  }
  if (!usernameRegex.test(username || '')) {
    return res.status(400).json({
      error: 'Username must be 3-20 characters and contain only letters, numbers, underscores, and dashes.'
    });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 12 characters long' });
  }

  const existing = await db.get('SELECT id FROM users WHERE username = ?', [username]);
  if (existing) return res.status(409).json({ error: 'User exists' });

  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 12);

  await db.run(
    'INSERT INTO users (id, username, password, quota, usedSpace, role) VALUES (?, ?, ?, ?, 0, ?)',
    [id, username, hashedPassword, DEFAULT_USER_QUOTA, 'user']
  );

  try {
    await initUserStorage(id);
  } catch (error) {
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    throw error;
  }

  logger.info(`New user registered: ${username}`);
  res.status(201).json({ status: 'success', userId: id });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
  const valid = user ? await bcrypt.compare(password, user.password) : false;
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.setHeader('Set-Cookie', `cabinet_token=${encodeURIComponent(token)}; ${cookieOptions}`);
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

export const logout = async (req, res) => {
  const secure = COOKIE_SECURE ? '; Secure' : '';
  res.setHeader('Set-Cookie', `cabinet_token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secure}`);
  res.json({ status: 'success' });
};
