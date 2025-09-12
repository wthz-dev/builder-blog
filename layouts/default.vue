<template>
  <div class="min-h-screen bg-ink-50 dark:bg-ink-900">
    <NavBar />
    <main>
      <slot />
    </main>

    <!-- Global Overlay -->
    <PageBlocker />

    <!-- Footer -->
    <footer class="bg-ink-50 border-t border-ink-100 mt-16 dark:bg-ink-900 dark:border-ink-800">
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
        <div class="border-t border-ink-200 mt-8 pt-8 text-center text-sm text-ink-600 dark:border-ink-800 dark:text-ink-300">
          <p class="mb-2">&copy; {{ new Date().getFullYear() }} WhiteBikeVibes. All rights reserved.</p>
          <p>
            <a href="/feed.xml" class="underline hover:text-ink-900">RSS Feed</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar.vue'
import { useRuntimeConfig } from '#app'
const runtime = useRuntimeConfig()
const siteUrl = (runtime.public as any)?.siteUrl || ''

const organizationSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WhiteBikeVibes',
  url: siteUrl,
  logo: `${siteUrl}/og-image.jpg`,
  sameAs: [
    'https://www.tiktok.com/@whitez52',
    'https://www.instagram.com/whitez52',
    'https://www.facebook.com/torkait.sukpromote'
  ]
})

const websiteSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WhiteBikeVibes',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
})

// Temporarily remove useHead scripts to prevent dispose error
// TODO: Find alternative solution for JSON-LD in layouts
// useHead({
//   script: [
//     {
//       type: 'application/ld+json',
//       innerHTML: organizationSchema
//     },
//     {
//       type: 'application/ld+json',
//       innerHTML: websiteSchema
//     }
//   ]
// })
</script>
