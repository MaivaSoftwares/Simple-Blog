import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export interface AuthRequest extends Request {
  user?: { _id: string; username: string; email: string };
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as AuthRequest).user = { _id: decoded._id, username: decoded.username, email: decoded.email };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }
}
