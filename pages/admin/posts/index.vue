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
        <!-- Filters -->
        <div class="mb-4 flex flex-wrap items-end gap-3">
          <div class="grow min-w-64">
            <label class="block text-xs font-medium text-ink-600 mb-1">ค้นหาชื่อเรื่อง</label>
            <input v-model="searchTerm" type="text" placeholder="พิมพ์คำค้น..." class="w-full px-3 py-2 border border-ink-200 rounded-lg" />
          </div>
          <div class="min-w-64">
            <label class="block text-xs font-medium text-ink-600 mb-1">หมวด (หลายรายการ)</label>
            <Multiselect
              class="text-ink-900"
              v-model="selectedCategories"
              :options="categoryOptions"
              :multiple="true"
              :close-on-select="false"
              placeholder="เลือกหมวด..."
            />
          </div>
          <div class="min-w-64">
            <label class="block text-xs font-medium text-ink-600 mb-1">แท็ก (หลายรายการ)</label>
            <Multiselect
              v-model="selectedTags"
              :options="tagOptions"
              :multiple="true"
              :close-on-select="false"
              placeholder="เลือกแท็ก..."
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-600 mb-1">วันที่เริ่ม</label>
            <input v-model="fromDate" type="date" class="px-3 py-2 border border-ink-200 rounded-lg bg-white" />
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-600 mb-1">วันที่สิ้นสุด</label>
            <input v-model="toDate" type="date" class="px-3 py-2 border border-ink-200 rounded-lg bg-white" />
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-600 mb-1">เรียงลำดับ</label>
            <select v-model="sortKey" class="px-3 py-2 border border-ink-200 rounded-lg bg-white">
              <option value="date_desc">วันที่ใหม่ → เก่า</option>
              <option value="date_asc">วันที่เก่า → ใหม่</option>
              <option value="title_asc">ชื่อเรื่อง A → Z</option>
              <option value="title_desc">ชื่อเรื่อง Z → A</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-2 border border-ink-200 rounded-lg" @click="clearFilters">ล้างตัวกรอง</button>
            <button class="px-3 py-2 border border-ink-200 rounded-lg" @click="copyShareLink">คัดลอกลิงก์ตัวกรอง</button>
          </div>
        </div>

        <div class="overflow-x-auto border border-ink-100 rounded-xl">
          <table class="min-w-full divide-y divide-ink-100 bg-white">
            <thead class="bg-ink-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">ชื่อเรื่อง</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">เผยแพร่เมื่อ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">ผู้เขียน</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">หมวด/แท็ก</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-ink-100">
              <tr v-for="p in filteredPosts" :key="p.id">
                <td class="px-4 py-3 text-ink-900">{{ p.title }}</td>
                <td class="px-4 py-3 text-ink-700">{{ formatDate(p.publishedAt) }}</td>
                <td class="px-4 py-3 text-ink-700">{{ p.author?.name }}</td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="c in (p.categories || []).slice(0,3)" :key="`c-${p.id}-${c?.category?.name}`" class="text-xs bg-ink-100 text-ink-700 px-2 py-0.5 rounded">{{ c?.category?.name }}</span>
                    <span v-for="t in (p.tags || []).slice(0,3)" :key="`t-${p.id}-${t?.tag?.name}`" class="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded">#{{ t?.tag?.name }}</span>
                    <span v-if="(p.categories?.length || 0) + (p.tags?.length || 0) > 6" class="text-xs text-ink-500">+{{ (p.categories?.length || 0) + (p.tags?.length || 0) - 6 }}</span>
                  </div>
                </td>
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
import { ref, watchEffect, computed, onMounted, watch } from 'vue'
import { useSeoMeta, useRequestHeaders, useAsyncData } from 'nuxt/app'
import { useRoute, useRouter } from 'vue-router'
import { definePageMeta } from '#imports'
import { useAuth } from '../../../composables/useAuth'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

definePageMeta({ middleware: 'auth' })

const { user, checkAuth } = useAuth()

useSeoMeta({
  title: 'รายการโพสต์ • WhiteBikeVibes',
  robots: 'noindex, nofollow'
})

const pending = ref(true)
const error = ref<string | null>(null)
const posts = ref<any[]>([])
const route = useRoute()
const router = useRouter()

// Client-side filters
const searchTerm = ref('')
const selectedCategories = ref<string[]>([])
const selectedTags = ref<string[]>([])
const fromDate = ref('')
const toDate = ref('')
const sortKey = ref<'date_desc'|'date_asc'|'title_asc'|'title_desc'>('date_desc')
const categoryOptions = computed(() => {
  const set = new Set<string>()
  for (const p of posts.value || []) {
    for (const c of p.categories || []) {
      const name = c?.category?.name
      if (name) set.add(name)
    }
  }
  return Array.from(set).sort((a,b) => a.localeCompare(b))
})
const tagOptions = computed(() => {
  const set = new Set<string>()
  for (const p of posts.value || []) {
    for (const t of p.tags || []) {
      const name = t?.tag?.name
      if (name) set.add(name)
    }
  }
  return Array.from(set).sort((a,b) => a.localeCompare(b))
})
const filteredPosts = computed(() => {
  const filtered = (posts.value || []).filter((p) => {
    const passCategory = selectedCategories.value.length === 0 || (p.categories || []).some((c:any) => selectedCategories.value.includes(c?.category?.name))
    const passTag = selectedTags.value.length === 0 || (p.tags || []).some((t:any) => selectedTags.value.includes(t?.tag?.name))
    const passSearch = !searchTerm.value || (p.title || '').toLowerCase().includes(searchTerm.value.toLowerCase())
    let passFrom = true
    let passTo = true
    if (fromDate.value) {
      passFrom = !!p.publishedAt && new Date(p.publishedAt) >= new Date(fromDate.value)
    }
    if (toDate.value) {
      const to = new Date(toDate.value)
      to.setHours(23,59,59,999)
      passTo = !!p.publishedAt && new Date(p.publishedAt) <= to
    }
    return passCategory && passTag && passSearch && passFrom && passTo
  })
  // sort
  return filtered.sort((a:any, b:any) => {
    switch (sortKey.value) {
      case 'date_asc':
        return new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime()
      case 'title_asc':
        return (a.title || '').localeCompare(b.title || '')
      case 'title_desc':
        return (b.title || '').localeCompare(a.title || '')
      case 'date_desc':
      default:
        return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    }
  })
})
function clearFilters() {
  searchTerm.value = ''
  selectedCategories.value = []
  selectedTags.value = []
  fromDate.value = ''
  toDate.value = ''
  sortKey.value = 'date_desc'
}

function formatDate(dt: string | null) {
  if (!dt) return '—'
  try {
    return new Date(dt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dt
  }
}

const { data, error: err, pending: p } = useAsyncData('admin-posts', async () => {
  const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
  return $fetch<{ posts: any[] }>('/api/admin/posts', { headers })
})
watchEffect(() => {
  pending.value = !!p.value
  if (err.value) {
    error.value = (err.value as any)?.data?.message || 'โหลดข้อมูลไม่สำเร็จ'
  } else if (data.value) {
    posts.value = data.value.posts
  }
})

// Sync filters <-> query string
onMounted(() => {
  const q = route.query
  if (typeof q.q === 'string') searchTerm.value = q.q
  if (typeof q.categories === 'string') selectedCategories.value = q.categories.split(',').map(s => s.trim()).filter(Boolean)
  if (typeof q.tags === 'string') selectedTags.value = q.tags.split(',').map(s => s.trim()).filter(Boolean)
  if (typeof q.from === 'string') fromDate.value = q.from
  if (typeof q.to === 'string') toDate.value = q.to
  if (typeof q.sort === 'string' && ['date_desc','date_asc','title_asc','title_desc'].includes(q.sort)) sortKey.value = q.sort as any
})
watch([searchTerm, selectedCategories, selectedTags], () => {
  const q: any = {}
  if (searchTerm.value) q.q = searchTerm.value
  if (selectedCategories.value.length) q.categories = selectedCategories.value.join(',')
  if (selectedTags.value.length) q.tags = selectedTags.value.join(',')
  if (fromDate.value) q.from = fromDate.value
  if (toDate.value) q.to = toDate.value
  if (sortKey.value && sortKey.value !== 'date_desc') q.sort = sortKey.value
  router.replace({ query: q })
}, { deep: true })

watch([fromDate, toDate, sortKey], () => {
  const q: any = {}
  if (searchTerm.value) q.q = searchTerm.value
  if (selectedCategories.value.length) q.categories = selectedCategories.value.join(',')
  if (selectedTags.value.length) q.tags = selectedTags.value.join(',')
  if (fromDate.value) q.from = fromDate.value
  if (toDate.value) q.to = toDate.value
  if (sortKey.value && sortKey.value !== 'date_desc') q.sort = sortKey.value
  router.replace({ query: q })
})

async function copyShareLink() {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const url = origin + route.fullPath
    await navigator.clipboard.writeText(url)
    alert('คัดลอกลิงก์ตัวกรองแล้ว')
  } catch {
    alert('คัดลอกลิงก์ไม่สำเร็จ')
  }
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
