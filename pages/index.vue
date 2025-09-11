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
         class="px-6 py-3 bg-white text-ink-900 rounded-lg font-semibold hover:bg-ink-100 transition"
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
            class="rounded-full px-4 py-2 text-sm bg-black font-semibold text-white shadow-soft"
          >
            #{{ popularTags[0].name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="container mx-auto px-4 pb-16 pt-6">
    <div class="rounded-2xl border border-ink-100 p-8 bg-gradient-to-br from-ink-50 to-white flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h3 class="text-2xl font-bold text-ink-900">ติดตาม WhiteBikeVibes</h3>
        <p class="text-ink-600 mt-1">อย่าพลาดโพสต์ใหม่ๆ ทั้งสายขี่และสายโค้ด</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <a href="https://www.tiktok.com/@whitez52" target="_blank" class="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold">TikTok</a>
        <a :href="`https://twitter.com/intent/follow?screen_name=whitez52`" target="_blank" class="px-4 py-2 rounded-full border border-ink-200 text-sm">X</a>
        <a href="https://line.me/ti/p/~whitez52" target="_blank" class="px-4 py-2 rounded-full border border-ink-200 text-sm">LINE</a>
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
        <div v-if="catsPending" class="flex flex-wrap gap-3">
          <ChipSkeleton v-for="i in 8" :key="`cat-s-${i}`" />
        </div>
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
        <div v-if="tagsPending" class="flex flex-wrap gap-2">
          <ChipSkeleton v-for="i in 12" :key="`tag-s-${i}`" />
        </div>
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

      <!-- Close grid container -->
    </div>

      <!-- Featured Post -->
      <div v-if="featuredPost" class="mt-8">
        <h2 class="text-xl font-semibold text-ink-900 mb-4">แนะนำสำหรับคุณ</h2>
        <NuxtLink :to="`/post/${encodeURIComponent(featuredPost.slug)}`" class="block rounded-2xl overflow-hidden border border-ink-100 bg-white hover:shadow-soft transition">
          <div class="relative aspect-[16/7] bg-ink-50">
            <NuxtImg v-if="featuredPost.coverImageUrl" :src="featuredPost.coverImageUrl" :alt="featuredPost.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div class="flex flex-wrap gap-2 mb-2">
                <span v-for="c in featuredPost.categories" :key="c.name" class="bg-white/20 backdrop-blur px-2 py-0.5 rounded text-xs">{{ c.name }}</span>
              </div>
              <h3 class="text-2xl md:text-3xl font-bold leading-snug">{{ featuredPost.title }}</h3>
              <p class="mt-2 text-sm text-white/90 line-clamp-2">{{ featuredPost.excerpt }}</p>
              <div class="mt-3 text-xs text-white/80 flex items-center gap-3">
                <span>{{ formatDate(featuredPost.publishedAt) }}</span>
                <span>•</span>
                <span>{{ featuredPost.author?.name }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>
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
      
      <div v-else-if="filteredPosts && filteredPosts.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="post in filteredPosts"
            :key="post.id"
            class="bg-white rounded-xl border border-ink-100 overflow-hidden hover:shadow-soft transition-shadow duration-300"
          >
            <NuxtLink :to="`/post/${encodeURIComponent(post.slug)}`">
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
        <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" class="mt-12" />
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
const runtime = useRuntimeConfig()
const siteUrl = (runtime.public as any)?.siteUrl || ''
const canonicalUrl = computed(() => `${siteUrl}/`)
const ogImage = computed(() => `${siteUrl}/og-image.jpg`)

useSeoMeta({
  title: 'WhiteBikeVibes | Bigbike + Dev Lifestyle',
  ogTitle: 'WhiteBikeVibes | Bigbike + Dev Lifestyle',
  description: 'WhiteBikeVibes | Bigbike + Dev Lifestyle',
  ogDescription: 'WhiteBikeVibes | Bigbike + Dev Lifestyle',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => ogImage.value,
  twitterCard: 'summary_large_image',
  twitterImage: () => ogImage.value,
})

useHead({ link: [{ rel: 'canonical', href: canonicalUrl.value }] })

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

// Fetch posts or search results
const hasQueryQ = computed(() => !!(route.query.q as string))
const endpoint = computed(() => (hasQueryQ.value ? '/api/search' : '/api/posts'))
const fetchQuery = computed(() => {
  if (hasQueryQ.value) {
    return { q: route.query.q as string, page: currentPage.value }
  }
  return { page: currentPage.value, category: categorySlug.value, tag: tagSlug.value }
})
const { data: postsData, pending, error } = await useFetch(endpoint, {
  query: fetchQuery,
  key: () => (hasQueryQ.value ? `search-${route.query.q}-${currentPage.value}` : `posts-${currentPage.value}-${categorySlug.value || ''}-${tagSlug.value || ''}`)
})

const posts = computed(() => postsData?.value?.posts || [])
const totalPages = computed(() => postsData?.value?.totalPages || 1)

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

// Quick filters state
const searchTerm = ref<string>((route.query.q as string) || '')
const filterCategory = ref('')
const filterTag = ref('')

watch(() => route.query.q, (q) => {
  searchTerm.value = (q as string) || ''
})

// Featured and filtered posts
const featuredPost = computed(() => {
  // From original posts list (already server-sorted by publishedAt desc)
  const list = posts.value || []
  if (list.length === 0) return null
  // If filters applied, pick first that matches search/category/tag
  const firstMatch = list.find(p => {
    const passSearch = !searchTerm.value || (p.title || '').toLowerCase().includes(searchTerm.value.toLowerCase())
    const passCat = !filterCategory.value || (p.categories || []).some((c:any) => c?.name === filterCategory.value)
    const passTag = !filterTag.value || (p.tags || []).some((t:any) => t?.name === filterTag.value)
    return passSearch && passCat && passTag
  })
  return firstMatch || list[0]
})

const filteredPosts = computed(() => {
  const list = (posts.value || []).filter(p => p.id !== featuredPost.value?.id)
  return list.filter((p:any) => {
    const passSearch = !searchTerm.value || (p.title || '').toLowerCase().includes(searchTerm.value.toLowerCase())
    const passCat = !filterCategory.value || (p.categories || []).some((c:any) => c?.name === filterCategory.value)
    const passTag = !filterTag.value || (p.tags || []).some((t:any) => t?.name === filterTag.value)
    return passSearch && passCat && passTag
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
