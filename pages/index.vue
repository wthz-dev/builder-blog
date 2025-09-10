<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-cover bg-center h-[90vh]" style="background-image: url('/IMG_1521.jpg')">
  <div class="absolute inset-0 bg-black/50"></div>
  <div class="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
    <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight">
      WhiteBikeVibes
    </h1>
    <p class="mt-4 text-lg md:text-2xl max-w-2xl">
      Bigbike + Dev Lifestyle
    </p>
    <div class="mt-6 flex gap-4">
      <a href="https://www.tiktok.com/@whitez52"
         class="px-6 py-3 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition"
         @click="onHeroTiktokClick"
      >
         ▶ Watch on TikTok
      </a>
      <a href="/tag/blog"
         class="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
         @click="onReadBlogClick"
      >
         ✍ Read the Blog
      </a>
    </div>
  </div>
</section>

<section class="relative border-b border-ink-100 bg-gradient-to-br from-brand-50 to-white container mx-auto px-4 py-12">
    <div class="container">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="font-display text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            {{
              activeCategory
                ? `Category: ${activeCategory}`
                : activeTag
                  ? `Tag: ${activeTag}`
                  : 'Latest Rides & Codes 🚀'
            }}
          </h1>
          <p class="mt-2 max-w-2xl text-ink-600">
            Life on the road and the repo
          </p>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            v-if="categories && categories.length > 0"
            :to="`/category/${encodeURIComponent(categories[0].name)}`"
            class="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-700 shadow"
          >
            Explore {{ categories[0].name }}
          </NuxtLink>
          <NuxtLink
            v-if="popularTags && popularTags.length > 0"
            :to="`/tag/${encodeURIComponent(popularTags[0].name)}`"
            class="rounded-full bg-ink-900 px-4 py-2 text-sm bg-black font-semibold text-white shadow-soft"
          >
            #{{ popularTags[0].name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>

  <!-- Categories & Tags + AdSense -->
  <section class="container mx-auto px-4 py-10">
    <AdsenseBanner />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <!-- Categories -->
      <div class="lg:col-span-2 bg-white border border-ink-100 rounded-xl p-6">
        <h2 class="text-xl font-semibold text-ink-900 mb-4">หมวดหมู่ (Categories)</h2>
        <div v-if="catsPending" class="text-ink-600">กำลังโหลดหมวดหมู่...</div>
        <div v-else class="flex flex-wrap gap-3">
          <NuxtLink
            v-for="c in categories"
            :key="c.id"
            :to="`/category/${encodeURIComponent(c.name)}`"
            class="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
          >
            <span>{{ c.name }}</span>
            <span class="text-ink-500">({{ c.count }})</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Popular Tags -->
      <div class="bg-white border border-ink-100 rounded-xl p-6">
        <h2 class="text-xl font-semibold text-ink-900 mb-4">แท็กยอดนิยม (Popular Tags)</h2>
        <div v-if="tagsPending" class="text-ink-600">กำลังโหลดแท็ก...</div>
        <div v-else class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="t in popularTags"
            :key="t.id"
            :to="`/tag/${encodeURIComponent(t.name)}`"
            class="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-800 hover:bg-ink-200"
            :title="`${t.name} (${t.count})`"
          >
            #{{ t.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>

    <!-- Posts Section -->
    <section class="container mx-auto px-4 py-16">
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PostSkeleton v-for="i in 6" :key="i" />
      </div>
      
      <div v-else-if="error" class="text-center py-16">
        <h2 class="text-2xl font-semibold text-ink-900 mb-4">เกิดข้อผิดพลาด</h2>
        <p class="text-ink-600">{{ error }}</p>
      </div>
      
      <div v-else-if="posts && posts.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="post in posts"
            :key="post.id"
            class="bg-white rounded-xl border border-ink-100 overflow-hidden hover:shadow-soft transition-shadow duration-300"
          >
            <NuxtLink :to="`/post/${post.slug}`">
              <div class="aspect-[16/9] bg-gradient-to-br from-ink-100 to-ink-50 relative overflow-hidden">
                <NuxtImg
                  v-if="post.coverImageUrl"
                  :src="post.coverImageUrl"
                  :alt="post.title"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              <div class="p-6">
                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="category in post.categories"
                    :key="category.id || category.name"
                    class="inline-block bg-brand-50 text-brand-800 text-xs font-medium px-2 py-1 rounded"
                  >
                    {{ category.name }}
                  </span>
                </div>
                
                <h2 class="text-xl font-semibold text-ink-900 mb-2 line-clamp-2">
                  {{ post.title }}
                </h2>
                
                <p class="text-ink-600 text-sm mb-4 line-clamp-3">
                  {{ post.excerpt }}
                </p>
                
                <div class="flex items-center justify-between text-xs text-ink-500">
                  <span>{{ formatDate(post.publishedAt) }}</span>
                  <span>{{ post.author?.name }}</span>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
        
        <!-- Pagination -->
        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          class="mt-12"
        />
      </div>
      
      <div v-else class="text-center py-16">
        <h2 class="text-2xl font-semibold text-ink-900 mb-4">ไม่พบบทความ</h2>
        <p class="text-ink-600">ยังไม่มีบทความในขณะนี้</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'WhiteBikeVibes | Bigbike + Dev Lifestyle',
  ogTitle: 'WhiteBikeVibes | Bigbike + Dev Lifestyle',
  description: 'WhiteBikeVibes | Bigbike + Dev Lifestyle',
  ogDescription: 'WhiteBikeVibes | Bigbike + Dev Lifestyle',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})

// Analytics helpers
const { click: gClick } = useGtag()
const onHeroTiktokClick = () => gClick('hero_tiktok', { section: 'hero' })
const onReadBlogClick = () => gClick('read_blog', { section: 'hero' })

// Get route and states for header/filter
const route = useRoute()
const currentPage = computed(() => parseInt(route.query.page as string) || 1)
// For home header display (optional quick context)
const activeCategory = computed(() => (route.query.category as string) || null)
const activeTag = computed(() => (route.query.tag as string) || null)
// Keep compatibility with API query params
const categorySlug = computed(() => route.query.category as string)
const tagSlug = computed(() => route.query.tag as string)

// Fetch posts
const { data: postsData, pending, error } = await useFetch('/api/posts', {
  query: {
    page: currentPage,
    category: categorySlug,
    tag: tagSlug
  },
  key: 'posts'
})

const posts = computed(() => postsData.value?.posts || [])
const totalPages = computed(() => postsData.value?.totalPages || 1)

// Fetch categories & tags for sidebar blocks
const { data: catsData, pending: catsPending } = await useFetch('/api/categories', { key: 'categories' })
const categories = computed(() => catsData.value?.categories || [])

const { data: tagsData, pending: tagsPending } = await useFetch('/api/tags', { key: 'tags' })
const popularTags = computed(() => {
  const list = (tagsData.value?.tags || []) as Array<{ id: string; name: string; count: number }>
  return [...list].sort((a, b) => b.count - a.count).slice(0, 20)
})

// Utility function
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
