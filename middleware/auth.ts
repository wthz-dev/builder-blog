export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checkAuth } = useAuth()

  // ถ้ามี user อยู่แล้ว อนุญาตผ่าน
  if (user.value) return

  // ลองเช็คจากเซิร์ฟเวอร์ (อ่านจาก cookie)
  const current = await checkAuth()
  if (current) return

  // ถ้ายังไม่ล็อกอิน ให้ไปหน้า login และใส่ query redirect
  return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
})
