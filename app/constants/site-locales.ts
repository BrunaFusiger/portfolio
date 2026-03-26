/** Shared locale list for header settings and other inline language pickers. */
export const SITE_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'de', label: 'Deutsch' },
] as const

export type SiteLocaleCode = (typeof SITE_LOCALES)[number]['code']
