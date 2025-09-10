import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const token = getCookie(event, 'auth-token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwtSecret) as any
    const { postId, content } = await readBody(event)

    if (!postId || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Post ID and content are required'
      })
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: decoded.userId
      },
      include: {
        author: {
          select: { name: true }
        }
      }
    })

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      authorName: comment.author?.name || 'Anonymous'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Comment creation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create comment'
    })
  }
})
