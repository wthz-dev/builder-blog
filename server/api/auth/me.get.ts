import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const token = getCookie(event, 'auth-token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No token provided'
      })
    }

    // Verify JWT token
    const secret = config.jwtSecret as string | undefined
    if (!secret) {
      throw createError({ statusCode: 500, statusMessage: 'JWT secret not configured' })
    }
    const decoded = jwt.verify(token, secret) as any

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    return { user }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Auth error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication failed'
    })
  }
})
