const defaultLocale = 'en'

/** Map `content/{locale}/work|garden/{slug}.yml` stem to app path (`prefix_except_default`). */
export function contentStemToAppPath(stem: string, segment: 'work' | 'garden'): string {
  const parts = stem.split('/').filter(Boolean)
  if (parts.length < 3) return '/'
  const [locale, seg, ...slugParts] = parts
  const slug = slugParts.join('/')
  if (!locale || seg !== segment || !slug) return '/'
  if (locale === defaultLocale) return `/${segment}/${slug}`
  return `/${locale}/${segment}/${slug}`
}

/** Child sitemap name from @nuxtjs/i18n `locales[].language` (e.g. en-US). */
export const localeCodeToSitemapName: Record<string, string> = {
  en: 'en-US',
  pt: 'pt-BR',
  it: 'it-IT',
  de: 'de-DE',
}
