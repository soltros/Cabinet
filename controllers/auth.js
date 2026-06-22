import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import { initUserStorage } from '../storage.js';
import logger from '../logger.js';

export const register = async (req, res) => {
  try {
    const { username, password, registrationCode } = req.body;

    const requiredCode = process.env.REGISTRATION_CODE;
    if (requiredCode && registrationCode !== requiredCode) {
      return res.status(400).json({ error: 'Invalid sign-up code' });
    }

    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and dashes.' });
    }

    const existing = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) return res.status(400).json({ error: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    
    await db.run(
      'INSERT INTO users (id, username, password, quota, usedSpace, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, username, hashedPassword, 53687091200, 0, 'user']
    );

    await initUserStorage(id);
    logger.info(`New user registered: ${username}`);

    res.json({ status: 'success', userId: id });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET || 'dev-secret-key', 
      { expiresIn: '24h' }
    );
    res.json({ token, userId: user.id });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};
