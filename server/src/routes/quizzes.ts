import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const quizzes = await prisma.quiz.findMany({ include: { questions: true } });
  res.json({
    quizzes: quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      topic: quiz.topic,
      description: quiz.description,
      questionCount: quiz.questions.length
    }))
  });
});

router.get('/:quizId', async (req, res) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: req.params.quizId },
    include: { questions: true }
  });

  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

  res.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      topic: quiz.topic,
      description: quiz.description,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        options: [question.optionA, question.optionB, question.optionC, question.optionD]
      }))
    }
  });
});

const submitSchema = z.object({
  answers: z.record(z.string())
});

router.post('/:quizId/submit', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { answers } = submitSchema.parse(req.body);
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.quizId },
      include: { questions: true }
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    let correct = 0;
    const feedback = quiz.questions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.answer;
      if (isCorrect) correct += 1;
      return {
        questionId: question.id,
        correct: isCorrect,
        correctAnswer: question.answer,
        explanation: question.explanation
      };
    });

    const total = quiz.questions.length;
    const score = total ? (correct / total) * 100 : 0;

    await prisma.quizAttempt.create({
      data: {
        userId: req.user!.userId,
        quizId: quiz.id,
        score,
        correct,
        total
      }
    });

    await prisma.progress.upsert({
      where: {
        id: `${req.user!.userId}-${quiz.subject}-${quiz.topic}`
      },
      update: {
        completed: true,
        mastery: score
      },
      create: {
        id: `${req.user!.userId}-${quiz.subject}-${quiz.topic}`,
        userId: req.user!.userId,
        subject: quiz.subject,
        topic: quiz.topic,
        completed: true,
        mastery: score
      }
    });

    await prisma.studySession.create({
      data: {
        userId: req.user!.userId,
        minutes: Math.max(10, total * 3),
        source: `quiz:${quiz.id}`
      }
    });

    res.json({ score, correct, total, feedback });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message ?? 'Invalid answers.' });
    }
    return res.status(500).json({ error: 'Could not submit quiz.' });
  }
});

export default router;
