import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import discussionRoutes from './routes/discussions.js';
import quizRoutes from './routes/quizzes.js';
import aiRoutes from './routes/ai.js';
import telegramRoutes from './routes/telegram.js';
import { prisma } from './lib/prisma.js';

const app = express();
const server = http.createServer(app);
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Kenyan Med Learning Hub API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/telegram', telegramRoutes);

io.on('connection', (socket) => {
  socket.on('join_topic', (topicId: string) => {
    socket.join(topicId);
  });

  socket.on('send_message', async (data: { topicId: string; content: string; userId: string }) => {
    try {
      const message = await prisma.discussion.create({
        data: {
          topicId: data.topicId,
          content: data.content,
          userId: data.userId
        },
        include: { user: true }
      });
      io.to(data.topicId).emit('new_message', message);
    } catch {
      socket.emit('message_error', { error: 'Could not send message.' });
    }
  });
});

const port = Number(process.env.PORT || 5000);
server.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
