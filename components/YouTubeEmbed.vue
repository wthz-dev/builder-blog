<template>
  <div class="w-full">
    <div class="relative w-full overflow-hidden rounded-2xl border border-ink-100 bg-black" :style="wrapperStyle">
      <iframe
        class="absolute inset-0 w-full h-full"
        :src="embedSrc"
        :title="title || 'YouTube video player'"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  videoId: { type: String, required: true },
  title: { type: String, default: '' },
  // aspect ratio width/height, default 16/9
  aspectW: { type: Number, default: 16 },
  aspectH: { type: Number, default: 9 }
})

const embedSrc = computed(() => `https://www.youtube-nocookie.com/embed/${props.videoId}?rel=0&modestbranding=1`)
const wrapperStyle = computed(() => `padding-top: ${(props.aspectH / props.aspectW) * 100}%;`)
</script>

<style scoped>
</style>
