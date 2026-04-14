export const SKILLS = [
  {
    key: 'userCentered',
    icon: 'user-star',
    slug: 'intentional-design',
    image: '/media/work/euvetia-quiz.webp',
  },
  {
    key: 'designThinking',
    icon: 'search',
    slug: 'design-thinking',
    image: '/media/work/euvetia-design-thinking.webp',
  },
  {
    key: 'b2bSaas',
    icon: 'computer',
    slug: 'zycreate',
    image: '/media/work/zycreate.webp',
  },
  {
    key: 'startupPace',
    icon: 'rocket',
    slug: 'zyhub',
    image: '/media/work/zyhub.webp',
  },
  {
    key: 'figmaMcp',
    icon: 'ai',
    slug: 'figma-mcp',
    image: '/media/work/design-system.webp',
  },
  {
    key: 'designSystems',
    icon: 'grid',
    slug: 'seasonal-planting',
    image: '/media/work/swissonal.webp',
  },
] as const

export type SkillIconName = (typeof SKILLS)[number]['icon']
