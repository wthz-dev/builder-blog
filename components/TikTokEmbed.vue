<template>
  <div class="w-full flex justify-center">
    <blockquote
      class="tiktok-embed"
      :cite="`https://www.tiktok.com/@${username}/video/${videoId}`"
      :data-video-id="videoId"
      :style="styleAttr"
      :key="videoId"
    >
      <section>
        <a :href="`https://www.tiktok.com/@${username}?refer=embed`" target="_blank" :title="`@${username}`">@{{ username }}</a>
      </section>
    </blockquote>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'

const props = defineProps({
  videoId: { type: String, required: true },
  username: { type: String, default: 'whitez52' },
  maxWidth: { type: Number, default: 605 },
  minWidth: { type: Number, default: 325 }
})

const styleAttr = computed(() => `max-width: ${props.maxWidth}px; min-width: ${props.minWidth}px;`)

function ensureTikTokScript() {
  if (typeof window === 'undefined') return
  const id = 'tiktok-embed-js'
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.async = true
  s.src = 'https://www.tiktok.com/embed.js'
  document.body.appendChild(s)
}

onMounted(() => {
  ensureTikTokScript()
})

watch(() => props.videoId, () => {
  // Re-ensure script for safety when video changes
  ensureTikTokScript()
})
</script>

<style scoped>
/* optional: center container */
</style>
