/** All garden slugs (/garden index + SectionGarden marquee on home). */
export const GARDEN_ITEMS = [
  {
    slug: 'zytro-unreal',
    i18nKey: 'zytroUnreal',
    coverImage: '/media/garden/unreal-archviz/showroom.png',
    coverAlt: 'Unreal Archviz redesign preview',
  },
  {
    slug: 'favorite-door',
    i18nKey: 'favoriteDoor',
    coverImage: '/media/garden/favorite-door/monsters-inc-cover.png',
    coverAlt: 'Monsters Inc. cover',
  },
  {
    slug: 'anima-digitale',
    i18nKey: 'animaDigitale',
    coverImage: '/media/garden/anima-digitale/cover.png',
    coverAlt: 'Metalic QRcodplate with Anima Digitale logo',
  },
] as const

export type GardenSlug = (typeof GARDEN_ITEMS)[number]['slug']
export type GardenI18nKey = (typeof GARDEN_ITEMS)[number]['i18nKey']

export function gardenItemBySlug(slug: string) {
  return GARDEN_ITEMS.find((g) => g.slug === slug)
}

export function isGardenSlug(slug: string): slug is GardenSlug {
  return GARDEN_ITEMS.some((g) => g.slug === slug)
}
