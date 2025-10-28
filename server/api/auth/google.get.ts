import { H3Event, defineEventHandler, createError, getRequestURL, sendRedirect } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const clientId = (config.googleClientId as string) || (config.public as any)?.googleClientId

  if (!clientId) {
    throw createError({ statusCode: 500, statusMessage: 'Google OAuth is not configured' })
  }

  // Build redirect URI from the actual request origin (works for localhost and production)
  const { origin } = getRequestURL(event)
  const redirectUri = `${origin}/api/auth/google/callback`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    include_granted_scopes: 'true',
    prompt: 'consent',
  })

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  return sendRedirect(event, url)
})
