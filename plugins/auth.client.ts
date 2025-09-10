export default defineNuxtPlugin(async () => {
  const { checkAuth } = useAuth()
  
  // Check authentication status on client-side hydration
  if (process.client) {
    await checkAuth()
  }
})
