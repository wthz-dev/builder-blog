<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-xl border border-ink-100 p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-ink-900 mb-6 text-center">เข้าสู่ระบบ</h1>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-ink-700 mb-2">
              อีเมล
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
            <label for="password" class="block text-sm font-medium text-ink-700 mb-2">
              รหัสผ่าน
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
            />
          </div>
          
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>
          
          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-black/80 transition-colors shadow-lg border-2 border-black disabled:bg-black/80 disabled:text-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>
        
        <div class="mt-6">
          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-ink-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-ink-500">หรือ</span>
            </div>
          </div>
          <a
            href="/api/auth/google"
            class="w-full inline-flex items-center justify-center gap-2 border border-ink-200 rounded-lg px-4 py-2.5 font-medium hover:bg-ink-50 transition-colors"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="h-5 w-5" />
            เข้าสู่ระบบด้วย Google
          </a>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-ink-600">
            ยังไม่มีบัญชี? 
            <NuxtLink to="/register" class="text-brand-600 hover:text-brand-700 font-medium">
              สมัครสมาชิก
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useSeoMeta } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

useSeoMeta({
  title: 'เข้าสู่ระบบ • WhiteBikeVibes',
  ogTitle: 'เข้าสู่ระบบ • WhiteBikeVibes',
  description: 'เข้าสู่ระบบ WhiteBikeVibes เพื่อแสดงความคิดเห็นและเข้าถึงฟีเจอร์พิเศษ',
  ogDescription: 'เข้าสู่ระบบ WhiteBikeVibes เพื่อแสดงความคิดเห็นและเข้าถึงฟีเจอร์พิเศษ',
  robots: 'noindex, nofollow'
})

const { login } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const submitting = ref(false)
const error = ref<string | null>(null)

async function handleLogin() {
  error.value = null
  submitting.value = true
  
  try {
    await login(form)
    router.push('/profile')
  } catch (err: any) {
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
  } finally {
    submitting.value = false
  }
}
</script>
