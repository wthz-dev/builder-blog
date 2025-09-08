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
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData
  const headers: Record<string, string> = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string> | undefined),
  }

  const token = tokenRef.value
  if (token) headers['Authorization'] = `Bearer ${token}`

  // Normalize path to start with /api
  const apiPath = path.startsWith('/api') ? path : `/api${path}`
  // Optional external API base (e.g. Render/Railway domain)
  const base = (import.meta as any)?.env?.VITE_API_BASE as string | undefined
  const baseTrimmed = base ? base.replace(/\/$/, '') : ''
  const url = baseTrimmed ? `${baseTrimmed}${apiPath}` : apiPath

  const res = await fetch(url, {
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
