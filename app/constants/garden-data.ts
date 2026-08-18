/** All garden slugs (/garden index + SectionGarden marquee on home). */
export const GARDEN_ITEMS = [
  {
    slug: 'philipp-plein-fw26',
    i18nKey: 'philippPleinFw26',
    coverImage: '/media/garden/philipp-plein-fw26/campaign-01.png',
    coverAlt: 'AI-generated campaign key visual for the FW26 concept study — a couple with a wolf in the snow',
  },
  {
    slug: 'zytouch',
    i18nKey: 'zytouch',
    coverImage: '/media/garden/zytouch/mockup.png',
    coverAlt: 'Cover of the movie Forrest Gump',
  },
  {
    slug: 'anima-digitale',
    i18nKey: 'animaDigitale',
    coverImage: '/media/garden/anima-digitale/cover.png',
    coverAlt: 'Metalic QRcodplate with Anima Digitale logo',
  },
  {
    slug: 'zytro-unreal',
    i18nKey: 'zytroUnreal',
    coverImage: '/media/garden/unreal-archviz/showroom.png',
    coverAlt: 'Unreal Archviz redesign preview',
  },
  {
    slug: 'volunteer',
    i18nKey: 'volunteer',
    coverImage: '/media/garden/volunteer-poster/cover.png',
    coverAlt: 'Volunteer recruitment poster designed for Casa Petronilla in Biasca',
  },
  {
    slug: 'email-template-update',
    i18nKey: 'emailTemplateUpdate',
    coverImage: '/media/garden/email-template-update/cover.png',
    coverAlt: 'Euvetia email template redesign',
  },
  {
    slug: 'content-design',
    i18nKey: 'contentDesign',
    coverImage: '/media/garden/content-design/cover.png',
    coverAlt: 'Instagram mockup',
  },
  {
    slug: 'favorite-door',
    i18nKey: 'favoriteDoor',
    coverImage: '/media/garden/favorite-door/monsters-inc-cover.png',
    coverAlt: 'Monsters Inc. cover',
  },
  {
    slug: 'design-is-like',
    i18nKey: 'designIsLike',
    coverImage: '/media/garden/forrest-bench/cover.png',
    coverAlt: 'Cover of the movie Forrest Gump',
  },
  {
    slug: 'fitts-law',
    i18nKey: 'fittsLaw',
    coverImage: '/media/garden/fitts-law/cover.png',
    coverAlt: 'Intro visual saying that a button speaks even without words',
  },
] as const

export type GardenSlug = (typeof GARDEN_ITEMS)[number]['slug']
export type GardenI18nKey = (typeof GARDEN_ITEMS)[number]['i18nKey']

export function gardenItemBySlug(slug: string) {
  return GARDEN_ITEMS.find((g) => g.slug === slug)
}
