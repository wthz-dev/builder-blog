<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { findPostBySlug } from '@/data/mockPosts'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const slug = route.params.slug as string
const post = computed(() => findPostBySlug(slug))

onMounted(() => {
  if (post.value) {
    useSeo({
      title: post.value.title,
      description: post.value.excerpt,
      type: 'article',
      datePublished: post.value.publishedAt,
      authorName: post.value.author,
      url: location.pathname,
    })
  }
})
</script>

<template>
  <section v-if="post" class="container py-10">
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

      <div class="mt-6 aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-ink-100 to-ink-50"></div>

      <div class="prose prose-slate mt-8 max-w-none">
        <div v-html="post.content" />
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
        <p class="mb-4 text-sm text-ink-600">Comments are for demo only (no backend yet).</p>
        <form class="grid gap-4 md:grid-cols-2">
          <input type="text" placeholder="Your name" class="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
          <input type="email" placeholder="Your email" class="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none" />
          <textarea placeholder="Write a comment..." class="md:col-span-2 min-h-28 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"></textarea>
          <div class="md:col-span-2">
            <button type="button" class="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800">Post comment</button>
          </div>
        </form>
      </section>
    </article>
  </section>

  <section v-else class="container py-16 text-center">
    <h1 class="text-2xl font-semibold">Post not found</h1>
    <RouterLink to="/" class="mt-4 inline-block rounded-lg border border-ink-200 px-3 py-2 text-sm hover:bg-ink-50">Back to Home</RouterLink>
  </section>
</template>
