import express from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.post('/link-code', requireAuth, async (req: AuthRequest, res) => {
  const code = crypto.randomBytes(3).toString('hex').toUpperCase();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.telegramLinkCode.create({
    data: {
      userId: req.user!.userId,
      code,
      expiresAt
    }
  });

  const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'KenyanMedHubBot';
  res.json({
    code,
    expiresAt,
    botUsername,
    deepLink: `https://t.me/${botUsername}?start=${code}`
  });
});

export default router;
