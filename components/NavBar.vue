<template>
  <nav :class="['sticky top-0 z-50 border-b text-black bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white', scrolled ? 'shadow-md border-ink-200' : 'border-ink-100']">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/new_logo.png" alt="WhiteBikeVibes" class="block h-10 w-auto sm:h-[60px]" @error="logoError=true" v-if="!logoError" />
          <span v-else class="text-xl font-extrabold tracking-tight text-ink-900">WhiteBikeVibes</span>
          <span class="text-xl font-extrabold tracking-tight text-ink-900">WhiteBikeVibes</span>
        </NuxtLink>

        <!-- Desktop menu -->
        <div class="hidden lg:flex items-center gap-6">
          <NuxtLink to="/" class="text-ink-600 hover:text-ink-900 transition-colors">หน้าแรก</NuxtLink>
          <NuxtLink to="/about" class="text-ink-600 hover:text-ink-900 transition-colors">เกี่ยวกับ</NuxtLink>
          <NuxtLink to="/contact" class="text-ink-600 hover:text-ink-900 transition-colors">ติดต่อ</NuxtLink>
          <NuxtLink to="/privacy-policy" class="text-ink-600 hover:text-ink-900 transition-colors">นโยบายความเป็นส่วนตัว</NuxtLink>
        </div>

        <!-- Right side (search, theme, auth) - desktop -->
        <div class="hidden lg:flex items-center gap-2">
          <!-- Search -->
          <form class="relative" @submit.prevent="submitSearch">
            <input v-model="search" type="search" placeholder="ค้นหา..." class="h-9 w-72 rounded-full border border-ink-200 bg-white pl-9 pr-3 text-sm text-ink-700 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300" />
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">🔎</span>
          </form>

          <!-- Theme toggle -->
          <!-- <button class="h-9 w-9 grid place-items-center rounded-full border border-ink-200 bg-white hover:bg-ink-50 text-ink-700" @click="toggleTheme" :title="theme==='dark' ? 'Light mode' : 'Dark mode'">
            <span v-if="theme==='dark'">☀️</span>
            <span v-else>🌙</span>
          </button> -->

          <!-- Auth -->
          <template v-if="user">
            <div class="relative" @keydown.escape="menuOpen=false">
              <button class="flex items-center gap-2 rounded-full border border-ink-200 py-1 pl-1 pr-2 hover:bg-ink-50 text-ink-700" @click="menuOpen=!menuOpen">
                <img :src="user.avatarUrl || '/profile.svg'" alt="Profile" class="h-8 w-8 rounded-full object-cover" />
                <svg class="h-4 w-4 text-ink-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
              </button>
              <transition name="fade">
                <div v-if="menuOpen" class="absolute right-0 mt-2 min-w-[220px] rounded-xl border border-ink-100 bg-white text-ink-800 shadow-xl ring-1 ring-black/5">
                  <div class="px-3 py-2 text-xs font-medium text-ink-500">บัญชี</div>
                  <NuxtLink to="/profile" class="px-3 py-2 flex items-center gap-2 text-sm hover:bg-ink-50 rounded-lg" @click="closeMenu">โปรไฟล์</NuxtLink>
                  <template v-if="user && user.role === 'ADMIN'">
                    <div class="px-3 pt-2 text-xs font-medium text-ink-500">แอดมิน</div>
                    <NuxtLink to="/admin/posts" class="px-3 py-2 flex items-center gap-2 text-sm hover:bg-ink-50 rounded-lg" @click="g('nav_admin_posts'); closeMenu()">จัดการโพสต์</NuxtLink>
                    <NuxtLink to="/admin/contacts" class="px-3 py-2 flex items-center gap-2 text-sm hover:bg-ink-50 rounded-lg" @click="g('nav_admin_contacts'); closeMenu()">รายการติดต่อ</NuxtLink>
                    <NuxtLink to="/admin/posts/new" class="px-3 py-2 flex items-center gap-2 text-sm hover:bg-ink-50 rounded-lg" @click="g('nav_admin_new_post'); closeMenu()">+ เพิ่มโพสต์</NuxtLink>
                    <NuxtLink to="/admin/users" class="px-3 py-2 flex items-center gap-2 text-sm hover:bg-ink-50 rounded-lg" @click="g('nav_admin_users'); closeMenu()">จัดการผู้ใช้</NuxtLink>
                  </template>
                  <div class="h-px bg-ink-100 my-1"></div>
                  <button class="px-3 py-2 w-full text-left text-sm hover:bg-ink-50 rounded-lg" @click="handleLogout">ออกจากระบบ</button>
                </div>
              </transition>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="text-ink-600 hover:text-ink-900 transition-colors">เข้าสู่ระบบ</NuxtLink>
            <NuxtLink to="/register" class="bg-black text-white px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors">สมัครสมาชิก</NuxtLink>
          </template>
        </div>

        <!-- Mobile: hamburger -->
        <button class="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-ink-700 hover:bg-ink-50" @click="open = true" aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile sheet (teleported to body to avoid stacking/overflow issues) -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="open" class="fixed inset-0 z-[999] bg-black/30" @click.self="open = false" aria-modal="true" role="dialog">
          <div class="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl p-4 overflow-y-auto z-[1000]">
            <div class="flex items-center justify-between mb-4">
              <span class="text-lg font-semibold">เมนู</span>
              <button class="p-2 hover:bg-ink-50 rounded-md" @click="open = false" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="grid gap-2">
              <!-- Mobile search -->
              <form class="relative mb-2" @submit.prevent="submitSearch">
                <input v-model="search" type="search" placeholder="ค้นหา..." class="w-full rounded-lg border border-ink-200 bg-white px-9 py-2 text-sm text-ink-700 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300" />
                <span class="absolute left-2 top-1/2 -translate-y-1/2 text-ink-400">🔎</span>
              </form>

              <NuxtLink to="/" class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50" @click="close()">หน้าแรก</NuxtLink>
              <NuxtLink to="/about" class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50" @click="close()">เกี่ยวกับ</NuxtLink>
              <NuxtLink to="/contact" class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50" @click="close()">ติดต่อ</NuxtLink>
              <NuxtLink to="/privacy-policy" class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50" @click="close()">นโยบายความเป็นส่วนตัว</NuxtLink>
              <div class="h-px bg-ink-200 my-2" />
              <template v-if="user">
                <NuxtLink to="/profile" class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50" @click="close()">โปรไฟล์ ({{ user.name }})</NuxtLink>
                <template v-if="user.role === 'ADMIN'">
                  <div class="h-px bg-ink-200 my-2" />
                  <NuxtLink to="/admin/posts" class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50" @click="g('nav_admin_posts'); close()">จัดการโพสต์</NuxtLink>
                  <NuxtLink to="/admin/contacts" class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50" @click="g('nav_admin_contacts'); close()">รายการติดต่อ</NuxtLink>
                  <NuxtLink to="/admin/posts/new" class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50" @click="g('nav_admin_new_post'); close()">+ เพิ่มโพสต์</NuxtLink>
                </template>
                <button class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50 text-left" @click="logout(); close()">ออกจากระบบ</button>
              </template>
              <template v-else>
                <NuxtLink to="/login" class="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-50" @click="close()">เข้าสู่ระบบ</NuxtLink>
                <NuxtLink to="/register" class="px-3 py-2 rounded-lg bg-black text-white hover:bg-black/80 text-center" @click="close()">สมัครสมาชิก</NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const open = ref(false)
const menuOpen = ref(false)
const search = ref('')
const theme = ref<'light'|'dark'>(getInitialTheme())
const scrolled = ref(false)
const logoError = ref(false)
const { user, logout } = useAuth()
const { click } = useGtag()
const router = useRouter()

function g(name: string) { click(name, { location: 'navbar' }) }
function close() { open.value = false }
function closeMenu() { menuOpen.value = false }
function initialsFromName(name?: string) {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] || 'U').toUpperCase()
}
const initials = computed(() => initialsFromName(user.value?.name))

function submitSearch() {
  if (!search.value) return
  router.push({ path: '/', query: { q: search.value } })
  g('nav_search')
  open.value = false
}

function getInitialTheme(): 'light'|'dark' {
  if (process.client) {
    const stored = localStorage.getItem('theme') as 'light'|'dark'|null
    if (stored) return stored
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }
  return 'light'
}

watch(theme, (v) => {
  if (!process.client) return
  const root = document.documentElement
  if (v === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  localStorage.setItem('theme', v)
})

const onScroll = () => { if (process.client) scrolled.value = window.scrollY > 8 }
onMounted(() => {
  if (!process.client) return
  // apply initial theme
  const root = document.documentElement
  if (theme.value === 'dark') root.classList.add('dark')
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => { if (process.client) window.removeEventListener('scroll', onScroll) })

function toggleTheme() {
  const next = theme.value === 'dark' ? 'light' : 'dark'
  theme.value = next
  if (process.client) {
    const root = document.documentElement
    root.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }
}

function handleLogout() {
  logout()
  closeMenu()
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity: 0 }
</style>
