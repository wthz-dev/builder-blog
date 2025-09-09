<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { usePosts } from '@/composables/usePosts'
import { useComments } from '@/composables/useComments'
import { useAuth } from '@/composables/useAuth'
import PostSkeleton from '@/components/PostSkeleton.vue'

const route = useRoute()
const slug = route.params.slug as string
const { get } = usePosts()
const { create } = useComments()
const { user } = useAuth()

const post = ref<any | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const comment = ref('')
const sending = ref(false)
const sendError = ref<string | null>(null)


onMounted(async () => {
  try {
    const data = await get(slug)
    post.value = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImageUrl: data.coverImageUrl,
      categories: (data.categories || []).map((c: any) => c.category?.name).filter(Boolean),
      tags: (data.tags || []).map((t: any) => t.tag?.name).filter(Boolean),
      author: data.author?.name || 'Unknown',
      publishedAt: data.publishedAt,
      comments: (data.comments || []).map((cm: any) => ({
        id: cm.id,
        content: cm.content,
        createdAt: cm.createdAt,
        authorName: cm.author?.name || 'Anonymous',
      })),
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load post'
  } finally {
    loading.value = false
  }
})

// ใช้ useHead (reactive) เพื่ออัปเดตหัวเว็บและ meta อัตโนมัติเมื่อ post เปลี่ยน
useHead(() => {
  const siteName = 'Torkait'
  const baseTitle = 'Torkait — Personal Tech Blog'
  const p = post.value
  const title = p ? `${p.title} • ${siteName}` : loading.value ? 'Loading…' : error.value ? 'Post not found' : baseTitle
  const desc = p?.excerpt || 'A modern personal blog built with Vue.js and TailwindCSS'
  const url = typeof location !== 'undefined' ? location.href : ''
  const image = p?.coverImageUrl
  return {
    title,
    meta: [
      { name: 'description', content: desc },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      ...(image ? [{ property: 'og:image', content: image }] : []),
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: desc },
      ...(image ? [{ name: 'twitter:image', content: image }] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
  }
})

async function submitComment() {
  if (!post.value) return
  sendError.value = null
  sending.value = true
  try {
    await create({ postId: post.value.id, content: comment.value })
    comment.value = ''
    // Reload post to refresh comments list
    const data = await get(slug)
    post.value = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      categories: (data.categories || []).map((c: any) => c.category?.name).filter(Boolean),
      tags: (data.tags || []).map((t: any) => t.tag?.name).filter(Boolean),
      author: data.author?.name || 'Unknown',
      publishedAt: data.publishedAt,
      comments: (data.comments || []).map((cm: any) => ({
        id: cm.id,
        content: cm.content,
        createdAt: cm.createdAt,
        authorName: cm.author?.name || 'Anonymous',
      })),
    }
  } catch (e: any) {
    sendError.value = e?.message || 'Failed to post comment'
  } finally {
    sending.value = false
  }
}

const hasUser = computed(() => !!user.value)

</script>

<template>
  <section v-if="!loading && post" class="container py-10">
    <nav class="mb-6 text-sm text-ink-500">
      <RouterLink to="/" class="hover:text-ink-700">Home</RouterLink>
      <span class="mx-2">/</span>
      <span class="text-ink-700">{{ post.title }}</span>
    </nav>

    <article class="mx-auto max-w-3xl">
      <h1 class="font-display text-3xl font-bold text-ink-900 md:text-4xl">{{ post.title }}</h1>
      <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-500">
        <span>{{ new Date(post.publishedAt).toLocaleDateString() }}</span>
        <span>•</span>
        <span class="inline-flex items-center gap-1">
          <RouterLink
            v-for="c in post.categories"
            :key="c"
            :to="{ name: 'category', params: { slug: c } }"
            class="rounded bg-brand-50 px-2 py-0.5 text-[12px] font-medium text-brand-800"
          >
            {{ c }}
          </RouterLink>
        </span>
      </div>

      <div class="prose prose-ink max-w-none">
        <img v-if="post.coverImageUrl" :src="post.coverImageUrl" alt="Cover" class="mb-6 w-full rounded-lg object-cover" />
        <div v-else
        class="mt-6 aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-ink-100 to-ink-50"
      ></div>
        <div v-html="post.content"></div>
      </div>

      <div class="mt-8 flex flex-wrap gap-2">
        <RouterLink
          v-for="t in post.tags"
          :key="t"
          :to="{ name: 'tag', params: { slug: t } }"
          class="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-700 hover:bg-ink-50"
        >
          #{{ t }}
        </RouterLink>
      </div>

      <section class="mt-12 rounded-xl border border-ink-100 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold text-ink-900">Comments</h2>
        <div v-if="post.comments && post.comments.length" class="mb-6 space-y-4">
          <div v-for="c in post.comments" :key="c.id" class="rounded-lg border border-ink-100 p-3">
            <div class="mb-1 text-sm text-ink-500">
              <span class="font-medium text-ink-800">{{ c.authorName }}</span>
              <span> • </span>
              <span>{{ new Date(c.createdAt).toLocaleString() }}</span>
            </div>
            <p class="text-ink-800">{{ c.content }}</p>
          </div>
        </div>
        <div v-if="!hasUser" class="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-amber-800">
          Please <RouterLink to="/login" class="underline">sign in</RouterLink> to post a comment.
        </div>
        <form v-else class="grid gap-4 md:grid-cols-2" @submit.prevent="submitComment">
          <textarea
            v-model="comment"
            placeholder="Write a comment..."
            class="md:col-span-2 min-h-28 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
          ></textarea>
          <div class="md:col-span-2">
            <p v-if="sendError" class="mb-2 text-sm text-red-600">{{ sendError }}</p>
            <button
              type="submit"
              :disabled="sending || !comment"
              class="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
            >
              {{ sending ? 'Posting...' : 'Post comment' }}
            </button>
          </div>
        </form>
      </section>
    </article>
  </section>

  <PostSkeleton v-else-if="loading" />

  <section v-else class="container py-16 text-center">
    <h1 class="text-2xl font-semibold">{{ error || 'Post not found' }}</h1>
    <RouterLink
      to="/"
      class="mt-4 inline-block rounded-lg border border-ink-200 px-3 py-2 text-sm hover:bg-ink-50"
      >Back to Home</RouterLink
    >
  </section>
</template>
