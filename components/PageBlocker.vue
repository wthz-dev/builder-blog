<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="state.visible" class="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" @click.self="onBackdropClick">
        <div class="w-full max-w-md rounded-2xl bg-white text-ink-900 shadow-xl border border-ink-100 p-5">
          <div class="flex items-start gap-3">
            <span class="mt-1 h-5 w-5 shrink-0 rounded-full bg-ink-200 animate-pulse" v-if="state.mode==='loading'" />
            <span class="mt-1 h-5 w-5 shrink-0 rounded-full bg-amber-200" v-else-if="state.mode==='offline' || state.mode==='offline-queued'" />
            <span class="mt-1 h-5 w-5 shrink-0 rounded-full bg-brand-200" v-else-if="state.mode==='update' || state.mode==='a2hs'" />
            <span class="mt-1 h-5 w-5 shrink-0 rounded-full bg-green-200" v-else-if="state.mode==='success'" />
            <span class="mt-1 h-5 w-5 shrink-0 rounded-full bg-red-200" v-else-if="state.mode==='error'" />
            <div class="grow">
              <h3 class="text-base font-semibold mb-1">{{ title }}</h3>
              <p class="text-sm text-ink-600">{{ state.message }}</p>
              <div v-if="actions && actions.length" class="mt-4 flex flex-wrap gap-2">
                <button
                  v-for="(a,i) in actions"
                  :key="i"
                  class="px-3 py-1.5 text-sm rounded-lg border border-ink-200 hover:bg-ink-50"
                  @click="a.onClick"
                >{{ a.label }}</button>
              </div>
            </div>
            <button v-if="state.dismissible" class="ml-2 p-2 rounded-md hover:bg-ink-50" @click="hide" aria-label="Close">✕</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { usePageBlocker } from '@/composables/usePageBlocker'
const { state, hide } = usePageBlocker()
const title = computed(() => {
  switch (state.value.mode) {
    case 'loading': return 'กำลังดำเนินการ'
    case 'offline': return 'ออฟไลน์'
    case 'offline-queued': return 'เข้าคิวแบบออฟไลน์'
    case 'update': return 'มีเวอร์ชันใหม่'
    case 'a2hs': return 'ติดตั้งแอปบนหน้าจอหลัก'
    case 'success': return 'สำเร็จ'
    case 'error': return 'เกิดข้อผิดพลาด'
    default: return 'แจ้งเตือน'
  }
})
const actions = computed(() => state.value.actions || [])
function onBackdropClick() { if (state.value.dismissible) hide() }
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity: 0 }
</style>
