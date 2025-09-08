<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user, logout } = useAuth()
const initials = computed(() => (user.value ? user.value.name.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase() : ''))
</script>

<template>
  <section class="container py-16">
    <div class="mx-auto max-w-md rounded-xl border border-ink-100 bg-white p-6 shadow-sm">
      <h1 class="mb-4 text-center font-display text-2xl font-bold text-ink-900">Profile</h1>

      <div v-if="user" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-white">{{ initials }}</div>
          <div>
            <p class="font-semibold text-ink-900">{{ user.name }}</p>
            <p class="text-sm text-ink-600">{{ user.email }}</p>
          </div>
        </div>

        <button
          class="w-full rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
          @click="logout()"
        >
          Logout
        </button>
      </div>

      <div v-else class="text-center text-sm text-ink-600">
        You are not signed in.
      </div>
    </div>
  </section>
</template>
