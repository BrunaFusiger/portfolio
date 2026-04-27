/** `4/5` matches common feed posts (e.g. 1080×1350). */
export type MediaAspect = '16/9' | '4/3' | '4/5' | 'square' | '9/16' | 'auto'
export type MediaVariant = 'default' | 'device' | 'bare'
export type MediaMaxWidth = 'xs' | 'sm' | 'md'
export type MediaMaxHeight = 'xs' | 'sm' | 'md' | 'xl'

export interface ScreenInset {
  top?: number
  left?: number
  right?: number
  bottom?: number
}

export interface CaseStudyStat {
  value: string
  description: string
}

export interface CaseStudyProcessStep {
  title: string
  text?: string
  items?: string[]
}

export interface CaseStudyScrollytellingItem {
  title: string
  label: string
  image: string
}

export interface HeadingBlock { type: 'heading'; text: string }
export interface SubheadingBlock { type: 'subheading'; text: string }
export interface ScrollytellingBlock { type: 'scrollytelling' }
export interface InlineTagsBlock { type: 'inlineTags'; items: string[] }
export interface ProseBlock { type: 'prose'; paragraphs: string[] }
export interface BracketBlock {
  type: 'bracketBlock'
  paragraphs?: string[]
  /** Omitted or empty = brace + prose only. */
  stats?: CaseStudyStat[]
}
export interface StatBlock { type: 'stat'; value: string; description: string }
export interface BulletsBlock { type: 'bullets'; items: string[] }
export interface HighlightedBlock { type: 'highlighted'; text: string }
export interface DisclaimerBlock { type: 'disclaimer'; text: string }
export interface MediaBlock {
  type: 'media'
  src?: string
  alt?: string
  caption?: string
  placeholderLabel?: string
  aspect?: MediaAspect
  variant?: MediaVariant
  rounded?: boolean
  maxWidth?: MediaMaxWidth
  /** Capped frame height with top-cropped cover (same behavior as `beforeAfter` with `maxHeight`). */
  maxHeight?: MediaMaxHeight
}

export interface MediaCarouselSlide {
  src: string
  alt: string
  caption?: string
}

export interface MediaCarouselBlock {
  type: 'mediaCarousel'
  slides: MediaCarouselSlide[]
  aspect?: MediaAspect
  variant?: MediaVariant
  rounded?: boolean
}
export interface BeforeAfterBlock {
  type: 'beforeAfter'
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  beforeLabel?: string
  afterLabel?: string
  caption?: string
  aspect?: MediaAspect
  variant?: MediaVariant
  maxHeight?: MediaMaxHeight
}
export interface ComputerMockupBlock {
  type: 'computerMockup'
  mockupSrc?: string
  screenImageSrc?: string
  screenVideoSrc?: string
  alt?: string
  caption?: string
  screenInset?: ScreenInset
}
export interface ProcessBlock { type: 'process'; steps: CaseStudyProcessStep[] }
export interface LottieBlock { type: 'lottie'; src: string }
export interface VideoBlock {
  type: 'video'
  src?: string
  alt?: string
  caption?: string
  placeholderLabel?: string
  poster?: string
  priority?: boolean
  aspect?: MediaAspect
  variant?: MediaVariant
  maxWidth?: MediaMaxWidth
}
export interface SectionBreakBlock { type: 'sectionBreak' }

export type CaseStudyBlock =
  | HeadingBlock
  | SubheadingBlock
  | ScrollytellingBlock
  | InlineTagsBlock
  | ProseBlock
  | BracketBlock
  | StatBlock
  | BulletsBlock
  | HighlightedBlock
  | DisclaimerBlock
  | MediaBlock
  | MediaCarouselBlock
  | BeforeAfterBlock
  | ComputerMockupBlock
  | ProcessBlock
  | LottieBlock
  | VideoBlock
  | SectionBreakBlock
