import { RuntimeConfig as UserRuntimeConfig, PublicRuntimeConfig as UserPublicRuntimeConfig } from 'nuxt/schema'
  interface SharedRuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   jwtSecret: string,

   databaseUrl: string,

   cloudinaryCloudName: string,

   cloudinaryApiKey: string,

   cloudinaryApiSecret: string,

   nitro: {
      envPrefix: string,
   },
  }
  interface SharedPublicRuntimeConfig {
   siteUrl: string,

   apiBase: string,

   adsensePublisherId: string,

   gaMeasurementId: string,

   twitterSite: string,

   twitterCreator: string,
  }
declare module '@nuxt/schema' {
  interface RuntimeConfig extends UserRuntimeConfig {}
  interface PublicRuntimeConfig extends UserPublicRuntimeConfig {}
}
declare module 'nuxt/schema' {
  interface RuntimeConfig extends SharedRuntimeConfig {}
  interface PublicRuntimeConfig extends SharedPublicRuntimeConfig {}
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: UserRuntimeConfig
        }
      }