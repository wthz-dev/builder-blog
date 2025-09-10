import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth-token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const secret = config.jwtSecret as string | undefined
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT secret not configured' })
  }
  let decoded: any
  try {
    decoded = jwt.verify(token, secret) as any
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      publishedAt: true,
      author: { select: { id: true, name: true } }
    }
  })

  return { posts }
})
