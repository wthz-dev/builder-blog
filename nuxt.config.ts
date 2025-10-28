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
        ...(process.env.NUXT_PUBLIC_ADSENSE_PUBLISHER_ID
          ? [{ name: 'google-adsense-account', content: String(process.env.NUXT_PUBLIC_ADSENSE_PUBLISHER_ID) }]
          : []),
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
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
      twitterCreator: process.env.NUXT_PUBLIC_TWITTER_CREATOR || '@whitez52',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
    },
  },

  modules: [
    // Minimal set needed for our UI
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],

  // Nitro/Hosting behaviors
  routeRules: {
    '/': { isr: 300 },
    '/post/**': { isr: 600 },
    '/category/**': { isr: 600 },
    '/tag/**': { isr: 600 },
    '/sitemap.xml': { cache: { maxAge: 300 } },
    '/robots.txt': { cache: { maxAge: 86400 } },
    '/**': {
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
      }
    }
  },

  image: {
    format: ['webp', 'avif'],
    quality: 80,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
  },

  // PostCSS configuration
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
})

