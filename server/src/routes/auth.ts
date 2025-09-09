import { Router } from 'express'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body as { email?: string; name?: string; password?: string }
    if (!email || !name || !password) return res.status(400).json({ error: 'email, name, password are required' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, name, password: hash } })

    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET missing' })
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '7d' })

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET missing' })
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '7d' })

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
