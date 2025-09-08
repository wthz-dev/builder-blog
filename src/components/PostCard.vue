<script setup lang="ts">
import { computed } from 'vue'
import type { BlogPost } from '@/data/mockPosts'

const props = defineProps<{ post: BlogPost }>()

const formattedDate = computed(() =>
  new Date(props.post.publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }),
)
</script>

<template>
  <article
    class="group overflow-hidden rounded-xl border border-ink-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
  >
  <!-- <pre> {{ post }}</pre> -->
    <RouterLink :to="{ name: 'post', params: { slug: post.slug } }" class="block">
      <img v-if="post.coverImageUrl" :src="post.coverImageUrl" alt="Cover" class="aspect-[16/9] w-full rounded-lg object-cover" />
      <div v-else class="aspect-[16/9] w-full bg-gradient-to-br from-brand-100 to-brand-200"></div>
      <div class="space-y-3 p-5">
        <div class="flex items-center gap-2 text-xs text-ink-500">
          <span>{{ formattedDate }}</span>
          <span>•</span>
          <span class="inline-flex items-center gap-1">
            <span
              v-for="t in post.tags.slice(0, 2)"
              :key="t"
              class="rounded bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700"
              >#{{ t }}</span
            >
          </span>
        </div>
        <h3 class="line-clamp-2 text-lg font-semibold text-ink-900 group-hover:text-brand-700">
          {{ post.title }}
        </h3>
        <p class="line-clamp-2 text-sm text-ink-600">
          {{ post.excerpt }}
        </p>
      </div>
    </RouterLink>
  </article>
</template>
