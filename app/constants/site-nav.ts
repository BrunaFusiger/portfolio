export type NavSection = 'work' | 'garden' | 'contact'

export const PRIMARY_NAV_ITEMS = [
  { to: '/work', key: 'work' as const, label: 'work' },
  { to: '/garden', key: 'garden' as const, label: 'garden' },
  { to: '/contact', key: 'contact' as const, label: 'contact' },
] as const
