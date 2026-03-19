# Kenyan Med Learning Hub API

This backend adds:
- JWT authentication
- dashboard data endpoints
- quiz submission + progress tracking
- discussion endpoints + Socket.IO hooks
- Google Gemini route
- Telegram link-code generation
- Prisma schema and SQLite dev database support

## Quick start

```bash
cd server
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

Demo account after seeding:
- Email: `demo@medstudy.ke`
- Password: `demo1234`

Set `GEMINI_API_KEY` in `.env` to enable live Gemini answers.
