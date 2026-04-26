import { queryCollection } from '@nuxt/content/server'

type StemRow = { stem?: string }

function rowsToUrls(
  rows: StemRow[],
  segment: 'work' | 'garden',
): { loc: string; _sitemap: string }[] {
  const out: { loc: string; _sitemap: string }[] = []
  for (const row of rows) {
    const stem = typeof row.stem === 'string' ? row.stem : ''
    const parts = stem.split('/').filter(Boolean)
    const locale = parts[0]
    if (!locale) continue
    const _sitemap = localeCodeToSitemapName[locale]
    if (!_sitemap) continue
    const loc = contentStemToAppPath(stem, segment)
    if (loc === '/') continue
    out.push({ loc, _sitemap })
  }
  return out
}

export default defineEventHandler(async (event) => {
  const [caseStudies, garden] = await Promise.all([
    queryCollection(event, 'caseStudies').select('stem').all(),
    queryCollection(event, 'garden').select('stem').all(),
  ])
  return [...rowsToUrls(caseStudies, 'work'), ...rowsToUrls(garden, 'garden')]
})
