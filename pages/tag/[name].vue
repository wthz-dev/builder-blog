<template>
  <div class="container mx-auto px-4 py-10">
    <h1 class="text-2xl md:text-3xl font-bold text-ink-900 mb-6">แท็ก: #{{ decodedName }}</h1>

    <div v-if="pending" class="text-ink-600">กำลังโหลดบทความ...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else>
      <div v-if="posts.length === 0" class="text-ink-600">ยังไม่มีบทความในแท็กนี้</div>
      <div v-else class="grid gap-6">
        <NuxtLink v-for="p in posts" :key="p.id" :to="`/post/${p.slug}`" class="block rounded-xl border border-ink-100 p-4 hover:bg-ink-50">
          <h2 class="text-xl font-semibold text-ink-900">{{ p.title }}</h2>
          <p class="text-sm text-ink-600 mt-1">เผยแพร่เมื่อ {{ formatDate(p.publishedAt) }}</p>
          <p v-if="p.excerpt" class="text-ink-700 mt-2">{{ p.excerpt }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAsyncData, useSeoMeta } from 'nuxt/app'

const route = useRoute()
const name = computed(() => route.params.name as string)
const decodedName = computed(() => decodeURIComponent(name.value || ''))

const posts = ref<any[]>([])
const pending = ref(true)
const error = ref<string | null>(null)

const runtime = useRuntimeConfig()
const siteUrl = (runtime.public as any)?.siteUrl || ''
const canonicalUrl = computed(() => `${siteUrl}/tag/${encodeURIComponent(decodedName.value)}`)
const ogImage = computed(() => `${siteUrl}/og-image.jpg`)
const twitterSite = (runtime.public as any)?.twitterSite || '@whitez52'
const twitterCreator = (runtime.public as any)?.twitterCreator || '@whitez52'

useSeoMeta({
  title: () => decodedName.value ? `แท็ก: #${decodedName.value} • WhiteBikeVibes` : 'แท็ก • WhiteBikeVibes',
  description: () => `บทความทั้งหมดในแท็ก #${decodedName.value}`,
  ogTitle: () => decodedName.value ? `แท็ก: #${decodedName.value} • WhiteBikeVibes` : 'แท็ก • WhiteBikeVibes',
  ogDescription: () => `บทความทั้งหมดในแท็ก #${decodedName.value}`,
  ogUrl: () => canonicalUrl.value,
  ogImage: () => ogImage.value,
  ogImageAlt: () => decodedName.value ? `Tag ${decodedName.value}` : 'Tags',
  twitterCard: 'summary_large_image',
  twitterImage: () => ogImage.value,
  twitterSite,
  twitterCreator
})

// Removed useHead to prevent HMR dispose errors

const { data, pending: p, error: e } = useAsyncData(() => `tag-${decodedName.value}`, async () => {
  if (!decodedName.value) return { posts: [] }
  return $fetch<{ posts: any[] }>(`/api/posts?tag=${encodeURIComponent(decodedName.value)}`)
})

watchEffect(() => {
  pending.value = !!p.value
  if (e.value) {
    error.value = (e.value as any)?.data?.message || 'โหลดข้อมูลไม่สำเร็จ'
  } else {
    posts.value = data.value?.posts || []
  }
})

function formatDate(dt: string | null) {
  if (!dt) return '—'
  try {
    return new Date(dt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dt as any
  }
}
</script>
