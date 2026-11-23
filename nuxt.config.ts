import { CASE_STUDIES } from './app/constants/case-studies-data'
import { GARDEN_ITEMS } from './app/constants/garden-data'

const contentRoutes = [
  ...CASE_STUDIES.map((c) => `/work/${c.slug}`),
  ...GARDEN_ITEMS.map((g) => `/garden/${g.slug}`),
]

const RETIRED_LOCALES = ['pt', 'it', 'de'] as const

const retiredLocaleRedirects = Object.fromEntries(
  RETIRED_LOCALES.flatMap((locale) => [
    [`/${locale}`, { redirect: { to: '/', statusCode: 301 } }],
    [`/${locale}/**`, { redirect: { to: '/**', statusCode: 301 } }],
  ]),
)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  $production: {
    nitro: {
      prerender: {
        crawlLinks: false,
        routes: contentRoutes,
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Bruna Fusiger',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    },
  },

  routeRules: retiredLocaleRedirects,

  css: ['~/assets/css/reset.css'],

  components: [
    { path: '~/components/atoms', pathPrefix: false },
    { path: '~/components/molecules', pathPrefix: false },
    { path: '~/components/organisms', pathPrefix: false },
  ],

  modules: [
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@posthog/nuxt',
  ],

  /**
   * Built-in `@nuxt/content@v3:urls` assumes page-like rows with `path`; our data
   * collections use `stem` only — use `/api/__sitemap__/urls` instead.
   */
  sitemap: {
    excludeAppSources: ['@nuxt/content@v3:urls'],
    sources: ['/api/__sitemap__/urls'],
  },

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

  fonts: {
    defaults: {
      preload: true,
    },
    families: [
      {
        name: 'Geist',
        provider: 'google',
        weights: ['400', '500', '600', '700', '800', '900'],
      },
      {
        name: 'IBM Plex Serif',
        provider: 'google',
        weights: ['400', '500'],
      },
    ],
  },

  image: {
    format: ['avif', 'webp', 'png'],
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

  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'SOURCEMAP_BROKEN') return
          warn(warning)
        },
      },
    },
  },
})