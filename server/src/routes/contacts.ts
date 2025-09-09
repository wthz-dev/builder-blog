import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { rateLimit } from '../middleware/rateLimit'
import { requireAdmin } from '../middleware/auth'

const router = Router()

// Rate limit: 5 requests per 5 minutes per IP on contact submissions
const contactLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 5 })

// POST /api/contacts - create a contact submission
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, message, captchaToken } = req.body as {
      name?: string
      email?: string
      message?: string
      captchaToken?: string
    }
    if (!name || !email || !message) return res.status(400).json({ error: 'name, email, message are required' })

    // very basic email check
    const isEmail = /.+@.+\..+/.test(email)
    if (!isEmail) return res.status(400).json({ error: 'Invalid email address' })

    // Configurable reCAPTCHA verification
    // Set CONTACT_CAPTCHA_REQUIRED=true to enforce token presence and verification
    const hasSecret = !!process.env.GOOGLE_RECAPTCHA_SECRET || 'LeCBMMrAAAAAIu-vbhmEmU0e7rsdCUXMQqBxxXd'
    const enforceCaptcha = process.env.CONTACT_CAPTCHA_REQUIRED === 'true'
    if (hasSecret) {
      if (!captchaToken && enforceCaptcha) return res.status(400).json({ error: 'captchaToken required' })
      if (captchaToken) {
        try {
          const params = new URLSearchParams({
            secret: hasSecret,
            response: captchaToken,
          })
          const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
          })
          const data = (await resp.json()) as { success: boolean; score?: number; action?: string; [k: string]: unknown }
          const minScore = Number(process.env.GOOGLE_RECAPTCHA_MIN_SCORE ?? '0.5')
          const ok = data.success && (data.score === undefined || data.score >= minScore) && (!data.action || data.action === 'contact')
          if (!ok) {
            console.warn('reCAPTCHA failed', {
              ip: req.ip,
              ua: req.headers['user-agent'],
              score: data.score,
              action: data.action,
            })
            return res.status(400).json({ error: 'CAPTCHA verification failed' })
          }
        } catch (e) {
          return res.status(400).json({ error: 'CAPTCHA verification error' })
        }
      }
    }

    const created = await prisma.contact.create({
      data: { name, email, message },
      select: { id: true, createdAt: true },
    })

    // Optional webhook notification (e.g., Slack/Discord)
    const webhookUrlAdmin = 'https://discord.com/api/webhooks/1414849568381866034/ArZ0pJR2KxsHUIr1-FDj0TnMyIpm4IuYsIYTL1G4aLuSeJzoRNqH-LvvVVOJqzYtrzB9'
    if (webhookUrlAdmin) {
      try {
        const payload = {
          text: `New contact message`,
          blocks: [
            { type: 'header', text: { type: 'plain_text', text: 'New Contact Message' } },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Name*\n${name}` },
                { type: 'mrkdwn', text: `*Email*\n${email}` },
                { type: 'mrkdwn', text: `*When*\n${new Date(created.createdAt).toISOString()}` },
              ],
            },
            { type: 'section', text: { type: 'mrkdwn', text: `*Message*\n${message}` } },
          ],
        }
        await fetch(webhookUrlAdmin, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch (e) {
        console.warn('Contact webhook failed', e)
      }
    }

    return res.status(201).json({ id: created.id, createdAt: created.createdAt })
  } catch (err) {
    console.error('Failed to save contact', {
      ip: req.ip,
      ua: req.headers['user-agent'],
      error: err,
    })
    return res.status(500).json({ error: 'Failed to save contact' })
  }
})

// GET /api/contacts - list contacts (admin only)
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const items = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

export default router
