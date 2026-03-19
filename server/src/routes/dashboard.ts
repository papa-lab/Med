import express from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;

  const [user, progress, attempts, discussions, studySessions, quizzes] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.progress.findMany({ where: { userId }, orderBy: { subject: 'asc' } }),
    prisma.quizAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.discussion.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true, topic: true },
      take: 6
    }),
    prisma.studySession.findMany({ where: { userId }, orderBy: { studiedOn: 'desc' }, take: 20 }),
    prisma.quiz.findMany({ include: { questions: true } })
  ]);

  const subjectMap = new Map<string, { completed: number; total: number; progress: number }>();
  for (const item of progress) {
    const current = subjectMap.get(item.subject) ?? { completed: 0, total: 0, progress: 0 };
    current.total += 1;
    if (item.completed) current.completed += 1;
    current.progress += item.mastery;
    subjectMap.set(item.subject, current);
  }

  const subjects = Array.from(subjectMap.entries()).map(([name, value]) => ({
    name,
    completed: value.completed,
    total: value.total,
    progress: value.total ? Math.round(value.progress / value.total) : 0
  }));

  const totalMinutes = studySessions.reduce((sum, item) => sum + item.minutes, 0);
  const quizAccuracy = attempts.length
    ? Math.round((attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length) * 10) / 10
    : 0;
  const questionsAnswered = attempts.reduce((sum, item) => sum + item.total, 0);
  const pendingQuizzes = Math.max(quizzes.length - new Set(attempts.map((item) => item.quizId)).size, 0);
  const flashcardsToReview = Math.max(10, subjects.length * 3);

  return res.json({
    user: user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      university: user.university ?? undefined,
      yearOfStudy: user.yearOfStudy ?? undefined,
      studyStreak: user.studyStreak,
      telegramLinked: user.telegramLinked,
      telegramHandle: user.telegramHandle ?? undefined
    } : null,
    summary: {
      pendingQuizzes,
      flashcardsToReview,
      studyStreak: user?.studyStreak ?? 1,
      dailyGoalMinutes: 60,
      todayMinutes: Math.min(totalMinutes, 60)
    },
    stats: {
      weeklyStudyHours: Math.round((totalMinutes / 60) * 10) / 10,
      quizAccuracy,
      questionsAnswered
    },
    subjects,
    recentDiscussions: discussions.map((item) => ({
      id: item.id,
      title: item.topic.title,
      author: item.user.name,
      replies: Math.max(1, Math.floor(Math.random() * 18)),
      time: item.createdAt,
      excerpt: item.content
    })),
    upcoming: [
      { title: 'Anatomy Quiz', time: 'Tomorrow, 9:00 AM' },
      { title: 'Study Group', time: 'Friday, 2:00 PM' }
    ]
  });
});

export default router;
