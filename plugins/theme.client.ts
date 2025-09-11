export default defineNuxtPlugin(() => {
  if (process.server) return
  const root = document.documentElement
  try {
    const stored = (localStorage.getItem('theme') as 'light' | 'dark' | null)
    let next: 'light' | 'dark'
    if (stored) {
      next = stored
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      next = prefersDark ? 'dark' : 'light'
    }
    if (next === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  } catch {
    // ignore
  }
})
