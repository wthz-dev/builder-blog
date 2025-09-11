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
              <input name="title" id="title" type="text" required class="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300" :value="post.title" @input="onTitleInput" />
            </div>

            <div>
              <label class="block text-sm font-medium text-ink-700 mb-2">Slug</label>
              <div class="flex items-center gap-2">
                <input name="slug" id="slug" type="text" required class="w-full px-3 py-2 border border-ink-200 rounded-lg" v-model="slugVal" />
                <button type="button" class="px-3 py-2 text-sm border border-ink-200 rounded-lg hover:bg-ink-50" @click="generateLatinSlug">Generate Latin slug</button>
              </div>
              <p class="text-xs text-ink-500 mt-1">แก้ไข slug ได้ตามต้องการ • กดปุ่มเพื่อแปลงจากชื่อเรื่องเป็นตัวอักษรอังกฤษ</p>
              <!-- keep a hidden input to submit v-model value into 'slug' field -->
              <input type="hidden" name="slug" :value="slugVal" />
            </div>

            <div>
              <label class="block text-sm font-medium text-ink-700 mb-2">บทคัดย่อ (Excerpt)</label>
              <textarea name="excerpt" rows="3" class="w-full px-3 py-2 border border-ink-200 rounded-lg">{{ post.excerpt }}</textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-ink-700 mb-2">เนื้อหา (HTML/Markdown)</label>
              <textarea name="content" rows="10" class="w-full px-3 py-2 border border-ink-200 rounded-lg">{{ post.content }}</textarea>
            </div>

            <!-- Cover preview -->
            <div v-if="post.coverImageUrl && !removeCover" class="mb-4">
              <label class="block text-sm font-medium text-ink-700 mb-2">รูปปกปัจจุบัน</label>
              <img :src="post.coverImageUrl" alt="cover" class="w-full max-w-md rounded-lg border border-ink-100" />
              <div class="mt-2 flex gap-2">
                <a :href="post.coverImageUrl" target="_blank" class="px-3 py-1 text-xs border border-ink-200 rounded-lg">เปิดรูป</a>
                <button class="px-3 py-1 text-xs border border-red-200 text-red-700 rounded-lg hover:bg-red-50" @click.prevent="removeCover = true">ลบรูปนี้</button>
              </div>
            </div>

            <div :class="['grid grid-cols-1 md:grid-cols-2 gap-4', removeCover ? 'opacity-70' : '']">
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
              <input id="removeCover" v-model="removeCover" name="removeCover" type="checkbox" class="h-4 w-4" />
              <label for="removeCover" class="text-sm text-ink-700">ลบรูปปกเดิม</label>
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
import { ref, computed, watchEffect } from 'vue'
import { useSeoMeta, useRequestHeaders, useAsyncData } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useRoute } from 'vue-router'
import { useAuth } from '../../../../composables/useAuth'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
const route = useRoute()
const id = route.params.id as string
const showSuccess = ref(route.query.updated === '1')

useSeoMeta({
  title: 'แก้ไขโพสต์ • WhiteBikeVibes',
  robots: 'noindex, nofollow'
})

// ใช้ middleware 'auth' แทนการ await checkAuth() ที่ top-level

const pending = ref(true)
const error = ref<string | null>(null)
const post = ref<any>(null)

// Options + selections for categories/tags
const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])
const selectedCategories = ref<string[]>([])
const selectedTags = ref<string[]>([])
const removeCover = ref(false)
// Slug editing state
const slugVal = ref('')
const titleValue = ref('')

const { data, error: err, pending: p } = await useAsyncData(`admin-post-${id}`, async () => {
  const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
  const [postRes, cats, tags] = await Promise.all([
    $fetch<{ post: any }>(`/api/admin/posts/${id}`, { headers }),
    $fetch<{ categories: Array<{ id: string; name: string }> }>(`/api/categories`),
    $fetch<{ tags: Array<{ id: string; name: string }> }>(`/api/tags`)
  ])
  return { post: postRes.post, cats, tags }
})

watchEffect(() => {
  pending.value = !!p.value
  if (err.value) {
    error.value = (err.value as any)?.data?.message || 'โหลดโพสต์ไม่สำเร็จ'
    return
  }
  const v = data.value
  if (!v) return
  post.value = v.post
  // initialize slug/title locals
  slugVal.value = post.value?.slug || ''
  titleValue.value = post.value?.title || ''
  categoryOptions.value = (v.cats?.categories || []).map((c: any) => c.name)
  tagOptions.value = (v.tags?.tags || []).map((t: any) => t.name)
  selectedCategories.value = (post.value?.categories || []).map((c: any) => c.name || c.category?.name).filter(Boolean)
  selectedTags.value = (post.value?.tags || []).map((t: any) => t.name || t.tag?.name).filter(Boolean)
})

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

function onTitleInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  titleValue.value = v
}

function generateLatinSlug() {
  const v = titleValue.value || ''
  const latin = thaiToLatin(v)
  slugVal.value = latin
}

function thaiToLatin(input: string) {
  const map: Record<string, string> = {
    'ก': 'k','ข': 'kh','ฃ': 'kh','ค': 'kh','ฅ': 'kh','ฆ': 'kh','ง': 'ng','จ': 'ch','ฉ': 'ch','ช': 'ch','ซ': 's','ฌ': 'ch',
    'ญ': 'y','ฎ': 'd','ฏ': 't','ฐ': 'th','ฑ': 'th','ฒ': 'th','ด': 'd','ต': 't','ถ': 'th','ท': 'th','ธ': 'th','ณ': 'n','น': 'n',
    'บ': 'b','ป': 'p','ผ': 'ph','พ': 'ph','ภ': 'ph','ฝ': 'f','ฟ': 'f','ม': 'm','ย': 'y','ร': 'r','ล': 'l','ว': 'w','ศ': 's','ษ': 's','ส': 's','ห': 'h','ฮ': 'h',
    'อ': 'o','ฤ': 'rue','ฦ': 'lue',
    'ะ': 'a','า': 'a','ิ': 'i','ี': 'i','ึ': 'ue','ื': 'ue','ุ': 'u','ู': 'u','เ': 'e','แ': 'ae','โ': 'o','ไ': 'ai','ใ': 'ai','ๅ': 'a',
    '๑': '1','๒': '2','๓': '3','๔': '4','๕': '5','๖': '6','๗': '7','๘': '8','๙': '9','๐': '0'
  }
  const toneRemoved = input.replace(/[\u0E48-\u0E4B]/g, '')
  const replaced = Array.from(toneRemoved).map(ch => map[ch] ?? ch).join('')
  return replaced
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\-\s]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}
</script>
