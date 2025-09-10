// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Ensure Nuxt uses project root as source (not app/)
  srcDir: '.',
  dir: {
    pages: 'pages'
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Global styles
  css: ['@/assets/css/main.css'],

  modules: [
    // Minimal set needed for our UI
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // PostCSS configuration
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  // Runtime config for server secrets
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    public: {
      siteUrl:
        process.env.NODE_ENV === 'production'
          ? process.env.NUXT_PUBLIC_SITE_URL || 'https://whitebikevibes.com'
          : 'http://localhost:3000',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      adsensePublisherId: process.env.NUXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID || ''
    },
  },
})