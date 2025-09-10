export default defineEventHandler(async (event) => {
  // Clear the auth cookie
  deleteCookie(event, 'auth-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })

  return { success: true }
})
