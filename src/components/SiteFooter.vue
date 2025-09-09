<script setup lang="ts"></script>

<template>
  <footer class="border-t border-ink-100 bg-white/60">
    <div class="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
      <div class="flex items-center gap-2">
        <img src="/ducati-Image.png" alt="Logo" class="h-6 w-6 rounded object-cover" />
        <span class="font-semibold text-ink-900">WhiteBikeVibes</span>
      </div>
      <div class="flex items-center gap-4 text-sm">
        <RouterLink to="/privacy-policy" class="text-ink-600 hover:text-ink-900">Privacy Policy</RouterLink>
        <span class="hidden text-ink-300 md:inline">•</span>
        <p class="text-ink-500">© {{ new Date().getFullYear() }} WhiteBikeVibes</p>
      </div>
    </div>
  </footer>
</template>
