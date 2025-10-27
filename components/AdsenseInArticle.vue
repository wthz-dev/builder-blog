<template>
  <div v-if="enabled" class="my-6">
    <ins
      class="adsbygoogle"
      style="display:block; text-align:center;"
      data-ad-format="fluid"
      data-ad-layout="in-article"
      :data-ad-client="publisherId"
      :data-ad-slot="adSlot"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRuntimeConfig } from '#imports'

const props = defineProps<{ adSlot: string }>()
const runtime = useRuntimeConfig()
const publisherId = (runtime.public?.adsensePublisherId as string | undefined) || ''
const enabled = ref(!!publisherId)

onMounted(() => {
  if (!enabled.value) return
  // @ts-ignore
  ;(window.adsbygoogle = window.adsbygoogle || []).push({})
})

watch(
  () => props.adSlot,
  () => {
    if (!enabled.value) return
    // @ts-ignore
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }
)
</script>
