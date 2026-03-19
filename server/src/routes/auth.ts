import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  university: z.string().optional(),
  yearOfStudy: z.number().int().min(1).max(8).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function signToken(userId: string, email: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET missing');
  return jwt.sign({ userId, email }, secret, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse({
      ...req.body,
      yearOfStudy: req.body.yearOfStudy ? Number(req.body.yearOfStudy) : undefined
    });

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ error: 'Email already in use.' });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        university: data.university,
        yearOfStudy: data.yearOfStudy
      }
    });

    const token = signToken(user.id, user.email);
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        university: user.university,
        yearOfStudy: user.yearOfStudy,
        studyStreak: user.studyStreak,
        telegramLinked: user.telegramLinked
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message ?? 'Invalid request.' });
    }
    return res.status(500).json({ error: 'Could not register user.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const matches = await bcrypt.compare(data.password, user.passwordHash);
    if (!matches) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = signToken(user.id, user.email);
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        university: user.university,
        yearOfStudy: user.yearOfStudy,
        studyStreak: user.studyStreak,
        telegramLinked: user.telegramLinked
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message ?? 'Invalid request.' });
    }
    return res.status(500).json({ error: 'Could not log in.' });
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) return res.status(404).json({ error: 'User not found.' });

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      university: user.university,
      yearOfStudy: user.yearOfStudy,
      studyStreak: user.studyStreak,
      telegramLinked: user.telegramLinked,
      telegramHandle: user.telegramHandle
    }
  });
});

export default router;
