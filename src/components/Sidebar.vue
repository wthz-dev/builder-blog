<script setup lang="ts">
import { computed } from 'vue'
import { useTaxonomy } from '@/composables/useTaxonomy'

const props = defineProps<{ activeCategory?: string | null; activeTag?: string | null }>()

const { categories, tags, loading, error } = useTaxonomy()
</script>

<template>
  <aside class="space-y-8">
    <section>
      <h4 class="mb-3 text-sm font-semibold text-ink-500">Categories</h4>
      <div v-if="loading" class="flex flex-wrap gap-2">
        <div v-for="n in 6" :key="n" class="h-7 w-20 animate-pulse rounded bg-ink-100"></div>
      </div>
      <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>
      <div v-else class="flex flex-wrap gap-2">
        <RouterLink
          v-for="c in categories"
          :key="c"
          :to="{ name: 'category', params: { slug: c } }"
          class="rounded-lg border px-3 py-1.5 text-sm"
          :class="
            props.activeCategory === c
              ? 'border-brand-300 bg-brand-50 text-brand-800'
              : 'border-ink-200 text-ink-700 hover:bg-ink-50'
          "
        >
          {{ c }}
        </RouterLink>
      </div>
    </section>

    <section>
      <h4 class="mb-3 text-sm font-semibold text-ink-500">Popular Tags</h4>
      <div v-if="loading" class="flex flex-wrap gap-2">
        <div v-for="n in 8" :key="n" class="h-6 w-16 animate-pulse rounded-full bg-ink-100"></div>
      </div>
      <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>
      <div v-else class="flex flex-wrap gap-2">
        <RouterLink
          v-for="t in tags"
          :key="t"
          :to="{ name: 'tag', params: { slug: t } }"
          class="rounded-full border px-3 py-1 text-xs"
          :class="
            props.activeTag === t
              ? 'border-brand-300 bg-brand-50 text-brand-800'
              : 'border-ink-200 text-ink-700 hover:bg-ink-50'
          "
        >
          #{{ t }}
        </RouterLink>
      </div>
    </section>
  </aside>
</template>

