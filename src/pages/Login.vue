<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    await login({ email: email.value.trim(), password: password.value })
    router.push('/')
  } catch (e: any) {
    error.value = e?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="container py-16">
    <div class="mx-auto max-w-sm rounded-xl border border-ink-100 bg-white p-6 shadow-sm">
      <h1 class="mb-4 text-center font-display text-2xl font-bold text-ink-900">Login</h1>
      <form class="grid gap-3" @submit.prevent="onSubmit">
        <input
          type="email"
          placeholder="Email"
          class="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
          v-model="email"
        />
        <input
          type="password"
          placeholder="Password"
          class="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
          v-model="password"
        />
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="mt-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-ink-600">
        No account?
        <RouterLink to="/register" class="text-brand-700 hover:underline">Register</RouterLink>
      </p>
    </div>
  </section>
</template>
