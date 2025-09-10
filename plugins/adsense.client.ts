export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const pubId = config.public?.adsensePublisherId as string | undefined
  if (!pubId) return

  if (process.client) {
    // Avoid duplicate
    if (!document.querySelector('script[data-adsbygoogle]')) {
      const s = document.createElement('script')
      s.setAttribute('data-adsbygoogle', 'true')
      s.async = true
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(pubId)}`
      s.crossOrigin = 'anonymous'
      document.head.appendChild(s)
    }
  }
})
