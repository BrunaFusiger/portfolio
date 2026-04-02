/** All case study slugs (bench picker + /work index). Homepage SectionWork uses WORK_CARDS only. */
export const CASE_STUDIES = [
  { slug: 'euvetia-platform', i18nKey: 'euvetiaPlatform', coverImage: '/images/cases/covers/euvetia-platform-on-stone-table.png', coverBg: 'bg-surface-subtle' },
  {
    slug: 'euvetia-website',
    i18nKey: 'euvetiaWebsite',
    coverImage: '/images/cases/covers/euvetia-website.png',
    coverBg: 'bg-red-500',
    mediaBackgroundColor: '#E63022',
  },
  {
    slug: 'zycreate',
    i18nKey: 'zycreate',
    coverImage: '/images/cases/covers/Zycreate.png',
    coverBg: 'bg-cover-purple',
    mediaBackgroundColor: '#7a77e5',
  },
  {
    slug: 'swissonal',
    i18nKey: 'swissonal',
    coverImage: '/images/cases/covers/swissonal.png',
    coverBg: 'bg-cover-green',
    mediaBackgroundColor: '#03973a',
  },
  {
    slug: 'zytro-website',
    i18nKey: 'zytroWebsite',
    coverImage: '/images/cases/covers/zytro-website.png',
    coverBg: 'bg-neutral-100',
    mediaBackgroundColor: '#f5f5f5',
  },
  {
    slug: 'zytro-unreal',
    i18nKey: 'zytroUnreal',
    coverImage: '/images/cases/covers/zytro-unreal.png',
    coverBg: 'bg-cover-brown',
    mediaBackgroundColor: '#68584e',
  },
  {
    slug: 'zyhub',
    i18nKey: 'zyhub',
    coverImage: '/images/cases/covers/zyhub.png',
    coverBg: 'bg-cover-lime',
    mediaBackgroundColor: '#95cc76',
  },
] as const

export type CaseStudySlug = (typeof CASE_STUDIES)[number]['slug']

export function caseStudyBySlug(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return CASE_STUDIES.some((c) => c.slug === slug)
}
