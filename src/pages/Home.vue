<script setup lang="ts">
import { computed, ref, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import PostCard from '@/components/PostCard.vue'
import Pagination from '@/components/Pagination.vue'
import type { BlogPost } from '@/data/mockPosts'
import { useSeo } from '@/composables/useSeo'
import { usePosts } from '@/composables/usePosts'

const route = useRoute()
const router = useRouter()
const { list } = usePosts()

const pageSize = 6
const page = ref(Number(route.query.page || 1))

const activeCategory = computed(() =>
  (route.params.slug as string) && route.name === 'category' ? (route.params.slug as string) : null,
)
const activeTag = computed(() =>
  (route.params.slug as string) && route.name === 'tag' ? (route.params.slug as string) : null,
)

const apiPosts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await list()
    // Map API shape to BlogPost shape used by UI
    apiPosts.value = res.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      categories: (p.categories || []).map((c: any) => c.category?.name).filter(Boolean),
      tags: (p.tags || []).map((t: any) => t.tag?.name).filter(Boolean),
      author: p.author?.name || 'Unknown',
      publishedAt: p.publishedAt,
    }))
  } catch (e: any) {
    error.value = e?.message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
})

const filtered = computed(() => {
  let list = [...apiPosts.value]
  if (activeCategory.value) list = list.filter((p) => p.categories.includes(activeCategory.value!))
  if (activeTag.value) list = list.filter((p) => p.tags.includes(activeTag.value!))
  return list.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
})

const total = computed(() => filtered.value.length)
const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

watchEffect(() => {
  const baseTitle = activeCategory.value
    ? `Category: ${activeCategory.value}`
    : activeTag.value
      ? `Tag: ${activeTag.value}`
      : 'Latest Posts'

  useSeo({
    title: baseTitle,
    description:
      'Read the latest articles on Vue, TailwindCSS, and Node.js from Torkait Sukpramote.',
    type: 'website',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: baseTitle,
    },
  })
})

function onPageChange(p: number) {
  page.value = p
  router.replace({ query: { ...route.query, page: String(p) } })
}
</script>

<template>
  <section class="relative border-b border-ink-100 bg-gradient-to-br from-brand-50 to-white py-12">
    <div class="container">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="font-display text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            {{
              activeCategory
                ? `Category: ${activeCategory}`
                : activeTag
                  ? `Tag: ${activeTag}`
                  : 'Latest Posts'
            }}
          </h1>
          <p class="mt-2 max-w-2xl text-ink-600">
            Insights on Vue.js, TailwindCSS, Node.js, and building modern web apps.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink
            to="/category/Vue"
            class="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-700 shadow"
          >
            Explore Vue
          </RouterLink>
          <RouterLink
            to="/tag/tailwind"
            class="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white shadow-soft"
          >
            #tailwind
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <section class="container grid grid-cols-1 gap-8 py-10 md:grid-cols-12">
    <div class="md:col-span-8 lg:col-span-9">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <PostCard v-for="p in paged" :key="p.id" :post="p" />
      </div>

      <div class="mt-8">
        <Pagination :page="page" :page-size="pageSize" :total="total" @change="onPageChange" />
      </div>
    </div>

    <div class="md:col-span-4 lg:col-span-3">
      <Sidebar :active-category="activeCategory" :active-tag="activeTag" />
    </div>
  </section>
</template>
