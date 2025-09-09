import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

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

async function attachAuth(req: Request, res: Response): Promise<boolean> {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  const token = header.slice('Bearer '.length)
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET missing' })
      return false
    }
    const payload = jwt.verify(token, secret) as Partial<AuthPayload> & { userId: string }
    if (!payload.role) {
      try {
        const u = await prisma.user.findUnique({ where: { id: payload.userId }, select: { role: true } })
        payload.role = (u?.role as 'ADMIN' | 'USER' | undefined) ?? 'USER'
      } catch {}
    }
    req.auth = payload as AuthPayload
    return true
  } catch {
    res.status(401).json({ error: 'Invalid token' })
    return false
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (await attachAuth(req, res)) next()
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!(await attachAuth(req, res))) return
  if (!req.auth) return res.status(401).json({ error: 'Unauthorized' })
  if (req.auth.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden: admin only' })
  next()
}
