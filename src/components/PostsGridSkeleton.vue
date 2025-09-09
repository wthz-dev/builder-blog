<template>
  <section class="container grid grid-cols-1 gap-8 py-10 md:grid-cols-12">
    <div class="md:col-span-8 lg:col-span-9">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div v-for="n in 6" :key="n" class="animate-pulse overflow-hidden rounded-xl border border-ink-100 bg-white p-4">
          <div class="aspect-[16/9] w-full rounded-lg bg-ink-100"></div>
          <div class="mt-4 h-5 w-3/4 rounded bg-ink-100"></div>
          <div class="mt-2 h-4 w-full rounded bg-ink-100"></div>
        </div>
      </div>
      <div class="mt-8 h-8 w-48 rounded bg-ink-100"></div>
    </div>
    <div class="md:col-span-4 lg:col-span-3">
      <div class="animate-pulse space-y-4">
        <div class="h-6 w-32 rounded bg-ink-100"></div>
        <div class="h-4 w-40 rounded bg-ink-100"></div>
        <div class="h-4 w-36 rounded bg-ink-100"></div>
        <div class="h-4 w-44 rounded bg-ink-100"></div>
      </div>
    </div>
  </section>
</template>
