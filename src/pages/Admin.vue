<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { usePosts } from '@/composables/usePosts'

const router = useRouter()

onMounted(() => {
  // Redirect legacy Admin page to the new Posts list for consistent UX
  router.replace({ name: 'admin-posts' }).catch(() => {})
})

const { user } = useAuth()
const { list, create, update, remove } = usePosts()

const slug = ref('')
const title = ref('')
const excerpt = ref('')
const content = ref('')
const tags = ref('') // comma-separated
const categories = ref('') // comma-separated

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const isLoggedIn = computed(() => !!user.value)

// Posts table state
const posts = ref<any[]>([])
const tableLoading = ref(true)
const tableError = ref<string | null>(null)
const editingId = ref<string | null>(null)

async function loadPosts() {
  tableError.value = null
  tableLoading.value = true
  try {
    const res = await list()
    posts.value = res
  } catch (e: any) {
    tableError.value = e?.message || 'Failed to load posts'
  } finally {
    tableLoading.value = false
  }
}

onMounted(loadPosts)

function resetForm() {
  slug.value = ''
  title.value = ''
  excerpt.value = ''
  content.value = ''
  tags.value = ''
  categories.value = ''
  editingId.value = null
}

async function submit() {
  if (!isLoggedIn.value) return
  error.value = null
  success.value = null
  loading.value = true
  try {
    const tagsArr = tags.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const categoriesArr = categories.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (editingId.value) {
      await update(editingId.value, {
        slug: slug.value.trim() || undefined,
        title: title.value.trim() || undefined,
        excerpt: excerpt.value.trim() || undefined,
        content: content.value || undefined,
        tags: tagsArr,
        categories: categoriesArr,
      })
      success.value = 'Post updated'
    } else {
      await create({
        slug: slug.value.trim(),
        title: title.value.trim(),
        excerpt: excerpt.value.trim(),
        content: content.value,
        tags: tagsArr,
        categories: categoriesArr,
      })
      success.value = 'Post created'
    }

    await loadPosts()
    resetForm()
  } catch (e: any) {
    error.value = e?.message || 'Failed to create post'
  } finally {
    loading.value = false
  }
}

function onEdit(p: any) {
  editingId.value = p.id
  slug.value = p.slug
  title.value = p.title
  excerpt.value = p.excerpt
  content.value = p.content
  tags.value = (p.tags || []).map((t: any) => t.tag?.name).filter(Boolean).join(', ')
  categories.value = (p.categories || []).map((c: any) => c.category?.name).filter(Boolean).join(', ')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function onDelete(p: any) {
  if (!confirm(`Delete post "${p.title}" ?`)) return
  try {
    await remove(p.id)
    await loadPosts()
  } catch (e) {
    // ignore
  }
}
</script>

<template>
  <section class="container py-16">
    <div class="mx-auto max-w-4xl rounded-xl border border-ink-100 bg-white p-6 shadow-sm">
      <h1 class="font-display text-2xl font-bold text-ink-900">Admin Dashboard</h1>
      <div v-if="!isLoggedIn" class="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        You must <RouterLink to="/login" class="underline">sign in</RouterLink> to manage posts.
      </div>

      <form v-else class="mt-6 grid gap-3" @submit.prevent="submit">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input v-model="slug" placeholder="Slug" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
          <input v-model="title" placeholder="Title" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
        </div>
        <input v-model="excerpt" placeholder="Excerpt" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
        <textarea v-model="content" placeholder="Content (HTML supported)" class="min-h-40 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"></textarea>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input v-model="tags" placeholder="Tags (comma separated)" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
          <input v-model="categories" placeholder="Categories (comma separated)" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
        </div>
        <div>
          <p v-if="error" class="mb-2 text-sm text-red-600">{{ error }}</p>
          <p v-if="success" class="mb-2 text-sm text-green-700">{{ success }}</p>
          <div class="flex items-center gap-2">
            <button type="submit" :disabled="loading" class="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60">
              {{ loading ? (editingId ? 'Saving...' : 'Creating...') : (editingId ? 'Save Changes' : 'Create Post') }}
            </button>
            <button v-if="editingId" type="button" @click="resetForm" class="rounded-lg border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-ink-50">
              Cancel
            </button>
          </div>
        </div>
      </form>

      <div class="mt-6 overflow-x-auto">
        <table class="min-w-full divide-y divide-ink-100 text-sm">
          <thead>
            <tr class="text-left text-ink-500">
              <th class="py-2">Title</th>
              <th class="py-2">Slug</th>
              <th class="py-2">Date</th>
              <th class="py-2">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink-100">
            <tr v-if="tableLoading">
              <td class="py-4 text-ink-600" colspan="4">Loading posts...</td>
            </tr>
            <tr v-else-if="tableError">
              <td class="py-4 text-red-600" colspan="4">{{ tableError }}</td>
            </tr>
            <tr v-else v-for="p in posts" :key="p.id">
              <td class="py-2 font-medium text-ink-900">{{ p.title }}</td>
              <td class="py-2">{{ p.slug }}</td>
              <td class="py-2">{{ new Date(p.publishedAt).toLocaleDateString() }}</td>
              <td class="py-2">
                <button class="rounded border border-ink-200 px-2 py-1 hover:bg-ink-50" @click="onEdit(p)">
                  Edit
                </button>
                <button class="ml-2 rounded border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50" @click="onDelete(p)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
