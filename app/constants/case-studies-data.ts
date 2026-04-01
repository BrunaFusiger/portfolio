/** All case study slugs (bench picker + /work index). Homepage SectionWork uses WORK_CARDS only. */
export const CASE_STUDIES = [
  { slug: 'euvetia-platform', i18nKey: 'euvetiaPlatform' },
  { slug: 'euvetia-website', i18nKey: 'euvetiaWebsite' },
  { slug: 'swissonal', i18nKey: 'swissonal' },
  { slug: 'zytro-website', i18nKey: 'zytroWebsite' },
  { slug: 'zycreate', i18nKey: 'zycreate' },
  { slug: 'zyhub', i18nKey: 'zyhub' },
  { slug: 'zytro-unreal', i18nKey: 'zytroUnreal' },
] as const

export type CaseStudySlug = (typeof CASE_STUDIES)[number]['slug']

export function caseStudyBySlug(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return CASE_STUDIES.some((c) => c.slug === slug)
}
