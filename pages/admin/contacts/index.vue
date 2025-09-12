<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-5xl mx-auto">
      <div class="bg-white rounded-xl border border-ink-100 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-ink-900">รายการติดต่อ</h1>
          <NuxtLink to="/admin/posts" class="text-sm text-ink-600 hover:text-ink-900">จัดการโพสต์ →</NuxtLink>
        </div>

        <div v-if="!user" class="text-ink-600">กำลังตรวจสอบสิทธิ์...</div>
        <div v-else-if="user.role !== 'ADMIN'" class="text-center">
          <p class="text-ink-700 mb-4">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <NuxtLink to="/" class="text-brand-600 hover:text-brand-700">← กลับหน้าแรก</NuxtLink>
        </div>

        <div v-else>
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm text-ink-600">รวมทั้งหมด {{ total }} รายการ</div>
            <div class="flex items-center gap-2">
              <button class="px-3 py-1.5 text-sm rounded border border-ink-200 hover:bg-ink-50" @click="refresh()">รีเฟรช</button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-ink-600">
                  <th class="py-2">ชื่อ</th>
                  <th class="py-2">อีเมล</th>
                  <th class="py-2">ข้อความ</th>
                  <th class="py-2">วันที่</th>
                  <th class="py-2 text-right">การทำงาน</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in contacts" :key="c.id" class="border-t border-ink-100">
                  <td class="py-2 align-top">{{ c.name }}</td>
                  <td class="py-2 align-top"><a class="underline" :href="`mailto:${c.email}`">{{ c.email }}</a></td>
                  <td class="py-2 align-top max-w-[420px]">{{ c.message }}</td>
                  <td class="py-2 align-top">{{ formatDate(c.createdAt) }}</td>
                  <td class="py-2 align-top text-right">
                    <button class="px-2 py-1 text-xs rounded border border-red-200 text-red-700 hover:bg-red-50" @click="onDelete(c.id)">ลบ</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6 flex justify-end">
            <Pagination v-if="totalPages > 1" :current-page="page" :total-pages="totalPages" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pagination from '~/components/Pagination.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
useSeoMeta({ robots: 'noindex, nofollow', title: 'จัดการการติดต่อ • Admin' })
const route = useRoute()
const page = computed(() => parseInt(String(route.query.page || '1')) || 1)

const { data, refresh } = await useAsyncData(() => $fetch(`/api/admin/contacts`, { params: { page: page.value } }))
const contacts = computed(() => data.value?.contacts || [])
const total = computed(() => data.value?.total || 0)
const totalPages = computed(() => data.value?.totalPages || 1)

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function onDelete(id: string) {
  if (!confirm('ยืนยันการลบรายการนี้?')) return
  try {
    await $fetch(`/api/admin/contacts/${id}/delete`, { method: 'POST' })
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message || e?.message || 'ลบไม่สำเร็จ')
  }
}
</script>
