/** All garden slugs (/garden index + SectionGarden marquee on home). */
export const GARDEN_ITEMS = [
  {
    slug: 'philipp-plein-fw26',
    title: 'Philipp Plein FW26',
    tags: 'Generative AI · Creative Direction',
    seoDescription: 'Self-initiated generative-AI campaign study for Philipp Plein FW26—AI-produced launch film, editorials and packshots under human creative direction, with research-backed UX improvements. Concept study by Bruna Fusiger.',
    coverImage: '/media/garden/philipp-plein-fw26/campaign-01.png',
    coverAlt: 'AI-generated campaign key visual for the FW26 concept study — a couple with a wolf in the snow',
  },
  {
    slug: 'zytouch',
    title: 'ZYtouch',
    tags: 'Graphic Design · Innovation',
    seoDescription: 'Interactive physical portfolio for Zytro—100+ printed pages, embedded circuits, and a connected app. Graphic design and cross-functional innovation by Bruna Fusiger.',
    coverImage: '/media/garden/zytouch/mockup.png',
    coverAlt: 'Cover of the movie Forrest Gump',
  },
  {
    slug: 'anima-digitale',
    title: 'Anima Digitale',
    tags: 'MVP · Product Experiment',
    seoDescription: '2024 MVP: digital memorial product in Switzerland—metal QR plaque meets online tribute. Product thinking and UX by Bruna Fusiger.',
    coverImage: '/media/garden/anima-digitale/cover.png',
    coverAlt: 'Metalic QRcodplate with Anima Digitale logo',
  },
  {
    slug: 'zytro-unreal',
    title: 'Unreal Archviz',
    tags: 'Redesign · Figma · UI',
    seoDescription: 'Unreal Engine ArchViz UI redesign for Zytro—touchscreen showroom experiences, clearer branding, premium presentation. UI design by Bruna Fusiger.',
    coverImage: '/media/garden/unreal-archviz/showroom.png',
    coverAlt: 'Unreal Archviz redesign preview',
  },
  {
    slug: 'volunteer',
    title: 'Recruitment Poster',
    tags: 'Graphic Design · Volunteer Work',
    seoDescription: 'Volunteer recruitment poster for Casa Petronilla in Biasca—research-driven design that makes helping feel human and approachable. Graphic design by Bruna Fusiger.',
    coverImage: '/media/garden/volunteer-poster/cover.png',
    coverAlt: 'Volunteer recruitment poster designed for Casa Petronilla in Biasca',
  },
  {
    slug: 'email-template-update',
    title: 'Email Templates',
    tags: 'Email Design · Mailjet',
    seoDescription: 'Euvetia email template redesign making common product touchpoints feel more branded, modern, and intentional. Email design and brand system work by Bruna Fusiger.',
    coverImage: '/media/garden/email-template-update/cover.png',
    coverAlt: 'Euvetia email template redesign',
  },
  {
    slug: 'content-design',
    title: 'Creative Direction',
    tags: 'Strategy · Social Content',
    seoDescription: 'Content design and video editing for a Brazilian audience interested in Switzerland. Social content creation and analytics by Bruna Fusiger.',
    coverImage: '/media/garden/content-design/cover.png',
    coverAlt: 'Instagram mockup',
  },
  {
    slug: 'favorite-door',
    title: 'Favorite Door',
    tags: 'Google Stitch · Inspo',
    seoDescription: 'Portfolio contact UX inspired by Monsters, Inc. doors—pick a path, not a boring link list. Explored with Google Stitch by Bruna Fusiger.',
    coverImage: '/media/garden/favorite-door/monsters-inc-cover.png',
    coverAlt: 'Monsters Inc. cover',
  },
  {
    slug: 'design-is-like',
    title: 'Design is like...',
    tags: 'Microinteraction · Inspo',
    seoDescription: 'Behind my portfolio footer: a Forrest Gump–inspired chocolate-box microinteraction. Personal reference and design inspo by Bruna Fusiger.',
    coverImage: '/media/garden/forrest-bench/cover.png',
    coverAlt: 'Cover of the movie Forrest Gump',
  },
  {
    slug: 'fitts-law',
    title: "Fitts' Law",
    tags: 'Laws of UX · UX Psychology',
    seoDescription: "Fitts's Law in practice—why target size and distance shape buttons and mobile UX. Notes from Laws of UX by Bruna Fusiger.",
    coverImage: '/media/garden/fitts-law/cover.png',
    coverAlt: 'Intro visual saying that a button speaks even without words',
  },
] as const

export type GardenSlug = (typeof GARDEN_ITEMS)[number]['slug']

export function gardenItemBySlug(slug: string) {
  return GARDEN_ITEMS.find((g) => g.slug === slug)
}
