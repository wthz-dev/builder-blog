import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import postsRouter from './routes/posts'
import authRouter from './routes/auth'
import commentsRouter from './routes/comments'
import uploadsRouter from './routes/uploads'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV ?? 'development' })
})

app.use('/api/posts', postsRouter)
app.use('/api/auth', authRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/uploads', uploadsRouter)

const PORT = Number(process.env.PORT ?? 3001)
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
})
