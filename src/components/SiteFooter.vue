<script setup lang="ts"></script>

<template>
  <footer class="border-t border-ink-100 bg-white/60">
    <div class="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
      <div class="flex items-center gap-2">
        <div class="h-6 w-6 rounded-md bg-gradient-to-br from-brand-500 to-brand-700"></div>
        <span class="font-semibold text-ink-900">Torkait</span>
      </div>
      <p class="text-sm text-ink-500">© {{ new Date().getFullYear() }} Torkait Sukpramote. All rights reserved.</p>
    </div>
  </footer>
</template>
