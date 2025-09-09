<script setup lang="ts">
import { ref } from 'vue'
import { apiFetch } from '@/composables/useApi'

const name = ref('')
const email = ref('')
const message = ref('')
const loading = ref(false)
const success = ref<string | null>(null)
const error = ref<string | null>(null)

const siteKey = (import.meta as any)?.env?.VITE_RECAPTCHA_SITE_KEY as string | undefined

function loadRecaptcha(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!siteKey) return resolve()
    if ((window as any).grecaptcha) return resolve()
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
    document.head.appendChild(script)
  })
}

async function submit() {
  success.value = null
  error.value = null

  if (!name.value || !email.value || !message.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true
  try {
    await loadRecaptcha()
    let captchaToken: string | undefined
    const grecaptcha = (window as any).grecaptcha
    if (siteKey && grecaptcha?.execute) {
      try {
        captchaToken = await grecaptcha.execute(siteKey, { action: 'contact' })
      } catch (e) {
        // ignore and continue without token
      }
    }

    await apiFetch<{ id: string; createdAt: string }>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify({ name: name.value, email: email.value, message: message.value, captchaToken }),
    })
    success.value = 'Thanks! Your message has been sent.'
    name.value = ''
    email.value = ''
    message.value = ''
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Submission failed'
    error.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="container py-16">
    <div class="mx-auto max-w-2xl">
      <h1 class="font-display text-3xl font-bold text-ink-900">Contact</h1>
      <p class="mt-2 text-ink-600">Have a question or idea? Send me a message.</p>

      <form class="mt-6 grid gap-4" @submit.prevent="submit">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          class="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
        />
        <textarea
          v-model="message"
          placeholder="Message"
          class="min-h-32 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
        ></textarea>

        <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {{ error }}
        </div>
        <div v-if="success" class="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {{ success }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
        >
          {{ loading ? 'Sending…' : 'Send' }}
        </button>
      </form>
    </div>
  </section>
</template>
