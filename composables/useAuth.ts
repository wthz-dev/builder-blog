export const useAuth = () => {
  const user = useState<any>('auth.user', () => null)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      user.value = response.user
      
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData
      })
      
      user.value = response.user
      
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      user.value = null
      
      // clear client hint state only; cookie cleared by server
      
      await navigateTo('/')
    }
  }

  const checkAuth = async () => {
    try {
      // On server (SSR), forward incoming request cookies to the API
      const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
      const response = await $fetch('/api/auth/me', { headers })
      user.value = response.user
      return response.user
    } catch (error) {
      user.value = null
      return null
    }
  }

  return {
    user: readonly(user),
    login,
    register,
    logout,
    checkAuth
  }
}
