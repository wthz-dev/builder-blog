<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; pageSize: number; total: number }>()
const emit = defineEmits<{ change: [number] }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

function go(p: number) {
  if (p < 1 || p > totalPages.value) return
  emit('change', p)
}
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <button
      class="rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-50"
      @click="go(props.page - 1)"
    >
      Prev
    </button>
    <template v-for="p in totalPages" :key="p">
      <button
        class="rounded-lg px-3 py-1.5 text-sm"
        :class="
          p === props.page
            ? 'bg-ink-900 text-white'
            : 'border border-ink-200 text-ink-700 hover:bg-ink-50'
        "
        @click="go(p as number)"
      >
        {{ p }}
      </button>
    </template>
    <button
      class="rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-50"
      @click="go(props.page + 1)"
    >
      Next
    </button>
  </div>
</template>
