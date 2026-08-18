export type NavSection = 'work' | 'garden' | 'contact'

export const PRIMARY_NAV_ITEMS = [
  { to: '/work', key: 'work' as const, labelKey: 'header.work' as const },
  { to: '/garden', key: 'garden' as const, labelKey: 'header.garden' as const },
  { to: '/contact', key: 'contact' as const, labelKey: 'header.contact' as const },
] as const
