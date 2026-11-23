import { CASE_STUDIES } from '../../../app/constants/case-studies-data'
import { GARDEN_ITEMS } from '../../../app/constants/garden-data'

function slugsToUrls(
  slugs: readonly string[],
  segment: 'work' | 'garden',
): { loc: string }[] {
  return slugs.map((slug) => ({ loc: `/${segment}/${slug}` }))
}

export default defineEventHandler(() => {
  return [
    ...slugsToUrls(CASE_STUDIES.map((item) => item.slug), 'work'),
    ...slugsToUrls(GARDEN_ITEMS.map((item) => item.slug), 'garden'),
  ]
})
