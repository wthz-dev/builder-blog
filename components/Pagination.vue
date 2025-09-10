<template>
  <nav class="flex justify-center items-center space-x-2" aria-label="Pagination">
    <!-- Previous Button -->
    <NuxtLink
      v-if="currentPage > 1"
      :to="{ query: { ...route.query, page: currentPage - 1 } }"
      class="px-3 py-2 text-sm font-medium text-ink-600 bg-white border border-ink-200 rounded-lg hover:bg-ink-50 hover:text-ink-900 transition-colors"
    >
      ก่อนหน้า
    </NuxtLink>
    <span
      v-else
      class="px-3 py-2 text-sm font-medium text-ink-400 bg-ink-50 border border-ink-200 rounded-lg cursor-not-allowed"
    >
      ก่อนหน้า
    </span>

    <!-- Page Numbers -->
    <template v-for="page in visiblePages" :key="page">
      <NuxtLink
        v-if="page !== currentPage"
        :to="{ query: { ...route.query, page } }"
        class="px-3 py-2 text-sm font-medium text-ink-600 bg-white border border-ink-200 rounded-lg hover:bg-ink-50 hover:text-ink-900 transition-colors"
      >
        {{ page }}
      </NuxtLink>
      <span
        v-else
        class="px-3 py-2 text-sm font-medium text-white bg-brand-600 border border-brand-600 rounded-lg"
      >
        {{ page }}
      </span>
    </template>

    <!-- Next Button -->
    <NuxtLink
      v-if="currentPage < totalPages"
      :to="{ query: { ...route.query, page: currentPage + 1 } }"
      class="px-3 py-2 text-sm font-medium text-ink-600 bg-white border border-ink-200 rounded-lg hover:bg-ink-50 hover:text-ink-900 transition-colors"
    >
      ถัดไป
    </NuxtLink>
    <span
      v-else
      class="px-3 py-2 text-sm font-medium text-ink-400 bg-ink-50 border border-ink-200 rounded-lg cursor-not-allowed"
    >
      ถัดไป
    </span>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()
const route = useRoute()

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, props.currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>
