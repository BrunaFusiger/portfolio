export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  app: {
    head: {
      titleTemplate: '%s · Bruna Fusiger',
    },
  },

  css: ['~/assets/css/reset.css'],

  components: [
    { path: '~/components/atoms', pathPrefix: false },
    { path: '~/components/molecules', pathPrefix: false },
    { path: '~/components/organisms', pathPrefix: false },
  ],

  modules: [
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/content',
    '@posthog/nuxt',
  ],

  posthogConfig: {
    publicKey: process.env.NUXT_PUBLIC_POSTHOG_KEY ?? '',
    host: process.env.NUXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
    clientConfig: {
      api_host: '/biruleibe',
      ui_host: process.env.NUXT_PUBLIC_POSTHOG_UI_HOST ?? 'https://eu.posthog.com',
    },
  },
      

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode-v2',
    storage: 'cookie',
  },

  i18n: {
    locales: [
      { code: 'pt', language: 'pt-BR', name: 'Português', file: 'pt.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'it', language: 'it-IT', name: 'Italiano', file: 'it.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      /**
       * With `prefix_except_default`, unprefixed URLs are the default locale.
       * `'root'` only ran detection on `/`, so manually opening e.g. `/work/foo`
       * ignored the locale cookie and always showed English.
       * `'no prefix'` applies cookie/header detection whenever the path has no locale segment.
       */
      redirectOn: 'no prefix',
      /** Browser locale must match `locales`; otherwise English is used. */
      fallbackLocale: 'en',
    },
  },

  fonts: {
    families: [
      {
        name: 'Geist',
        provider: 'google',
        weights: ['400', '500', '600', '700', '800', '900'],
      },
      {
        name: 'IBM Plex Serif',
        provider: 'google',
        weights: ['400', '500', '600', '700'],
      },
    ],
  },

  image: {
    format: ['webp', 'png'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
})