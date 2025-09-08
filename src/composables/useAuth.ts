import { useSession, apiFetch } from './useApi'

interface User {
  id: string
  email: string
  name: string
}

interface AuthResponse {
  token: string
  user: User
}

export function useAuth() {
  const { token, user, setSession, logout } = useSession()

  async function register(payload: { email: string; name: string; password: string }) {
    const res = await apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    setSession(res.token, res.user)
    return res.user
  }

  async function login(payload: { email: string; password: string }) {
    const res = await apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    setSession(res.token, res.user)
    return res.user
  }

  return { token, user, register, login, logout }
}
