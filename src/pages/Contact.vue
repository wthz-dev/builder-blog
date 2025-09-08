<script setup lang="ts"></script>

<template>
  <section class="container py-16">
    <div class="mx-auto max-w-2xl">
      <h1 class="font-display text-3xl font-bold text-ink-900">Contact</h1>
      <p class="mt-2 text-ink-600">
        This form is for demo only. Connect a backend to enable submissions.
      </p>
      <form class="mt-6 grid gap-4">
        <input
          type="text"
          placeholder="Name"
          class="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          class="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
        />
        <textarea
          placeholder="Message"
          class="min-h-32 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
        ></textarea>
        <button
          type="button"
          class="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
        >
          Send
        </button>
      </form>
    </div>
  </section>
</template>
