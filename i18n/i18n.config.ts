export default defineI18nConfig(() => ({
  /** Missing keys and unsupported runtime locales resolve to English. */
  fallbackLocale: 'en',
}))
