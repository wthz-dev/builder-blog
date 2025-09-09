import { ref, onMounted } from 'vue'
import { apiFetch } from '@/composables/useApi'

export function useTaxonomy() {
  const categories = ref<string[]>([])
  const tags = ref<string[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      // Fetch posts and aggregate unique categories/tags from API data
      const posts = await apiFetch<any[]>('/posts')
      const catSet = new Set<string>()
      const tagSet = new Set<string>()
      posts.forEach((p) => {
        ;(p.categories || []).forEach((c: any) => {
          const name = c?.category?.name ?? c?.name ?? c
          if (name) catSet.add(String(name))
        })
        ;(p.tags || []).forEach((t: any) => {
          const name = t?.tag?.name ?? t?.name ?? t
          if (name) tagSet.add(String(name))
        })
      })
      categories.value = Array.from(catSet).sort((a, b) => a.localeCompare(b))
      tags.value = Array.from(tagSet).sort((a, b) => a.localeCompare(b))
    } catch (e: any) {
      error.value = e?.message || 'Failed to load taxonomy'
    } finally {
      loading.value = false
    }
  })

  return { categories, tags, loading, error }
}
