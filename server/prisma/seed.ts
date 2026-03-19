import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const passwordHash = await bcrypt.hash('demo1234', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@medstudy.ke' },
    update: {},
    create: {
      email: 'demo@medstudy.ke',
      name: 'Demo Student',
      passwordHash,
      university: 'University of Nairobi',
      yearOfStudy: 3,
      studyStreak: 12
    }
  });

  const topicsData = [
    { title: 'Best resources for neuroanatomy?', subject: 'Anatomy' },
    { title: 'Cardiac cycle explanation needed', subject: 'Physiology' },
    { title: 'Antibiotic classifications', subject: 'Pharmacology' }
  ];

  const topicIds: string[] = [];
  for (const topic of topicsData) {
    const created = await prisma.discussionTopic.create({ data: topic });
    topicIds.push(created.id);
  }

  await prisma.discussion.createMany({
    data: [
      { userId: user.id, topicId: topicIds[0], content: 'I found diagrams plus practice questions very useful for cranial nerves.' },
      { userId: user.id, topicId: topicIds[1], content: 'Think of phases, valve movement, then heart sounds.' },
      { userId: user.id, topicId: topicIds[2], content: 'I grouped them by mechanism and spectrum for easier recall.' }
    ]
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: 'Cardiovascular Basics',
      subject: 'Physiology',
      topic: 'Cardiac Cycle',
      description: 'Starter quiz for first-pass revision.',
      questions: {
        create: [
          {
            prompt: 'Which valve closes to produce S1?',
            optionA: 'Aortic valve',
            optionB: 'Pulmonary valve',
            optionC: 'Mitral and tricuspid valves',
            optionD: 'None of the above',
            answer: 'Mitral and tricuspid valves',
            explanation: 'S1 is caused mainly by closure of the atrioventricular valves.'
          },
          {
            prompt: 'During ventricular systole, ventricular pressure generally:',
            optionA: 'Falls below atrial pressure',
            optionB: 'Rises above arterial pressure before ejection',
            optionC: 'Stays constant',
            optionD: 'Equals venous pressure',
            answer: 'Rises above arterial pressure before ejection',
            explanation: 'Pressure must exceed arterial pressure for semilunar valves to open.'
          }
        ]
      }
    }
  });

  await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: quiz.id,
      score: 78,
      correct: 1,
      total: 2
    }
  });

  const progressRows = [
    { id: `${user.id}-Anatomy-Neuroanatomy`, userId: user.id, subject: 'Anatomy', topic: 'Neuroanatomy', completed: true, mastery: 75 },
    { id: `${user.id}-Physiology-Cardiac Cycle`, userId: user.id, subject: 'Physiology', topic: 'Cardiac Cycle', completed: true, mastery: 60 },
    { id: `${user.id}-Pharmacology-Antibiotics`, userId: user.id, subject: 'Pharmacology', topic: 'Antibiotics', completed: false, mastery: 45 },
    { id: `${user.id}-Pathology-Inflammation`, userId: user.id, subject: 'Pathology', topic: 'Inflammation', completed: false, mastery: 30 }
  ];

  for (const row of progressRows) {
    await prisma.progress.upsert({
      where: { id: row.id },
      update: row,
      create: row
    });
  }

  await prisma.studySession.createMany({
    data: [
      { userId: user.id, minutes: 45, source: 'quiz' },
      { userId: user.id, minutes: 30, source: 'ai' },
      { userId: user.id, minutes: 50, source: 'revision' }
    ]
  });

  console.log('Database seeded. Demo login: demo@medstudy.ke / demo1234');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
