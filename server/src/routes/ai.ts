import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const router = express.Router();
const askSchema = z.object({ prompt: z.string().min(2).max(4000) });

const revisionSources = [
  'WHO learning materials',
  'CDC public education pages',
  'NIH and NCBI Bookshelf content',
  'Open-access medical teaching resources'
];

router.post('/ask', async (req, res) => {
  try {
    const { prompt } = askSchema.parse(req.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        answer: `Demo mode: Gemini is not configured yet.\n\nYour question: ${prompt}\n\nSuggested study path:\n1. Break the topic into definition, mechanism, and clinical relevance.\n2. Cross-check with trusted public sources such as ${revisionSources.join(', ')}.\n3. Turn the answer into flashcards and quiz questions.\n\nAdd GEMINI_API_KEY in server/.env to enable live AI responses.`
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`You are a study assistant for Kenyan medical students. Answer clearly, academically, and safely. Avoid patient-specific diagnosis or treatment instructions. Cite broad types of public sources when useful. Question: ${prompt}`);
    const text = result.response.text();
    return res.json({ answer: text });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message ?? 'Invalid prompt.' });
    }
    return res.status(500).json({ error: 'Failed to get AI response.' });
  }
});

export default router;
