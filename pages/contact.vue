<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold text-ink-900 mb-8">ติดต่อเรา</h1>
      
      <div class="bg-white rounded-xl border border-ink-100 p-8 shadow-sm">
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-ink-700 mb-2">
              ชื่อ *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-ink-700 mb-2">
              อีเมล *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
            />
          </div>
          
          <div>
            <label for="message" class="block text-sm font-medium text-ink-700 mb-2">
              ข้อความ *
            </label>
            <textarea
              id="message"
              v-model="form.message"
              rows="6"
              required
              class="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
            />
          </div>
          
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>
          
          <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-600 text-sm">ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด</p>
          </div>
          
          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-black/80 disabled:opacity-60 transition-colors"
          >
            {{ submitting ? 'กำลังส่ง...' : 'ส่งข้อความ' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'ติดต่อเรา • WhiteBikeVibes',
  ogTitle: 'ติดต่อเรา • WhiteBikeVibes',
  description: 'ติดต่อทีมงาน WhiteBikeVibes สำหรับคำถาม ข้อเสนอแนะ หรือความร่วมมือ',
  ogDescription: 'ติดต่อทีมงาน WhiteBikeVibes สำหรับคำถาม ข้อเสนอแนะ หรือความร่วมมือ',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const submitting = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

async function submitForm() {
  error.value = null
  success.value = false
  submitting.value = true
  
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form
    })
    
    success.value = true
    
    // Reset form
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (err: any) {
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการส่งข้อความ'
  } finally {
    submitting.value = false
  }
}
</script>
