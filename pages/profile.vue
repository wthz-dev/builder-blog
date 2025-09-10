<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl border border-ink-100 p-8 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-ink-900">โปรไฟล์ผู้ใช้</h1>
          <button
            class="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
            @click="logout"
          >ออกจากระบบ</button>
        </div>

        <div v-if="!user" class="text-ink-600">
          กำลังโหลดข้อมูลผู้ใช้...
        </div>

        <div v-else class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-ink-500">ชื่อ</p>
              <p class="font-medium text-ink-900">{{ user.name }}</p>
            </div>
            <div>
              <p class="text-sm text-ink-500">อีเมล</p>
              <p class="font-medium text-ink-900">{{ user.email }}</p>
            </div>
            <div>
              <p class="text-sm text-ink-500">สิทธิ์</p>
              <span class="inline-flex items-center px-2 py-1 rounded bg-ink-100 text-ink-700 text-sm font-medium">
                {{ user.role }}
              </span>
            </div>
            <div>
              <p class="text-sm text-ink-500">รหัสผู้ใช้ (ID)</p>
              <p class="font-mono text-ink-800 text-sm">{{ user.id }}</p>
            </div>
          </div>

          <div class="mt-8">
            <NuxtLink to="/" class="text-brand-600 hover:text-brand-700">← กลับหน้าแรก</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'
// บังคับต้องล็อกอินก่อนเข้าหน้านี้
definePageMeta({ middleware: 'auth' })

const { user, checkAuth, logout } = useAuth()

// SEO Meta
useSeoMeta({
  title: 'โปรไฟล์ผู้ใช้ • WhiteBikeVibes',
  ogTitle: 'โปรไฟล์ผู้ใช้ • WhiteBikeVibes',
  description: 'โปรไฟล์ผู้ใช้ WhiteBikeVibes',
  ogDescription: 'โปรไฟล์ผู้ใช้ WhiteBikeVibes',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})

// รองรับการรีเฟรชหน้า (SSR/CSR)
if (!user.value) {
  await checkAuth()
}
</script>
