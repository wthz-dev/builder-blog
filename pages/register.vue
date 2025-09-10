<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-xl border border-ink-100 p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-ink-900 mb-6 text-center">สมัครสมาชิก</h1>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-ink-700 mb-2">
              ชื่อ
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
              minlength="6"
              class="w-full px-3 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-ink-700 mb-2">
              ยืนยันรหัสผ่าน
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
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
            :disabled="submitting || !isFormValid"
            class="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-black/80 disabled:opacity-60 transition-colors"
          >
            {{ submitting ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก' }}
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-ink-600">
            มีบัญชีแล้ว? 
            <NuxtLink to="/login" class="text-brand-600 hover:text-brand-700 font-medium">
              เข้าสู่ระบบ
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'สมัครสมาชิก • WhiteBikeVibes',
  ogTitle: 'สมัครสมาชิก • WhiteBikeVibes',
  description: 'สมัครสมาชิก WhiteBikeVibes เพื่อแสดงความคิดเห็นและเข้าถึงฟีเจอร์พิเศษ',
  ogDescription: 'สมัครสมาชิก WhiteBikeVibes เพื่อแสดงความคิดเห็นและเข้าถึงฟีเจอร์พิเศษ',
  robots: 'noindex, nofollow'
})

const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const submitting = ref(false)
const error = ref<string | null>(null)

const isFormValid = computed(() => {
  return form.name && 
         form.email && 
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword &&
         form.password.length >= 6
})

async function handleRegister() {
  error.value = null
  
  if (form.password !== form.confirmPassword) {
    error.value = 'รหัสผ่านไม่ตรงกัน'
    return
  }
  
  submitting.value = true
  
  try {
    await register({
      name: form.name,
      email: form.email,
      password: form.password
    })
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
  } finally {
    submitting.value = false
  }
}
</script>
