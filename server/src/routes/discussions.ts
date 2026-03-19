import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.get('/topics', async (_req, res) => {
  const topics = await prisma.discussionTopic.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ topics });
});

router.get('/:topicId', async (req, res) => {
  const messages = await prisma.discussion.findMany({
    where: { topicId: req.params.topicId },
    orderBy: { createdAt: 'asc' },
    include: { user: true }
  });
  res.json({ messages });
});

const messageSchema = z.object({
  topicId: z.string().min(1),
  content: z.string().min(2).max(500)
});

router.post('/message', requireAuth, async (req: AuthRequest, res) => {
  try {
    const data = messageSchema.parse(req.body);
    const message = await prisma.discussion.create({
      data: {
        content: data.content,
        topicId: data.topicId,
        userId: req.user!.userId
      },
      include: { user: true, topic: true }
    });
    res.status(201).json({ message });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message ?? 'Invalid message.' });
    }
    return res.status(500).json({ error: 'Could not send message.' });
  }
});

export default router;
