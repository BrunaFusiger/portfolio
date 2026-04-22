export const SKILLS = [
  {
    key: 'userCentered',
    icon: 'user-star',
    slug: 'euvetia-permit-checker',
    image: '/media/work/euvetia-quiz.webp',
  },
  {
    key: 'designThinking',
    icon: 'search',
    slug: 'euvetia-platform',
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
    slug: 'euvetia-permit-checker',
    image: '/media/work/design-system.webp',
  },
  {
    key: 'designSystems',
    icon: 'grid',
    slug: 'swissonal',
    image: '/media/work/swissonal.webp',
  },
] as const

export type SkillIconName = (typeof SKILLS)[number]['icon']
