export type CaseStudyAspect = '16/9' | '4/3' | '4/5' | 'square' | '9/16' | 'auto'
export type CaseStudyMaxHeight = 'xs' | 'sm' | 'md' | 'xl'
export type CaseStudyMaxWidth = 'xs' | 'sm' | 'md' | 'lg'

export const CASE_STUDY_MAX_H_REM = {
  xs: '12rem',
  sm: '16rem',
  md: '20rem',
  xl: '60rem',
} as const satisfies Record<CaseStudyMaxHeight, string>

export function caseStudyAspectClass(aspect: CaseStudyAspect | undefined): string {
  switch (aspect) {
    case '4/3':
      return 'aspect-[4/3]'
    case '4/5':
      return 'aspect-[4/5]'
    case 'square':
      return 'aspect-square'
    case '9/16':
      return 'aspect-[9/16]'
    case 'auto':
      return ''
    default:
      return 'aspect-video'
  }
}

export function caseStudyAspectRatioWH(aspect: CaseStudyAspect | undefined): [number, number] {
  switch (aspect) {
    case '4/3':
      return [4, 3]
    case '4/5':
      return [4, 5]
    case 'square':
      return [1, 1]
    case '9/16':
      return [9, 16]
    case 'auto':
      return [16, 9]
    default:
      return [16, 9]
  }
}

export function caseStudyMaxHeightClass(maxHeight: CaseStudyMaxHeight | undefined): string {
  switch (maxHeight) {
    case 'xs':
      /* Preflight `.case-study-mh-*` — `h-48`/`h-64`/… are not emitted when only returned from TS (Uno scan). */
      return 'case-study-mh-xs'
    case 'sm':
      return 'case-study-mh-sm'
    case 'md':
      return 'case-study-mh-md'
    case 'xl':
      return 'case-study-mh-xl'
    default:
      return ''
  }
}

/**
 * Width cap for inner media wrappers. Pair with `<figure class="… flex flex-col items-center">` when `variant: bare`
 * so children center under the column `flex-col` parents in `work/[slug].vue` (`mx-auto` on a block `<figure>` does not).
 */
export function caseStudyMaxWidthClass(maxWidth: CaseStudyMaxWidth | undefined): string {
  switch (maxWidth) {
    case 'xs':
      return 'w-full min-w-0 case-study-mw-xs'
    case 'sm':
      return 'w-full min-w-0 case-study-mw-sm'
    case 'md':
      return 'w-full min-w-0 case-study-mw-md'
    case 'lg':
      return 'w-full min-w-0 case-study-mw-lg'
    default:
      return ''
  }
}

export const caseStudyMediaStripeStyle = {
  background:
    'repeating-linear-gradient(135deg, transparent, transparent 10px, color-mix(in srgb, var(--color-text-default) 6%, transparent) 10px, color-mix(in srgb, var(--color-text-default) 6%, transparent) 11px)',
} as const
