<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl border border-ink-800 p-8 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-ink-text-black">โปรไฟล์ผู้ใช้</h1>
          <button
            class="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
            @click="logout"
          >ออกจากระบบ</button>
        </div>

        <div v-if="!user" class="text-ink-text">
          กำลังโหลดข้อมูลผู้ใช้...
        </div>

        <div v-else class="space-y-6">
          <!-- Avatar -->
          <div class="flex items-center gap-4">
            <img :src="user.avatarUrl || '/favicon.ico'" alt="avatar" class="h-16 w-16 rounded-full object-cover border border-ink-200" />
            <div>
              <label class="block text-sm text-ink-700 mb-1">อัปโหลดรูปโปรไฟล์</label>
              <div class="flex items-center gap-2">
                <input ref="fileInput" type="file" accept="image/*" class="text-sm" @change="onFileChange" />
                <button
                  class="px-3 py-1.5 rounded-lg border border-ink-200 hover:bg-ink-50 text-sm disabled:opacity-60"
                  :disabled="uploading"
                  @click="triggerPick"
                  type="button"
                >เลือกไฟล์</button>
                <span v-if="uploading" class="text-sm text-ink-600">กำลังอัปโหลด...</span>
              </div>
              <p v-if="uploadError" class="text-sm text-red-600 mt-1">{{ uploadError }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-ink-800">ชื่อ</p>
              <p class="font-medium text-ink-800">{{ user.name }}</p>
            </div>
            <div>
              <p class="text-sm text-ink-800">อีเมล</p>
              <p class="font-medium text-ink-800">{{ user.email }}</p>
            </div>
            <div>
              <p class="text-sm text-ink-800">สิทธิ์</p>
              <span class="inline-flex items-center px-2 py-1 rounded bg-black text-white text-sm font-medium">
                {{ user.role }}
              </span>
            </div>
            <div>
              <p class="text-sm text-ink-800">รหัสผู้ใช้ (ID)</p>
              <p class="font-mono text-ink-800 text-sm">{{ user.id }}</p>
            </div>
          </div>

          <div class="mt-8">
            <NuxtLink to="/" class="text-ink-800 hover:text-ink-900">← กลับหน้าแรก</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from 'nuxt/app'
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
// บังคับต้องล็อกอินก่อนเข้าหน้านี้
definePageMeta({ middleware: 'auth' })

const { user, checkAuth, logout } = useAuth()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref<string | null>(null)

function triggerPick() { fileInput.value?.click() }
async function onFileChange(e: Event) {
  uploadError.value = null
  const input = e.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { // 2MB limit
    uploadError.value = 'ไฟล์ใหญ่เกินไป (จำกัด 2MB)'
    return
  }
  uploading.value = true
  try {
    const fd = new FormData()
    fd.set('file', file)
    const res: any = await $fetch('/api/profile/avatar', { method: 'POST', body: fd })
    // refresh user
    await checkAuth()
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage || err?.message || 'อัปโหลดไม่สำเร็จ'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

// SEO Meta
useSeoMeta({
  title: 'โปรไฟล์ผู้ใช้ • WhiteBikeVibes',
  ogTitle: 'โปรไฟล์ผู้ใช้ • WhiteBikeVibes',
  description: 'โปรไฟล์ผู้ใช้ WhiteBikeVibes',
  ogDescription: 'โปรไฟล์ผู้ใช้ WhiteBikeVibes',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})

// รองรับการรีเฟรชหน้า (CSR)
onMounted(async () => {
  if (!user.value) {
    await checkAuth()
  }
})
</script>
