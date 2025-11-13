import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.sid || req.cookies?.sid;
  if (!token) return res.status(401).json({ error: 'unauthenticated' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret') as any;
    (req as any).userId = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'unauthenticated' });
  }
}
