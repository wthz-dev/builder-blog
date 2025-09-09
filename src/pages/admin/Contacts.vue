<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiFetch } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

interface ContactItem {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

const { user } = useAuth()
const router = useRouter()

const loading = ref(true)
const error = ref<string | null>(null)
const items = ref<ContactItem[]>([])

async function load() {
  error.value = null
  loading.value = true
  try {
    // basic client-side guard
    if (user.value?.role !== 'ADMIN') {
      router.replace('/')
      return
    }
    items.value = await apiFetch<ContactItem[]>('/api/contacts')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load contacts'
    error.value = msg
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="container py-10">
    <h1 class="font-display text-2xl font-bold text-ink-900">Contact Messages</h1>

    <div v-if="error" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="mt-6 text-ink-600">Loading…</div>

    <div v-else class="mt-6 overflow-x-auto">
      <table class="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr class="text-left text-sm text-ink-500">
            <th class="px-3 py-2">When</th>
            <th class="px-3 py-2">Name</th>
            <th class="px-3 py-2">Email</th>
            <th class="px-3 py-2">Message</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in items" :key="c.id" class="bg-white shadow-sm">
            <td class="px-3 py-2 text-sm text-ink-600">{{ new Date(c.createdAt).toLocaleString() }}</td>
            <td class="px-3 py-2 text-sm font-medium">{{ c.name }}</td>
            <td class="px-3 py-2 text-sm">
              <a :href="`mailto:${c.email}`" class="text-brand-700 hover:underline">{{ c.email }}</a>
            </td>
            <td class="px-3 py-2 text-sm text-ink-700 whitespace-pre-wrap">{{ c.message }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
