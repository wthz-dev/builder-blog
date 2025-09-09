import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: string
  role: 'ADMIN' | 'USER'
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = header.slice('Bearer '.length)
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET missing' })
    const payload = jwt.verify(token, secret) as AuthPayload
    req.auth = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ error: 'Unauthorized' })
  if (req.auth.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden: admin only' })
  next()
}
