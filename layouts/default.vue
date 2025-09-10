<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="border-b border-ink-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-xl font-bold text-ink-900">WhiteBikeVibes</span>
          </NuxtLink>
          
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/" class="text-ink-600 hover:text-ink-900 transition-colors">
              หน้าแรก
            </NuxtLink>
            <NuxtLink to="/about" class="text-ink-600 hover:text-ink-900 transition-colors">
              เกี่ยวกับ
            </NuxtLink>
            <NuxtLink to="/contact" class="text-ink-600 hover:text-ink-900 transition-colors">
              ติดต่อ
            </NuxtLink>
            <template v-if="user && user.role === 'ADMIN'">
              <NuxtLink to="/admin/posts" class="text-ink-600 hover:text-ink-900 transition-colors" @click="onAdminPostsClick">
                โพสต์ (Admin)
              </NuxtLink>
              <NuxtLink to="/admin/posts/new" class="bg-black text-white px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors" @click="onAdminNewPostClick">
                + เพิ่มโพสต์
              </NuxtLink>
            </template>
          </div>
          
          <div class="flex items-center space-x-4">
            <template v-if="user">
              <NuxtLink to="/profile" class="text-ink-600 hover:text-ink-900">
                {{ user.name }}
              </NuxtLink>
              <button @click="logout" class="text-ink-600 hover:text-ink-900">
                ออกจากระบบ
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-ink-600 hover:text-ink-900">
                เข้าสู่ระบบ
              </NuxtLink>
              <NuxtLink to="/register" class="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors">
                สมัครสมาชิก
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-ink-50 border-t border-ink-100 mt-16">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="font-semibold text-ink-900 mb-4">WhiteBikeVibes</h3>
            <p class="text-ink-600 text-sm">
              Bigbike + Dev Lifestyle
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-ink-900 mb-4">ลิงก์</h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/about" class="text-ink-600 hover:text-ink-900">เกี่ยวกับ</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-ink-600 hover:text-ink-900">ติดต่อ</NuxtLink></li>
              <li><NuxtLink to="/privacy-policy" class="text-ink-600 hover:text-ink-900">นโยบายความเป็นส่วนตัว</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-ink-900 mb-4">ติดตาม</h3>
            <div class="flex space-x-4">
              <!-- Social media links can be added here -->
               <NuxtLink to="https://www.tiktok.com/@whitez52" class="text-ink-600 hover:text-ink-900">
                <img src="https://img.icons8.com/color/48/000000/tiktok.png" alt="TikTok" class="w-8 h-8">
               </NuxtLink>
               <NuxtLink to="https://www.youtube.com/@Torkait" class="text-ink-600 hover:text-ink-900">
                <img src="https://img.icons8.com/color/48/000000/youtube.png" alt="YouTube" class="w-8 h-8">
               </NuxtLink>
               <NuxtLink to="https://www.instagram.com/whitez52" class="text-ink-600 hover:text-ink-900">
                <img src="https://img.icons8.com/color/48/000000/instagram.png" alt="Instagram" class="w-8 h-8">
               </NuxtLink>
               <NuxtLink to="https://www.facebook.com/torkait.sukpromote" class="text-ink-600 hover:text-ink-900">
                <img src="https://img.icons8.com/color/48/000000/facebook.png" alt="Facebook" class="w-8 h-8">
               </NuxtLink>
            </div>
          </div>
        </div>
        <div class="border-t border-ink-200 mt-8 pt-8 text-center text-sm text-ink-600">
          <p>&copy; {{ new Date().getFullYear() }} WhiteBikeVibes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const { click: gClick } = useGtag()

function onAdminPostsClick() {
  gClick('nav_admin_posts', { location: 'navbar' })
}
function onAdminNewPostClick() {
  gClick('nav_admin_new_post', { location: 'navbar' })
}
</script>
