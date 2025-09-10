export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const measurementId = (config.public as any)?.gaMeasurementId as string | undefined
  if (!measurementId) return

  if (process.client) {
    // Load gtag script once
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
      document.head.appendChild(s)
    }

    // Init gtag
    // @ts-ignore
    window.dataLayer = window.dataLayer || []
    // @ts-ignore
    function gtag(){ window.dataLayer.push(arguments) }
    // @ts-ignore
    gtag('js', new Date())
    // @ts-ignore
    gtag('config', measurementId, { anonymize_ip: true })

    // Track route changes as page_view
    const router = useRouter()
    router.afterEach((to) => {
      // @ts-ignore
      gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: to.fullPath,
        page_title: document.title
      })
    })
  }
})
