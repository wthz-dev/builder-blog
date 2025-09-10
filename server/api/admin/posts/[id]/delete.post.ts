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
    await prisma.post.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete post' })
  }
})
