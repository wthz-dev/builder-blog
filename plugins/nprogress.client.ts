import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Configure NProgress
  NProgress.configure({ showSpinner: false, trickleSpeed: 150, minimum: 0.08 })

  // Route progress
  const router = useRouter()
  router.beforeEach(() => { NProgress.start() })
  router.afterEach(() => { NProgress.done() })

  // Nuxt page lifecycle hooks (works with suspense navigation)
  nuxtApp.hook('page:start', () => { NProgress.start() })
  nuxtApp.hook('page:finish', () => { NProgress.done() })

  // Optional: guard against errors
  nuxtApp.hook('vue:error', () => { NProgress.done() })
})
