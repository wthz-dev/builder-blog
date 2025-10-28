<template>
  <div>
    <div v-if="pending">
      <PostSkeleton />
      <div class="container mx-auto px-4 py-6">
        <div class="mx-auto max-w-3xl space-y-3">
          <CommentSkeleton v-for="i in 3" :key="`cs-${i}`" />
        </div>
      </div>
    </div>
    
    <div v-else-if="error" class="container mx-auto px-4 py-16 text-center">
      <h1 class="text-2xl font-semibold text-ink-900 mb-4">ไม่พบบทความ</h1>
      <p class="text-ink-600 mb-8">{{ error }}</p>
      <NuxtLink
        to="/"
        class="inline-block rounded-lg border border-ink-200 px-4 py-2 text-sm hover:bg-ink-50 transition-colors"
      >
        กลับหน้าแรก
      </NuxtLink>
    </div>
    
    <article v-else-if="post" class="container mx-auto px-4 py-10">
      <!-- Breadcrumb -->
      <nav class="mb-6 text-sm text-ink-500">
        <NuxtLink to="/" class="hover:text-ink-700">หน้าแรก</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-ink-700">{{ post.title }}</span>
      </nav>

      <div class="mx-auto max-w-3xl">
        <!-- Post Header -->
        <header class="mb-8">
          <h1 class="font-display text-3xl font-bold text-ink-900 md:text-4xl mb-4">
            {{ post.title }}
          </h1>
          
          <div class="flex flex-wrap items-center gap-2 text-sm text-ink-500 mb-6">
            <span>{{ formatDate(post.publishedAt) }}</span>
            <span>•</span>
            <span>โดย {{ post.author?.name }}</span>
            <span>•</span>
            <div class="flex flex-wrap gap-1">
              <NuxtLink
                v-for="category in post.categories"
                :key="category?.name"
                :to="`/category/${encodeURIComponent(category?.name)}`"
                class="rounded bg-brand-50 px-2 py-0.5 text-[12px] font-medium text-brand-800 hover:bg-brand-100 transition-colors"
              >
                {{ category.name }}
              </NuxtLink>
            </div>
          </div>
        </header>

        <!-- Cover Image -->
        <div class="mb-8">
          <NuxtImg
            v-if="post.coverImageUrl"
            :src="post.coverImageUrl"
            :alt="post.title"
            class="w-full rounded-lg object-cover aspect-[16/9]"
            loading="eager"
          />
          <div
            v-else
            class="aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-ink-100 to-ink-50"
          />
        </div>

        <!-- Ad: In-Article below header/cover -->
        <AdsenseInArticle v-if="post" ad-slot="4826236713" />

        <!-- Share Buttons -->
        <div class="mb-8 flex flex-wrap items-center gap-3">
          <button @click="shareNative" class="rounded-full bg-black text-white px-4 py-2 text-sm hover:bg-black/80">แชร์</button>
          <a :href="shareLinks.facebook" target="_blank" rel="noopener" class="rounded-full border border-ink-200 px-3 py-1 text-xs hover:bg-ink-50">Facebook</a>
          <a :href="shareLinks.twitter" target="_blank" rel="noopener" class="rounded-full border border-ink-200 px-3 py-1 text-xs hover:bg-ink-50">X</a>
          <a :href="shareLinks.line" target="_blank" rel="noopener" class="rounded-full border border-ink-200 px-3 py-1 text-xs hover:bg-ink-50">LINE</a>
          <a :href="shareLinks.linkedin" target="_blank" rel="noopener" class="rounded-full border border-ink-200 px-3 py-1 text-xs hover:bg-ink-50">LinkedIn</a>
          <button @click="copyLink" class="rounded-full border border-ink-200 px-3 py-1 text-xs hover:bg-ink-50">คัดลอกลิงก์</button>
        </div>

        <!-- Post Content -->
        <div class="prose prose-ink max-w-none mb-8" v-html="post.content" />

        <!-- Ad: Responsive below content -->
        <AdsenseResponsive v-if="post" ad-slot="4826236713" />

        <!-- Tags -->
        <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-12">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag?.name"
            :to="`/tag/${encodeURIComponent(tag?.name)}`"
            class="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-700 hover:bg-ink-50 transition-colors"
          >
            #{{ tag.name }}
          </NuxtLink>
        </div>

        <!-- Comments Section -->
        <section class="rounded-xl border border-ink-100 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-ink-900">ความคิดเห็น</h2>
          
          <!-- Existing Comments -->
          <div v-if="post.comments && post.comments.length > 0" class="mb-6 space-y-4">
            <div
              v-for="comment in post.comments"
              :key="comment.id"
              class="rounded-lg border border-ink-100 p-3"
            >
              <div class="mb-1 text-sm text-ink-500">
                <span class="font-medium text-ink-800">{{ comment.authorName }}</span>
                <span> • </span>
                <span>{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="text-ink-800">{{ comment.content }}</p>
            </div>
          </div>
          <!-- Comment Form -->
          <div v-if="!user" class="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-amber-800">
            กรุณา <NuxtLink to="/login" class="underline hover:text-amber-900">เข้าสู่ระบบ</NuxtLink> เพื่อแสดงความคิดเห็น
          </div>
          
          <form v-else class="grid gap-4" @submit.prevent="submitComment">
            <p class="text-sm text-ink-600">กำลังแสดงความคิดเห็นในนาม <span class="font-medium text-ink-800">{{ user?.name }}</span></p>
            <textarea
              v-model.trim="commentContent"
              placeholder="เขียนความคิดเห็น..."
              class="min-h-28 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
              required
            />
            
            <div>
              <p v-if="commentError" class="mb-2 text-sm text-red-600">{{ commentError }}</p>
              <button
                type="submit"
                :disabled="submittingComment || !(commentContent && commentContent.length > 0)"
                class="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-60 transition-colors"
              >
                {{ submittingComment ? 'กำลังส่ง...' : 'ส่งความคิดเห็น' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </article>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { usePageBlocker } from '@/composables/usePageBlocker'
const { user, logout } = useAuth()
const route = useRoute()
const slug = route.params.slug as string
const runtime = useRuntimeConfig()

// Fetch post data (no top-level await to satisfy TS linter)
const { data: post, pending, error } = useFetch(`/api/posts/${slug}`, {
  key: `post-${slug}`
})

// Define canonicalUrl and absoluteCoverImage BEFORE using in useSeoMeta/useHead
const canonicalUrl = computed(() => {
  const siteUrl = (runtime.public as any)?.siteUrl || ''
  return `${siteUrl}/post/${encodeURIComponent(slug)}`
})
const absoluteCoverImage = computed(() => {
  const siteUrl = (runtime.public as any)?.siteUrl || ''
  const url = post.value?.coverImageUrl || '/og-image.jpg'
  if (!url) return ''
  return /^https?:\/\//.test(url) ? url : `${siteUrl}${url}`
})

// SEO Meta - Dynamic based on post data
useSeoMeta({
  title: () => post.value?.title || 'กำลังโหลด...',
  description: () => post.value?.excerpt || '',
  ogTitle: () => post.value?.title || '',
  ogDescription: () => post.value?.excerpt || '',
  ogImage: () => post.value?.coverImageUrl || '/og-image.jpg',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
  twitterSite: () => (runtime.public as any)?.twitterSite || '@whitebikevibes',
  twitterCreator: () => (runtime.public as any)?.twitterCreator || '@whitebikevibes'
})

// Temporarily remove useHead scripts to prevent dispose error
// TODO: Find alternative solution for JSON-LD and canonical
// useHead(() => ({
//   link: [
//     { rel: 'canonical', href: canonicalUrl.value }
//   ],
//   script: [
//     ...(postSchema.value ? [{
//       type: 'application/ld+json',
//       innerHTML: postSchema.value
//     }] : []),
//     ...(postBreadcrumbSchema.value ? [{
//       type: 'application/ld+json', 
//       innerHTML: postBreadcrumbSchema.value
//     }] : [])
//   ]
// }))

// Add canonical link and JSON-LD directly in template
const postSchema = computed(() => {
  if (!post.value) return ''
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.value.title,
    description: post.value.excerpt,
    image: absoluteCoverImage.value,
    datePublished: post.value.publishedAt,
    dateModified: post.value.publishedAt,
    author: {
      '@type': 'Person',
      name: post.value.author?.name || post.value.author || 'Author'
    },
    publisher: {
      '@type': 'Organization',
      name: 'WhiteBikeVibes',
      logo: { '@type': 'ImageObject', url: (runtime.public as any)?.siteUrl ? `${(runtime.public as any).siteUrl}/og-image.jpg` : '/og-image.jpg' }
    }
  })
})

const postBreadcrumbSchema = computed(() => {
  if (!post.value) return ''
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: (runtime.public as any)?.siteUrl || '/' },
      { '@type': 'ListItem', position: 2, name: post.value.title, item: canonicalUrl.value }
    ]
  })
})

// Submit comment
const { show, hide } = usePageBlocker()

async function submitComment() {
  if (!post.value || !user) return
  
  commentError.value = null
  submittingComment.value = true
  
  try {
    const res: any = await $fetch('/api/comments', {
      method: 'POST',
      body: {
        postId: post.value.id,
        content: commentContent.value
      },
      credentials: 'include'
    })
    // If offline queued (from SW), show PageBlocker and skip immediate refresh
    if (res && res.queued) {
      show({ mode: 'offline-queued', message: 'คอมเมนต์ถูกเข้าคิวออฟไลน์ จะส่งอัตโนมัติเมื่อกลับมาออนไลน์', dismissible: true })
      trackEvent('comment_submit_queued', { slug })
    } else {
      commentContent.value = ''
      await refreshNuxtData(`post-${slug}`)
      trackEvent('comment_submit_success', { slug })
    }
  } catch (err: any) {
    commentError.value = err?.data?.message || err?.message || 'เกิดข้อผิดพลาดในการส่งความคิดเห็น'
    trackEvent('comment_submit_error', { slug, message: commentError.value })
  } finally {
    submittingComment.value = false
  }
}

// Utility function
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Share helpers
const commentContent = ref('')
const commentError = ref<string | null>(null)
const submittingComment = ref(false)
const shareTitle = computed(() => post.value?.title || 'WhiteBikeVibes')
const shareText = computed(() => post.value?.excerpt || post.value?.title || 'WhiteBikeVibes')

const shareLinks = computed(() => {
  if (!canonicalUrl.value || !shareTitle.value) return { facebook: '', twitter: '', line: '', linkedin: '' }
  const url = encodeURIComponent(canonicalUrl.value)
  const text = encodeURIComponent(shareTitle.value)
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    line: `https://line.me/R/msg/text/?${text}%20${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
  }
})

const { trackEvent } = useGtag()
// Listen service worker messages to hide blocker when sync finished
function onSwMessage(e: MessageEvent) {
  if (!e?.data) return
  if (e.data.type === 'comments-synced') {
    hide()
    // Optional: refresh to show new comment
    refreshNuxtData(`post-${slug}`)
  }
}
onMounted(() => {
  if (process.client && 'serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', onSwMessage)
  }
})
onBeforeUnmount(() => {
  if (process.client && 'serviceWorker' in navigator) {
    navigator.serviceWorker.removeEventListener('message', onSwMessage)
  }
})
async function shareNative() {
  if (!process.client) return
  try {
    if (navigator.share) {
      await navigator.share({ 
        title: shareTitle.value || 'WhiteBikeVibes', 
        text: shareText.value || 'WhiteBikeVibes', 
        url: canonicalUrl.value || '' 
      })
      trackEvent('share', { provider: 'web_share', slug })
    } else {
      if (shareLinks.value.facebook) {
        window.open(shareLinks.value.facebook, '_blank')
      }
      trackEvent('share', { provider: 'facebook_fallback', slug })
    }
  } catch {}
}

async function copyLink() {
  if (!process.client) return
  try {
    if (canonicalUrl.value) {
      await navigator.clipboard.writeText(canonicalUrl.value)
    }
    trackEvent('share', { provider: 'copy_link', slug })
    // Optional: toast
  } catch {}
}
</script>
