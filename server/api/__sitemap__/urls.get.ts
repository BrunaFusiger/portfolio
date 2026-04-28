import { CASE_STUDIES } from '../../../app/constants/case-studies-data'
import { GARDEN_ITEMS } from '../../../app/constants/garden-data'

function slugsToUrls(
  slugs: readonly string[],
  segment: 'work' | 'garden',
): { loc: string; _sitemap: string }[] {
  const out: { loc: string; _sitemap: string }[] = []

  for (const slug of slugs) {
    for (const [locale, _sitemap] of Object.entries(localeCodeToSitemapName)) {
      const loc = locale === 'en'
        ? `/${segment}/${slug}`
        : `/${locale}/${segment}/${slug}`

      out.push({ loc, _sitemap })
    }
  }

  return out
}

export default defineEventHandler(() => {
  return [
    ...slugsToUrls(CASE_STUDIES.map((item) => item.slug), 'work'),
    ...slugsToUrls(GARDEN_ITEMS.map((item) => item.slug), 'garden'),
  ]
})
