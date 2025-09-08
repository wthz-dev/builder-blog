<script setup lang="ts"></script>

<template>
  <section class="container py-16">
    <div class="mx-auto max-w-4xl rounded-xl border border-ink-100 bg-white p-6 shadow-sm">
      <h1 class="font-display text-2xl font-bold text-ink-900">Admin Dashboard</h1>
      <p class="mt-2 text-ink-600">This is a placeholder for post CRUD. Connect a database and API to enable full functionality.</p>
      <div class="mt-6 overflow-x-auto">
        <table class="min-w-full divide-y divide-ink-100 text-sm">
          <thead>
            <tr class="text-left text-ink-500">
              <th class="py-2">Title</th>
              <th class="py-2">Status</th>
              <th class="py-2">Date</th>
              <th class="py-2">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink-100">
            <tr>
              <td class="py-2 font-medium text-ink-900">Getting Started with Vue 3</td>
              <td class="py-2">Published</td>
              <td class="py-2">Today</td>
              <td class="py-2">
                <button class="rounded border border-ink-200 px-2 py-1 hover:bg-ink-50">Edit</button>
                <button class="ml-2 rounded border border-ink-200 px-2 py-1 hover:bg-ink-50">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
