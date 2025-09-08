<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const mobileOpen = ref(false)
const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

const isLoggedIn = computed(() => !!user.value)
const initials = computed(() => (user.value ? user.value.name.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase() : ''))

const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin/posts', label: 'Admin' },
]

function doLogout() {
  logout()
  router.push('/').catch(() => {})
}
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-ink-100/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
  >
    <div class="container flex h-16 items-center justify-between">
      <RouterLink to="/" class="group inline-flex items-center gap-2">
        <div
          class="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-soft"
        ></div>
        <span class="font-display text-lg font-bold text-ink-900">Torkait</span>
      </RouterLink>

      <nav class="hidden items-center gap-6 md:flex">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
          :class="{ 'text-ink-900': route.path === item.to }"
        >
          {{ item.label }}
        </RouterLink>
        <template v-if="!isLoggedIn">
          <RouterLink
            to="/login"
            class="rounded-lg bg-ink-900 px-3 py-2 text-sm font-semibold text-white shadow-soft hover:bg-ink-800"
            >Login</RouterLink
          >
          <RouterLink
            to="/register"
            class="rounded-lg border border-ink-200 px-3 py-2 text-sm font-semibold text-ink-900 hover:bg-ink-50"
            >Sign up</RouterLink
          >
        </template>
        <template v-else>
          <RouterLink
            to="/profile"
            class="inline-flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm font-semibold text-ink-900 hover:bg-ink-50"
          >
            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-xs text-white">{{ initials }}</span>
            <span>{{ user!.name }}</span>
          </RouterLink>
          <button
            @click="doLogout"
            class="rounded-lg bg-ink-900 px-3 py-2 text-sm font-semibold text-white shadow-soft hover:bg-ink-800"
          >Logout</button>
        </template>
      </nav>

      <button
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 md:hidden"
        aria-label="Toggle navigation"
        @click="mobileOpen = !mobileOpen"
      >
        <svg
          v-if="!mobileOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-show="mobileOpen" class="border-t border-ink-100 bg-white md:hidden">
      <div class="container flex flex-col gap-2 py-3">
        <RouterLink
          v-for="item in nav"
          :key="item.to + '-m'"
          :to="item.to"
          class="rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </RouterLink>
        <div class="mt-2 grid grid-cols-2 gap-2" v-if="!isLoggedIn">
          <RouterLink
            to="/login"
            class="rounded-lg bg-ink-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-ink-800"
            @click="mobileOpen = false"
            >Login</RouterLink
          >
          <RouterLink
            to="/register"
            class="rounded-lg border border-ink-200 px-3 py-2 text-center text-sm font-semibold text-ink-900 hover:bg-ink-50"
            @click="mobileOpen = false"
            >Sign up</RouterLink
          >
        </div>
        <div class="mt-2 grid grid-cols-2 gap-2" v-else>
          <RouterLink
            to="/profile"
            class="rounded-lg border border-ink-200 px-3 py-2 text-center text-sm font-semibold text-ink-900 hover:bg-ink-50"
            @click="mobileOpen = false"
            >Profile</RouterLink
          >
          <button
            class="rounded-lg bg-ink-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-ink-800"
            @click="mobileOpen = false; doLogout()"
          >Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>
