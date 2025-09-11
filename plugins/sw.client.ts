export default defineNuxtPlugin(() => {
  if (process.dev) return // avoid during dev HMR noise; test PWA in production build
  if ('serviceWorker' in navigator) {
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('[SW] register failed', err))
    }
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register)
  }
})
