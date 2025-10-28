import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const clientId = (config.googleClientId as string) || (config.public as any)?.googleClientId
  const clientSecret = (config.googleClientSecret as string)
  const jwtSecret = (config.jwtSecret as string)

  const query = getQuery(event)
  const code = query.code as string

  if (!clientId || !clientSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Google OAuth is not configured' })
  }
  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Missing code' })
  }

  // Build redirect URI from request origin to match what was used in the auth step
  const { origin } = getRequestURL(event)
  const redirectUri = `${origin}/api/auth/google/callback`

  // Exchange code for tokens
  const tokenRes = await $fetch<any>('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  if (!tokenRes?.access_token) {
    throw createError({ statusCode: 401, statusMessage: 'Failed to get access token' })
  }

  // Get user info
  const userInfo = await $fetch<any>('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenRes.access_token}` },
  })

  const email = userInfo?.email as string | undefined
  const name = (userInfo?.name as string | undefined) || (email ? email.split('@')[0] : 'User')
  const picture = userInfo?.picture as string | undefined

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email not provided by Google' })
  }

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    const randomPass = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 16)
    const hash = await bcrypt.hash(randomPass, 10)
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: hash,
        avatarUrl: picture,
      },
    })
  }

  if (!jwtSecret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT secret not configured' })
  }

  // Issue JWT
  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '7d' })
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })

  // Redirect to profile or home
  return sendRedirect(event, '/')
})
