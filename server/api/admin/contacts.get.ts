import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // AuthN via cookie JWT (same as other admin endpoints)
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

  // AuthZ: ADMIN only
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const query = getQuery(event)
  const page = Math.max(1, parseInt(String(query.page || '1')))
  const pageSize = Math.max(1, Math.min(50, parseInt(String(query.pageSize || '20'))))

  const [total, items] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
  ])

  return {
    contacts: items,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  }
})
