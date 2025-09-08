<script setup lang="ts">
import { computed } from 'vue'
import { allCategories, allTags } from '@/data/mockPosts'

const props = defineProps<{ activeCategory?: string | null; activeTag?: string | null }>()

const categories = computed(() => allCategories())
const tags = computed(() => allTags())
</script>

<template>
  <aside class="space-y-8">
    <section>
      <h4 class="mb-3 text-sm font-semibold text-ink-500">Categories</h4>
      <div class="flex flex-wrap gap-2">
        <RouterLink
          v-for="c in categories"
          :key="c"
          :to="{ name: 'category', params: { slug: c } }"
          class="rounded-lg border px-3 py-1.5 text-sm"
          :class="props.activeCategory === c ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-ink-200 text-ink-700 hover:bg-ink-50'"
        >
          {{ c }}
        </RouterLink>
      </div>
    </section>

    <section>
      <h4 class="mb-3 text-sm font-semibold text-ink-500">Popular Tags</h4>
      <div class="flex flex-wrap gap-2">
        <RouterLink
          v-for="t in tags"
          :key="t"
          :to="{ name: 'tag', params: { slug: t } }"
          class="rounded-full border px-3 py-1 text-xs"
          :class="props.activeTag === t ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-ink-200 text-ink-700 hover:bg-ink-50'"
        >
          #{{ t }}
        </RouterLink>
      </div>
    </section>
  </aside>
</template>
