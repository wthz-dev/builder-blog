<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-xl border border-ink-100 p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-ink-900 mb-6">สร้างโพสต์ใหม่</h1>

        <div v-if="!user">
          <p class="text-ink-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>

        <div v-else-if="user.role !== 'ADMIN'" class="text-center">
          <p class="text-ink-700 mb-4">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <NuxtLink to="/" class="text-brand-600 hover:text-brand-700">← กลับหน้าแรก</NuxtLink>
        </div>

        <form v-else method="post" action="/api/admin/posts" enctype="multipart/form-data" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-2">ชื่อเรื่อง</label>
            <input name="title" id="title" type="text" required class="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300" @input="onTitleInput" />
          </div>

          <div>
            <label class="block text-sm font-medium text-ink-700 mb-2">Slug</label>
            <input name="slug" id="slug" type="text" required class="w-full px-3 py-2 border border-ink-200 rounded-lg" :value="slug" readonly />
            <p class="text-xs text-ink-500 mt-1">จะถูกสร้างอัตโนมัติจากชื่อเรื่อง (แก้ไขได้ภายหลังในฐานข้อมูล)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-ink-700 mb-2">บทคัดย่อ (Excerpt)</label>
            <textarea name="excerpt" rows="3" class="w-full px-3 py-2 border border-ink-200 rounded-lg"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-ink-700 mb-2">เนื้อหา (HTML/Markdown)</label>
            <textarea name="content" rows="10" class="w-full px-3 py-2 border border-ink-200 rounded-lg" placeholder="<p>ใส่เนื้อหาโพสต์...</p>"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-ink-700 mb-2">อัปโหลดรูปปก (ไฟล์ภาพ)</label>
              <input name="coverImage" type="file" accept="image/*" class="w-full px-3 py-2 border border-ink-200 rounded-lg bg-white" />
              <p class="text-xs text-ink-500 mt-1">รองรับ JPG/PNG/WebP เป็นต้น</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-ink-700 mb-2">หรือใส่ URL รูปปก</label>
              <input name="coverImageUrl" type="url" class="w-full px-3 py-2 border border-ink-200 rounded-lg" placeholder="https://..." />
              <p class="text-xs text-ink-500 mt-1">ระบุอย่างใดอย่างหนึ่ง (ไฟล์ หรือ URL)</p>
            </div>
          </div>

          <!-- Categories Selector (vue-multiselect) -->
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-2">หมวดหมู่</label>
            <Multiselect
              v-model="selectedCategories"
              :options="categoryOptions"
              :multiple="true"
              :taggable="true"
              tag-placeholder="กด Enter เพื่อเพิ่ม"
              placeholder="เลือกหรือพิมพ์เพิ่ม..."
              @tag="addCategory"
            />
            <!-- serialize for form submit -->
            <input type="hidden" name="categoryNames" :value="selectedCategories.join(',')" />
          </div>

          <!-- Tags Selector (vue-multiselect) -->
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-2">แท็ก</label>
            <Multiselect
              v-model="selectedTags"
              :options="tagOptions"
              :multiple="true"
              :taggable="true"
              tag-placeholder="กด Enter เพื่อเพิ่ม"
              placeholder="เลือกหรือพิมพ์เพิ่ม..."
              @tag="addTag"
            />
            <!-- serialize for form submit -->
            <input type="hidden" name="tagNames" :value="selectedTags.join(',')" />
          </div>

          <div class="flex items-center gap-2">
            <input id="publishNow" name="publishNow" type="checkbox" class="h-4 w-4" checked />
            <label for="publishNow" class="text-sm text-ink-700">เผยแพร่ทันที</label>
          </div>

          <div class="flex justify-end gap-3">
            <NuxtLink to="/" class="px-4 py-2 border border-ink-200 rounded-lg text-ink-700">ยกเลิก</NuxtLink>
            <button type="submit" class="px-5 py-2 bg-black text-white rounded-lg hover:bg-black/80">บันทึกโพสต์</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useAsyncData } from 'nuxt/app'
import { ref, watchEffect } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { useAuth } from '../../../composables/useAuth'

definePageMeta({ middleware: 'auth' })

const { user } = useAuth()

useSeoMeta({
  title: 'สร้างโพสต์ใหม่ • WhiteBikeVibes',
  robots: 'noindex, nofollow'
})

// ใช้ middleware 'auth' แทนการ await checkAuth() ที่ top-level

const slug = ref('')
function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}
function onTitleInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  slug.value = slugify(v)
  const slugEl = document.getElementById('slug') as HTMLInputElement | null
  if (slugEl) slugEl.value = slug.value
}

// Load options for categories and tags (no top-level await)
const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])
const { data: categoriesData } = useAsyncData('admin-new-categories', () => $fetch<{ categories: Array<{ id: string; name: string }> }>('/api/categories'))
const { data: tagsData } = useAsyncData('admin-new-tags', () => $fetch<{ tags: Array<{ id: string; name: string }> }>('/api/tags'))
watchEffect(() => {
  categoryOptions.value = (categoriesData.value?.categories || []).map(c => c.name)
  tagOptions.value = (tagsData.value?.tags || []).map(t => t.name)
})

// Selected models
const selectedCategories = ref<string[]>([])
const selectedTags = ref<string[]>([])

function addCategory(newTag: string) {
  const v = newTag.trim()
  if (!v) return
  if (!categoryOptions.value.includes(v)) categoryOptions.value.push(v)
  if (!selectedCategories.value.includes(v)) selectedCategories.value.push(v)
}
function addTag(newTag: string) {
  const v = newTag.trim()
  if (!v) return
  if (!tagOptions.value.includes(v)) tagOptions.value.push(v)
  if (!selectedTags.value.includes(v)) selectedTags.value.push(v)
}
</script>
