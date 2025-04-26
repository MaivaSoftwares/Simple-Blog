import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials.' });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials.' });
    return;
  }
  const token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
  res.json({ message: 'Login successful' });
  return;
});

// GET /api/admin/me
router.get('/me', requireAuth, async (req, res) => {
  const user = (req as AuthRequest).user;
  res.json({ user });
  return;
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
  return;
});

// POST /api/admin/change-password
router.post('/change-password', requireAuth, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required.' });
  }
  const user = await User.findById(req.user!._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Current password is incorrect.' });
  }
  const hash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = hash;
  await user.save();
  return res.json({ message: 'Password changed successfully.' });
});

export default router;
