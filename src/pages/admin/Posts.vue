<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { usePosts } from '@/composables/usePosts'

const { user } = useAuth()
const isLoggedIn = computed(() => !!user.value)

const { list, update, remove } = usePosts()

const posts = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function loadPosts() {
  error.value = null
  loading.value = true
  try {
    posts.value = await list()
  } catch (e: any) {
    error.value = e?.message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

onMounted(loadPosts)

// Dialog state
const showDialog = ref(false)
const saving = ref(false)
const saveError = ref<string | null>(null)

const editing = ref<any | null>(null)
const form = ref({ slug: '', title: '', excerpt: '', content: '', tags: '', categories: '' })

function openEdit(p: any) {
  editing.value = p
  form.value.slug = p.slug
  form.value.title = p.title
  form.value.excerpt = p.excerpt
  form.value.content = p.content
  form.value.tags = (p.tags || []).map((t: any) => t.tag?.name).filter(Boolean).join(', ')
  form.value.categories = (p.categories || []).map((c: any) => c.category?.name).filter(Boolean).join(', ')
  saveError.value = null
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  editing.value = null
}

async function saveEdit() {
  if (!editing.value) return
  saving.value = true
  saveError.value = null
  try {
    const tagsArr = form.value.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const categoriesArr = form.value.categories
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    await update(editing.value.id, {
      slug: form.value.slug || undefined,
      title: form.value.title || undefined,
      excerpt: form.value.excerpt || undefined,
      content: form.value.content || undefined,
      tags: tagsArr,
      categories: categoriesArr,
    })
    await loadPosts()
    closeDialog()
  } catch (e: any) {
    saveError.value = e?.message || 'Failed to save changes'
  } finally {
    saving.value = false
  }
}

async function onDelete(p: any) {
  if (!confirm(`Delete post "${p.title}" ?`)) return
  await remove(p.id)
  await loadPosts()
}
</script>

<template>
  <section class="container py-16">
    <div class="mx-auto max-w-5xl rounded-xl border border-ink-100 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <h1 class="font-display text-2xl font-bold text-ink-900">Posts</h1>
        <RouterLink
          to="/admin/posts/new"
          class="rounded-lg bg-ink-900 px-3 py-2 text-sm font-semibold text-white hover:bg-ink-800"
        >
          New Post
        </RouterLink>
      </div>

      <div v-if="!isLoggedIn" class="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        You must <RouterLink to="/login" class="underline">sign in</RouterLink> to manage posts.
      </div>

      <div v-else class="mt-6 overflow-x-auto">
        <table class="min-w-full divide-y divide-ink-100 text-sm">
          <thead>
            <tr class="text-left text-ink-500">
              <th class="py-2">Cover</th>
              <th class="py-2">Title</th>
              <th class="py-2">Slug</th>
              <th class="py-2">Date</th>
              <th class="py-2">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink-100">
            <tr v-if="loading">
              <td class="py-4 text-ink-600" colspan="5">Loading posts...</td>
            </tr>
            <tr v-else-if="error">
              <td class="py-4 text-red-600" colspan="5">{{ error }}</td>
            </tr>
            <tr v-else v-for="p in posts" :key="p.id">
              <td class="py-2">
                <img v-if="p.coverImageUrl" :src="p.coverImageUrl" alt="cover" class="h-10 w-10 rounded object-cover" />
                <div v-else class="h-10 w-10 rounded bg-ink-100"></div>
              </td>
              <td class="py-2 font-medium text-ink-900">{{ p.title }}</td>
              <td class="py-2">{{ p.slug }}</td>
              <td class="py-2">{{ new Date(p.publishedAt).toLocaleDateString() }}</td>
              <td class="py-2">
                <button class="rounded border border-ink-200 px-2 py-1 hover:bg-ink-50" @click="openEdit(p)">
                  Edit
                </button>
                <RouterLink
                  class="ml-2 rounded border border-ink-200 px-2 py-1 hover:bg-ink-50"
                  :to="`/admin/posts/${p.id}/edit`"
                >Open Editor</RouterLink>
                <button class="ml-2 rounded border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50" @click="onDelete(p)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Simple Dialog -->
    <div v-if="showDialog" class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div class="w-full max-w-2xl rounded-xl border border-ink-100 bg-white p-6 shadow-xl">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-ink-900">Edit Post (Quick)</h2>
          <button class="rounded-lg border border-ink-200 px-2 py-1 text-sm hover:bg-ink-50" @click="closeDialog">
            Close
          </button>
        </div>

        <div class="mt-4 grid gap-3">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input v-model="form.slug" placeholder="Slug" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
            <input v-model="form.title" placeholder="Title" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
          </div>
          <input v-model="form.excerpt" placeholder="Excerpt" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
          <textarea v-model="form.content" placeholder="Content (HTML supported)" class="min-h-40 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"></textarea>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input v-model="form.tags" placeholder="Tags (comma separated)" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
            <input v-model="form.categories" placeholder="Categories (comma separated)" class="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
          </div>
          <div>
            <p v-if="saveError" class="mb-2 text-sm text-red-600">{{ saveError }}</p>
            <button @click="saveEdit" :disabled="saving" class="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
