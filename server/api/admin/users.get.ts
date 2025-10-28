import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'
import { defineEventHandler, getCookie, createError } from 'h3'

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

  const me = await prisma.user.findUnique({ where: { id: decoded.userId } })
  if (!me || me.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true }
  })

  return { users }
})
