import { apiFetch } from './useApi'

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
}

export function usePosts() {
  function list() {
    return apiFetch<any[]>('/api/posts')
  }

  function get(slug: string) {
    return apiFetch<any>(`/api/posts/${encodeURIComponent(slug)}`)
  }

  function getById(id: string) {
    return apiFetch<any>(`/api/posts/id/${encodeURIComponent(id)}`)
  }

  async function exists(slug: string): Promise<boolean> {
    if (!slug) return false
    const res = await apiFetch<{ exists: boolean }>(`/api/posts/exists/${encodeURIComponent(slug)}`)
    return res.exists
  }

  function create(payload: {
    slug: string
    title: string
    excerpt: string
    content: string
    tags?: string[]
    categories?: string[]
  }) {
    return apiFetch<any>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  function update(id: string, payload: {
    slug?: string
    title?: string
    excerpt?: string
    content?: string
    tags?: string[]
    categories?: string[]
  }) {
    return apiFetch<any>(`/api/posts/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  function remove(id: string) {
    return apiFetch<void>(`/api/posts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  }

  return { list, get, getById, create, update, remove, exists }
}
