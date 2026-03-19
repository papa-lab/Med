# Kenyan Med Learning Hub - Updated Full-Stack Starter

This archive now contains:
- `app/` updated frontend with login/register, live dashboard fetches, and backend-connected AI chat
- `server/` Express + Prisma + JWT + quiz/progress/discussion/Gemini/Telegram starter backend

## Recommended first run

1. Start backend
   ```bash
   cd server
   npm install
   cp .env.example .env
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   npm run dev
   ```

2. Start frontend
   ```bash
   cd app
   npm install
   cp .env.example .env
   npm run dev
   ```

Demo login after seeding:
- `demo@medstudy.ke`
- `demo1234`
