import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'
import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth-token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const secret = config.jwtSecret as string | undefined
  if (!secret) throw createError({ statusCode: 500, statusMessage: 'JWT secret not configured' })

  let decoded: any
  try {
    decoded = jwt.verify(token, secret) as any
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const me = await prisma.user.findUnique({ where: { id: decoded.userId } })
  if (!me || me.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const id = event.context.params?.id as string
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing user id' })
  if (id === me.id) throw createError({ statusCode: 400, statusMessage: 'ไม่สามารถลบบัญชีตนเองได้' })

  await prisma.comment.deleteMany({ where: { authorId: id } })
  await prisma.post.deleteMany({ where: { authorId: id } })
  await prisma.user.delete({ where: { id } })
  return { ok: true }
})
