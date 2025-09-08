import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

// POST /api/comments - create a comment on a post (protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { postId, content } = req.body as { postId?: string; content?: string }
    if (!postId || !content) return res.status(400).json({ error: 'postId and content are required' })

    // Validate post exists
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.auth!.userId,
      },
    })

    res.status(201).json(comment)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create comment' })
  }
})

export default router
