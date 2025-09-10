<template>
  <div class="container mx-auto px-4 py-16">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-ink-900">โพสต์ทั้งหมด (Admin)</h1>
      <NuxtLink to="/admin/posts/new" class="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80">
        + เพิ่มโพสต์
      </NuxtLink>
    </div>

    <div v-if="!user" class="text-ink-600">กำลังตรวจสอบสิทธิ์...</div>
    <div v-else-if="user.role !== 'ADMIN'" class="text-ink-700">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>

    <div v-else>
      <div v-if="pending" class="text-ink-600">กำลังโหลดรายการโพสต์...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>

      <div v-else>
        <div class="overflow-x-auto border border-ink-100 rounded-xl">
          <table class="min-w-full divide-y divide-ink-100 bg-white">
            <thead class="bg-ink-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">ชื่อเรื่อง</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">เผยแพร่เมื่อ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">ผู้เขียน</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-ink-100">
              <tr v-for="p in posts" :key="p.id">
                <td class="px-4 py-3 text-ink-900">{{ p.title }}</td>
                <td class="px-4 py-3 text-ink-700">{{ formatDate(p.publishedAt) }}</td>
                <td class="px-4 py-3 text-ink-700">{{ p.author?.name }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-3">
                    <NuxtLink :to="`/post/${p.slug}`" class="text-brand-600 hover:text-brand-700">ดูโพสต์</NuxtLink>
                    <NuxtLink :to="`/admin/posts/${p.id}/edit`" class="text-ink-600 hover:text-ink-900">แก้ไข</NuxtLink>
                    <form :action="`/api/admin/posts/${p.id}/delete`" method="post" class="inline">
                      <button type="submit" class="text-red-600 hover:text-red-700" @click.prevent="onDelete(p.id)">ลบ</button>
                    </form>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!posts || posts.length === 0" class="text-ink-600 mt-4">ยังไม่มีโพสต์</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSeoMeta, useRequestHeaders } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useAuth } from '../../../composables/useAuth'

definePageMeta({ middleware: 'auth' })

const { user, checkAuth } = useAuth()

useSeoMeta({
  title: 'รายการโพสต์ • WhiteBikeVibes',
  robots: 'noindex, nofollow'
})

if (!user.value) {
  await checkAuth()
}

const pending = ref(true)
const error = ref<string | null>(null)
const posts = ref<Array<{ id: string; slug: string; title: string; publishedAt: string | null; author?: { name: string } }>>([])

function formatDate(dt: string | null) {
  if (!dt) return '—'
  try {
    return new Date(dt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dt
  }
}

try {
  const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
  const res = await $fetch<{ posts: any[] }>('/api/admin/posts', { headers })
  posts.value = res.posts
} catch (e: any) {
  error.value = e?.data?.message || 'โหลดข้อมูลไม่สำเร็จ'
} finally {
  pending.value = false
}

async function onDelete(id: string) {
  if (!confirm('ยืนยันการลบโพสต์นี้?')) return
  try {
    const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
    await $fetch(`/api/admin/posts/${id}/delete`, { method: 'POST', headers })
    posts.value = posts.value.filter((x) => x.id !== id)
  } catch (e: any) {
    alert(e?.data?.message || 'ลบไม่สำเร็จ')
  }
}
</script>
