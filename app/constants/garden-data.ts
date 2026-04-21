/** All garden slugs (/garden index + SectionGarden marquee on home). */
export const GARDEN_ITEMS = [
  {
    slug: 'zytro-unreal',
    i18nKey: 'zytroUnreal',
    coverImage: '/media/garden/unreal-archviz/showroom.png',
    coverAlt: 'Unreal Archviz redesign preview',
  },
] as const

export type GardenSlug = (typeof GARDEN_ITEMS)[number]['slug']

export function gardenItemBySlug(slug: string) {
  return GARDEN_ITEMS.find((g) => g.slug === slug)
}

export function isGardenSlug(slug: string): slug is GardenSlug {
  return GARDEN_ITEMS.some((g) => g.slug === slug)
}
