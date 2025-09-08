import { apiFetch } from './useApi'

export function useComments() {
  function create(payload: { postId: string; content: string }) {
    return apiFetch<any>('/api/comments', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  return { create }
}
