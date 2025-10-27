// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Ensure Nuxt uses project root as source (not app/)
  srcDir: '.',
  dir: {
    pages: 'pages',
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      link: [{ rel: 'manifest', href: '/manifest.webmanifest' }],
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        // Google Search Console verification (set env NUXT_PUBLIC_GSC_VERIFICATION)
      ],
      script:
        process.env.NODE_ENV === 'production' && process.env.NUXT_PUBLIC_ADSENSE_PUBLISHER_ID
          ? [
              {
                src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NUXT_PUBLIC_ADSENSE_PUBLISHER_ID}`,
                async: true,
                crossorigin: 'anonymous',
              },
            ]
          : [],
    },
  },

  // Global styles
  css: ['@/assets/css/main.css'],

  // Runtime configuration (single consolidated block)
  runtimeConfig: {
    // Server-only secrets
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    // Public runtime config available on client
    public: {
      siteUrl:
        process.env.NODE_ENV === 'production'
          ? process.env.NUXT_PUBLIC_SITE_URL || 'https://whitebikevibes.space'
          : 'http://localhost:3000',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      adsensePublisherId: process.env.NUXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID || '',
      twitterSite: process.env.NUXT_PUBLIC_TWITTER_SITE || '@whitez52',
      twitterCreator: process.env.NUXT_PUBLIC_TWITTER_CREATOR || '@whitez52'
      // optional: Google Search Console verification token
      // e.g. NUXT_PUBLIC_GSC_VERIFICATION="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
  },

  modules: [
    // Minimal set needed for our UI
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],

  // PostCSS configuration
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
})

