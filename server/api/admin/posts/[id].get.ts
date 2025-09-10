import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth-token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const secret = config.jwtSecret as string | undefined
  if (!secret) throw createError({ statusCode: 500, statusMessage: 'JWT secret not configured' })

  try {
    const decoded = jwt.verify(token, secret) as any
    const me = await prisma.user.findUnique({ where: { id: decoded.userId } })
    if (!me || me.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

    const id = getRouterParam(event, 'id') as string
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImageUrl: true,
        publishedAt: true,
        categories: {
          select: { category: { select: { name: true } } }
        },
        tags: {
          select: { tag: { select: { name: true } } }
        }
      },
    })

    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    return { post }
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 500, statusMessage: 'Failed to load post' })
  }
})
