import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing_credentials' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '8h' });
  res.cookie('sid', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.json({ ok: true });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('sid');
  res.json({ ok: true });
});

export default router;
