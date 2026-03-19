import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'JWT secret is missing.' });
    }

    const payload = jwt.verify(token, secret) as { userId: string; email: string };
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
