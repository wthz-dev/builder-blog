import type { Request, Response, NextFunction } from 'express'

type Entry = { count: number; resetAt: number }
const buckets = new Map<string, Entry>()

export function rateLimit(options: { windowMs: number; max: number }) {
  const { windowMs, max } = options
  return function (req: Request, res: Response, next: NextFunction) {
    const key = req.ip || (req.headers['x-forwarded-for']?.toString() ?? '') || req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    const entry = buckets.get(key)
    if (!entry || entry.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }
    if (entry.count < max) {
      entry.count++
      return next()
    }
    const retryAfter = Math.max(0, Math.ceil((entry.resetAt - now) / 1000))
    res.setHeader('Retry-After', retryAfter.toString())
    return res.status(429).json({ error: 'Too many requests, please try again later.' })
  }
}
