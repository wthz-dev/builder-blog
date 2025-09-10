<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-xl border border-ink-100 p-8 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-ink-900">แก้ไขโพสต์</h1>
          <NuxtLink to="/admin/posts" class="text-ink-600 hover:text-ink-900">ย้อนกลับ</NuxtLink>
        </div>

        <div v-if="!user">
          <p class="text-ink-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>

        <div v-else-if="user.role !== 'ADMIN'" class="text-center">
          <p class="text-ink-700 mb-4">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <NuxtLink to="/" class="text-brand-600 hover:text-brand-700">← กลับหน้าแรก</NuxtLink>
        </div>

        <div v-else>
          <!-- Success Toast -->
          <transition name="fade">
            <div
              v-if="showSuccess"
              class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 flex items-start justify-between"
            >
              <div>
                <p class="font-medium">บันทึกการเปลี่ยนแปลงสำเร็จ</p>
                <p class="text-sm opacity-80">โพสต์ได้รับการอัปเดตเรียบร้อยแล้ว</p>
              </div>
              <button class="ml-4 text-green-800/80 hover:text-green-900" @click="showSuccess = false">ปิด</button>
            </div>
          </transition>
          <div v-if="pending" class="text-ink-600">กำลังโหลดข้อมูลโพสต์...</div>
          <div v-else-if="error" class="text-red-600">{{ error }}</div>

          <form v-else method="post" :action="`/api/admin/posts/${post.id}/update`" enctype="multipart/form-data" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-ink-700 mb-2">ชื่อเรื่อง</label>
              <input name="title" id="title" type="text" required class="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300" :value="post.title" />
            </div>

            <div>
              <label class="block text-sm font-medium text-ink-700 mb-2">Slug</label>
              <input name="slug" id="slug" type="text" required class="w-full px-3 py-2 border border-ink-200 rounded-lg" :value="post.slug" />
            </div>

            <div>
              <label class="block text-sm font-medium text-ink-700 mb-2">บทคัดย่อ (Excerpt)</label>
              <textarea name="excerpt" rows="3" class="w-full px-3 py-2 border border-ink-200 rounded-lg">{{ post.excerpt }}</textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-ink-700 mb-2">เนื้อหา (HTML/Markdown)</label>
              <textarea name="content" rows="10" class="w-full px-3 py-2 border border-ink-200 rounded-lg">{{ post.content }}</textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-2">อัปโหลดรูปปกใหม่ (ถ้าต้องการเปลี่ยน)</label>
                <input name="coverImage" type="file" accept="image/*" class="w-full px-3 py-2 border border-ink-200 rounded-lg bg-white" />
                <p class="text-xs text-ink-500 mt-1">ไม่เลือกไฟล์ = คงรูปเดิม</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-2">หรือใส่ URL รูปปกใหม่</label>
                <input name="coverImageUrl" type="url" class="w-full px-3 py-2 border border-ink-200 rounded-lg" :placeholder="post.coverImageUrl || 'https://...'" />
                <p class="text-xs text-ink-500 mt-1">ถ้าไม่กรอก = คง URL เดิม</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input id="publishNow" name="publishNow" type="checkbox" class="h-4 w-4" :checked="!!post.publishedAt" />
              <label for="publishNow" class="text-sm text-ink-700">เผยแพร่</label>
            </div>

            <div class="flex justify-end gap-3">
              <NuxtLink to="/admin/posts" class="px-4 py-2 border border-ink-200 rounded-lg text-ink-700">ยกเลิก</NuxtLink>
              <button type="submit" class="px-5 py-2 bg-black text-white rounded-lg hover:bg-black/80">บันทึกการเปลี่ยนแปลง</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSeoMeta, useRequestHeaders } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useRoute } from 'vue-router'
import { useAuth } from '../../../../composables/useAuth'

definePageMeta({ middleware: 'auth' })

const { user, checkAuth } = useAuth()
const route = useRoute()
const id = route.params.id as string
const showSuccess = ref(route.query.updated === '1')

useSeoMeta({
  title: 'แก้ไขโพสต์ • WhiteBikeVibes',
  robots: 'noindex, nofollow'
})

if (!user.value) {
  await checkAuth()
}

const pending = ref(true)
const error = ref<string | null>(null)
const post = ref<any>(null)

try {
  const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
  const res = await $fetch<{ post: any }>(`/api/admin/posts/${id}`, { headers })
  post.value = res.post
} catch (e: any) {
  error.value = e?.data?.message || 'โหลดโพสต์ไม่สำเร็จ'
} finally {
  pending.value = false
}
</script>
