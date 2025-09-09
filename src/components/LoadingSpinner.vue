<template>
  <div class="flex items-center justify-center p-8" role="status" aria-label="Loading">
    <svg class="h-6 w-6 animate-spin text-ink-700" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <span class="ml-2 text-sm text-ink-600">Loading...</span>
  </div>
</template>
