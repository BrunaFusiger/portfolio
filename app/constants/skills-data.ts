export const SKILLS = [
  {
    key: 'userCentered',
    icon: 'user-star',
    slug: 'intentional-design',
    image: '/images/work/euvetia-quiz.webp',
  },
  {
    key: 'designThinking',
    icon: 'search',
    slug: 'design-thinking',
    image: '/images/work/euvetia-design-thinking.webp',
  },
  {
    key: 'b2bSaas',
    icon: 'computer',
    slug: 'zycreate',
    image: '/images/work/zycreate.webp',
  },
  {
    key: 'startupPace',
    icon: 'rocket',
    slug: 'zyhub',
    image: '/images/work/zyhub.webp',
  },
  {
    key: 'figmaMcp',
    icon: 'ai',
    slug: 'figma-mcp',
    image: '/images/work/design-system.webp',
  },
  {
    key: 'designSystems',
    icon: 'grid',
    slug: 'seasonal-planting',
    image: '/images/work/swissonal.webp',
  },
] as const

export type SkillIconName = (typeof SKILLS)[number]['icon']
