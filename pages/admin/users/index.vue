<template>
  <div class="container mx-auto px-4 py-16">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-ink-900">ผู้ใช้ทั้งหมด (Admin)</h1>
    </div>

    <div v-if="!user" class="text-ink-600">กำลังตรวจสอบสิทธิ์...</div>
    <div v-else-if="user.role !== 'ADMIN'" class="text-ink-700">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>

    <div v-else>
      <div class="mb-4 flex flex-wrap items-end gap-3">
        <div class="grow min-w-64">
          <label class="block text-xs font-medium text-ink-600 mb-1">ค้นหาชื่อ/อีเมล</label>
          <input v-model.trim="q" type="text" placeholder="พิมพ์คำค้น..." class="w-full px-3 py-2 border border-ink-200 rounded-lg" />
        </div>
        <div>
          <label class="block text-xs font-medium text-ink-600 mb-1">บทบาท</label>
          <select v-model="roleFilter" class="px-3 py-2 border border-ink-200 rounded-lg bg-white">
            <option value="all">ทั้งหมด</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto border border-ink-100 rounded-xl">
        <table class="min-w-full divide-y divide-ink-100 bg-white">
          <thead class="bg-ink-50 sticky top-0 z-10">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">ผู้ใช้</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">อีเมล</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">บทบาท</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-ink-600 uppercase tracking-wider">สมัครเมื่อ</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink-100">
            <template v-if="pending">
              <tr v-for="i in 8" :key="`s-${i}`" class="odd:bg-ink-50/40">
                <td class="px-4 py-3">—</td>
                <td class="px-4 py-3">—</td>
                <td class="px-4 py-3">—</td>
                <td class="px-4 py-3">—</td>
                <td class="px-4 py-3 text-right">—</td>
              </tr>
            </template>
            <tr v-else v-for="u in pagedUsers" :key="u.id" class="odd:bg-ink-50/40 hover:bg-ink-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <img :src="u.avatarUrl || '/profile.svg'" alt="" class="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <div class="text-ink-900 font-medium">{{ u.name }}</div>
                    <div class="text-xs text-ink-500">{{ u.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-ink-700">{{ u.email }}</td>
              <td class="px-4 py-3">
                <select :disabled="u.id === user.id" v-model="roles[u.id]" class="px-2 py-1 border border-ink-200 rounded bg-white" @change="onChangeRole(u.id)">
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
              </td>
              <td class="px-4 py-3 text-ink-700">{{ formatDate(u.createdAt) }}</td>
              <td class="px-4 py-3 text-right">
                <button :disabled="u.id === user.id" class="px-2 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50" @click="openDelete(u)">ลบ</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!users || users.length === 0" class="text-ink-600 mt-4">ยังไม่มีผู้ใช้</div>
      <div v-else class="flex items-center justify-between gap-3 mt-4">
        <div class="text-sm text-ink-600">
          <span>{{ displayFrom }}–{{ displayTo }}</span>
          <span class="mx-1">จาก</span>
          <span>{{ filteredUsers.length }}</span>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-ink-600">แสดงต่อหน้า</label>
          <select v-model.number="perPage" class="px-2 py-1 border border-ink-200 rounded bg-white text-sm">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
          <button class="px-3 py-2 border border-ink-200 rounded-lg disabled:opacity-50" :disabled="page === 1" @click="goToPage(page - 1)">ก่อนหน้า</button>
          <div class="text-sm text-ink-700">หน้า {{ page }} / {{ totalPages }}</div>
          <button class="px-3 py-2 border border-ink-200 rounded-lg disabled:opacity-50" :disabled="page === totalPages" @click="goToPage(page + 1)">ถัดไป</button>
        </div>
      </div>

      <transition name="fade">
        <div v-if="showDelete" class="fixed inset-0 z-[1000] bg-black/40 grid place-items-center" @click.self="showDelete=false">
          <div class="w-full max-w-md rounded-2xl bg-white p-5 border border-ink-100 shadow-xl">
            <h3 class="text-lg font-semibold text-ink-900 mb-2">ยืนยันการลบผู้ใช้</h3>
            <p class="text-sm text-ink-700 mb-4">คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ <span class="font-medium">{{ targetUser?.name }}</span>? โพสต์และคอมเมนต์ที่เกี่ยวข้องจะถูกลบด้วย</p>
            <div class="flex justify-end gap-2">
              <button class="px-3 py-2 rounded-lg border border-ink-200" @click="showDelete=false">ยกเลิก</button>
              <button class="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700" @click="confirmDelete">ลบ</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { definePageMeta, useAsyncData, useRequestHeaders, useSeoMeta } from '#imports'
import { useAuth } from '../../../composables/useAuth'

definePageMeta({ middleware: 'auth' })
const { user } = useAuth()

useSeoMeta({ title: 'จัดการผู้ใช้ • WhiteBikeVibes', robots: 'noindex, nofollow' })

const q = ref('')
const roleFilter = ref<'all'|'ADMIN'|'USER'>('all')
const users = ref<any[]>([])
const pending = ref(true)
const error = ref<string | null>(null)
const roles = ref<Record<string, 'ADMIN' | 'USER'>>({})
const page = ref(1)
const perPage = ref(20)
const showDelete = ref(false)
const targetUser = ref<any | null>(null)

const { data, error: err, pending: p } = useAsyncData('admin-users', async () => {
  const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
  return $fetch<{ users: any[] }>('/api/admin/users', { headers })
})
watchEffect(() => {
  pending.value = !!p.value
  if (err.value) error.value = (err.value as any)?.data?.message || 'โหลดข้อมูลไม่สำเร็จ'
  else if (data.value) {
    users.value = data.value.users
    const m: Record<string, 'ADMIN' | 'USER'> = {}
    for (const u of users.value) m[u.id] = u.role
    roles.value = m
  }
})

const filteredUsers = computed(() => {
  const list = users.value || []
  const ql = q.value.trim().toLowerCase()
  return list.filter((u) => {
    const passQ = !ql || (u.name || '').toLowerCase().includes(ql) || (u.email || '').toLowerCase().includes(ql)
    const passRole = roleFilter.value === 'all' || u.role === roleFilter.value
    return passQ && passRole
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil((filteredUsers.value.length || 0) / perPage.value)))
const pagedUsers = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredUsers.value.slice(start, start + perPage.value)
})
const displayFrom = computed(() => filteredUsers.value.length ? (page.value - 1) * perPage.value + 1 : 0)
const displayTo = computed(() => Math.min(filteredUsers.value.length, page.value * perPage.value))
function goToPage(n: number) {
  if (n < 1) n = 1
  if (n > totalPages.value) n = totalPages.value
  page.value = n
}

function formatDate(dt: string) {
  try { return new Date(dt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) } catch { return dt }
}

async function onChangeRole(id: string) {
  try {
    const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
    const role = roles.value[id]
    const res = await $fetch(`/api/admin/users/${id}/update`, { method: 'POST', body: { role }, headers })
    // apply updated role
    const idx = users.value.findIndex(u => u.id === id)
    if (idx >= 0) users.value[idx].role = role
  } catch (e: any) {
    alert(e?.data?.message || 'อัปเดตบทบาทไม่สำเร็จ')
  }
}

async function onDelete(id: string) {
  if (!confirm('ยืนยันการลบบัญชีผู้ใช้นี้? โพสต์และคอมเมนต์ที่เกี่ยวข้องจะถูกลบด้วย')) return
  try {
    const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
    await $fetch(`/api/admin/users/${id}/delete`, { method: 'POST', headers })
    users.value = users.value.filter(u => u.id !== id)
  } catch (e: any) {
    alert(e?.data?.message || 'ลบไม่สำเร็จ')
  }
}

function openDelete(u: any) {
  targetUser.value = u
  showDelete.value = true
}
async function confirmDelete() {
  if (!targetUser.value) return
  try {
    const headers = process.server ? (useRequestHeaders(['cookie']) as Record<string, string>) : undefined
    await $fetch(`/api/admin/users/${targetUser.value.id}/delete`, { method: 'POST', headers })
    users.value = users.value.filter(x => x.id !== targetUser.value.id)
    showDelete.value = false
    targetUser.value = null
  } catch (e: any) {
    alert(e?.data?.message || 'ลบไม่สำเร็จ')
  }
}
</script>
