/** All case study slugs (bench picker + /work index). Homepage SectionWork uses WORK_CARDS only. */
export const CASE_STUDIES = [
  {
    slug: 'euvetia-platform',
    title: 'Euvetia',
    description: 'A one-stop hub for brazilian expats with European passports who want to move to Switzerland.',
    tags: 'SaaS · B2C · Platform · Information Architecture · 0→1 · Swiss law',
    seoDescription: 'SaaS relocation platform for Brazilian expats with EU passports moving to Switzerland. UX/UI, information architecture, and product design by Bruna Fusiger.',
    coverImage: '/media/cases/covers/euvetia-platform-on-stone-table.png',
    coverBg: 'bg-surface-subtle',
  },
  {
    slug: 'swiss-job-search',
    title: 'Swiss job search',
    description: 'A job search that explains the Swiss market to people who are new to it.',
    tags: 'Redesign · Search · Personalization · Data-driven · B2C',
    seoDescription: 'Redesign of a Swiss job search for immigrants: multilingual job titles, CV compatibility, personalized market insights, agencies, and apprenticeships. UX/UI and product design by Bruna Fusiger.',
    coverImage: '/media/cases/swiss-job-search/cover.png',
    coverBg: 'bg-surface-subtle',
  },
  {
    slug: 'euvetia-website',
    title: 'Sales website',
    description: 'Trust-first landing page for a high-ticket relocation platform to Switzerland.',
    tags: 'Landing Page · Marketing · UX writing · Psychology',
    seoDescription: 'Trust-first landing experience for a high-ticket Switzerland relocation service. UX/UI, conversion design, and UX writing by Bruna Fusiger.',
    coverImage: '/media/cases/covers/euvetia-website.png',
    coverBg: 'bg-red-500',
    mediaBackgroundColor: '#E63022',
  },
  {
    slug: 'euvetia-permit-checker',
    title: 'Permit checker',
    description: 'Swiss residence permit checker with visual, personalized results.',
    tags: 'Tool · Form · Bento Box · Data-driven',
    seoDescription: 'Swiss residence permit checker turning complex rules into clear, personalized outcomes. UX/UI and form design by Bruna Fusiger.',
    coverImage: '/media/cases/covers/euvetia-bento-box.png',
    coverBg: 'bg-surface-subtle',
    mediaBackgroundColor: '#FFEBEC',
  },
  {
    slug: 'zycreate',
    title: 'ZYcreate',
    description: 'Real-time collaboration board for architecture teams and clients.',
    tags: 'B2B · Architecture · Real-time · 3D Visualization',
    seoDescription: 'Real-time B2B collaboration for architecture teams and clients—boards, workflows, and 3D context. UX/UI by Bruna Fusiger.',
    coverImage: '/media/cases/covers/Zycreate.png',
    coverBg: 'bg-cover-purple',
    mediaBackgroundColor: '#7a77e5',
  },
  {
    slug: 'swissonal',
    title: 'Swissonal',
    description: 'Seasonal planting calendar for hobby gardeners in Switzerland.',
    tags: 'Website · Nuxt.js · Tool · Gardening',
    seoDescription: 'Seasonal planting calendar for Swiss gardeners, designed and shipped in Vue/Nuxt. UX/UI plus hands-on full-stack delivery by Bruna Fusiger.',
    coverImage: '/media/cases/covers/swissonal.png',
    coverBg: 'bg-cover-green',
    mediaBackgroundColor: '#03973a',
  },
  {
    slug: 'zytro-website',
    title: 'Zytro website',
    description: 'Corporate website redesign and design system. Awwwards Nominee.',
    tags: 'Branding · Design System · Website · B2B · Redesign',
    seoDescription: 'B2B corporate site redesign and design system (Awwwards nominee). Brand-forward visual and UI design by Bruna Fusiger.',
    coverImage: '/media/cases/covers/zytro-website.png',
    coverBg: 'bg-neutral-100',
    mediaBackgroundColor: '#f5f5f5',
  },
  {
    slug: 'zyhub',
    title: 'ZYhub',
    description: 'RBAC project and delivery platform for internal team and client companies.',
    tags: 'RBAC · Dashboard · Admin · Access Control',
    seoDescription: 'RBAC project and delivery platform for internal teams and client companies. UX/UI for admin-heavy SaaS by Bruna Fusiger.',
    coverImage: '/media/cases/covers/zyhub.png',
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
