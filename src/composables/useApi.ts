import { ref, computed } from 'vue'

const TOKEN_KEY = 'auth:token'
const USER_KEY = 'auth:user'

const tokenRef = ref<string | null>(typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null)
const userRef = ref<{ id: string; email: string; name: string } | null>(
  typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem(USER_KEY) || 'null') : null,
)

export function useSession() {
  const token = computed(() => tokenRef.value)
  const user = computed(() => userRef.value)

  function setSession(nextToken: string | null, nextUser?: { id: string; email: string; name: string } | null) {
    tokenRef.value = nextToken
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken)
    else localStorage.removeItem(TOKEN_KEY)

    if (typeof nextUser !== 'undefined') {
      userRef.value = nextUser
      if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      else localStorage.removeItem(USER_KEY)
    }
  }

  function logout() {
    setSession(null, null)
  }

  return { token, user, setSession, logout }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  const token = tokenRef.value
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(path.startsWith('/api') ? path : `/api${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let message = `Request failed with ${res.status}`
    try {
      const data = (await res.json()) as any
      if (data?.error) message = data.error
    } catch {}
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
