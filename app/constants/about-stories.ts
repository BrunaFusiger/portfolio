export interface StoryPhoto {
  src: string
  altKey: string
  tooltipKey: string
  left: string
  top: string
  rotation: string
  scratched: boolean
}

export interface TapePosition {
  left: string
  top: string
  rotateDeg: number
}

export const STORY_BRAZIL_MD: readonly StoryPhoto[] = [
  {
    src: '/images/about/brazil-1.jpeg',
    altKey: 'about.photos.brazil1Alt',
    tooltipKey: 'about.tooltips.brazil1',
    left: 'calc(50% - 161.5px)',
    top: 'calc(50% + 41.4px)',
    rotation: '-rotate-3',
    scratched: false,
  },
  {
    src: '/images/about/brazil-2.jpg',
    altKey: 'about.photos.brazil2Alt',
    tooltipKey: 'about.tooltips.brazil2',
    left: 'calc(50% + 9.1px)',
    top: 'calc(50% - 20.71px)',
    rotation: 'rotate-7',
    scratched: false,
  },
  {
    src: '/images/about/brazil-3.jpg',
    altKey: 'about.photos.brazil3Alt',
    tooltipKey: 'about.tooltips.brazil3',
    left: 'calc(50% + 162.57px)',
    top: 'calc(50% + 37.69px)',
    rotation: '-rotate-5',
    scratched: true,
  },
]

export const STORY_BRAZIL_SM: readonly StoryPhoto[] = [
  {
    src: '/images/about/brazil-1.jpeg',
    altKey: 'about.photos.brazil1Alt',
    tooltipKey: 'about.tooltips.brazil1',
    left: 'calc(50% - 118px)',
    top: 'calc(50% + 34px)',
    rotation: '-rotate-3',
    scratched: false,
  },
  {
    src: '/images/about/brazil-2.jpg',
    altKey: 'about.photos.brazil2Alt',
    tooltipKey: 'about.tooltips.brazil2',
    left: 'calc(50% + 4px)',
    top: 'calc(50% - 30px)',
    rotation: 'rotate-7',
    scratched: false,
  },
  {
    src: '/images/about/brazil-3.jpg',
    altKey: 'about.photos.brazil3Alt',
    tooltipKey: 'about.tooltips.brazil3',
    left: 'calc(50% + 120px)',
    top: 'calc(50% + 32px)',
    rotation: '-rotate-5',
    scratched: true,
  },
]

export const STORY_SCHOOL_MD: readonly StoryPhoto[] = [
  {
    src: '/images/about/school-1.jpeg',
    altKey: 'about.photos.school1Alt',
    tooltipKey: 'about.tooltips.school1',
    left: 'calc(50% - 155.5px)',
    top: 'calc(50% + 33.98px)',
    rotation: '-rotate-6',
    scratched: false,
  },
  {
    src: '/images/about/school-2.jpg',
    altKey: 'about.photos.school2Alt',
    tooltipKey: 'about.tooltips.school2',
    left: 'calc(50% + 15.1px)',
    top: 'calc(50% - 28.13px)',
    rotation: 'rotate-7',
    scratched: false,
  },
  {
    src: '/images/about/school-3.jpeg',
    altKey: 'about.photos.school3Alt',
    tooltipKey: 'about.tooltips.school3',
    left: 'calc(50% + 168.57px)',
    top: 'calc(50% + 30.28px)',
    rotation: '-rotate-5',
    scratched: true,
  },
]

export const STORY_SCHOOL_SM: readonly StoryPhoto[] = [
  {
    src: '/images/about/school-1.jpeg',
    altKey: 'about.photos.school1Alt',
    tooltipKey: 'about.tooltips.school1',
    left: 'calc(50% - 114px)',
    top: 'calc(50% + 30px)',
    rotation: '-rotate-3',
    scratched: false,
  },
  {
    src: '/images/about/school-2.jpg',
    altKey: 'about.photos.school2Alt',
    tooltipKey: 'about.tooltips.school2',
    left: 'calc(50% + 6px)',
    top: 'calc(50% - 32px)',
    rotation: 'rotate-7',
    scratched: false,
  },
  {
    src: '/images/about/school-3.jpeg',
    altKey: 'about.photos.school3Alt',
    tooltipKey: 'about.tooltips.school3',
    left: 'calc(50% + 116px)',
    top: 'calc(50% + 28px)',
    rotation: '-rotate-5',
    scratched: true,
  },
]

export const STORY_ALPS_MD: readonly StoryPhoto[] = [
  {
    src: '/images/about/alps-1.jpg',
    altKey: 'about.photos.alps1Alt',
    tooltipKey: 'about.tooltips.alps1',
    left: 'calc(50% - 266.97px)',
    top: 'calc(50% - 9.24px)',
    rotation: 'rotate-[-9.05deg]',
    scratched: false,
  },
  {
    src: '/images/about/alps-2.jpg',
    altKey: 'about.photos.alps2Alt',
    tooltipKey: 'about.tooltips.alps2',
    left: 'calc(50% + 88.27px)',
    top: 'calc(50% + 0.86px)',
    rotation: 'rotate-[5.03deg]',
    scratched: false,
  },
  {
    src: '/images/about/alps-3.jpg',
    altKey: 'about.photos.alps3Alt',
    tooltipKey: 'about.tooltips.alps3',
    left: 'calc(50% - 84.5px)',
    top: 'calc(50% + 18.8px)',
    rotation: 'rotate-0',
    scratched: true,
  },
  {
    src: '/images/about/alps-4.jpg',
    altKey: 'about.photos.alps4Alt',
    tooltipKey: 'about.tooltips.alps4',
    left: 'calc(50% + 270.09px)',
    top: 'calc(50% + 2.8px)',
    rotation: 'rotate-[-3.02deg]',
    scratched: true,
  },
]

export const STORY_ALPS_SM: readonly StoryPhoto[] = [
  {
    src: '/images/about/alps-1.jpg',
    altKey: 'about.photos.alps1Alt',
    tooltipKey: 'about.tooltips.alps1',
    left: 'calc(50% - 204px)',
    top: 'calc(50% - 4px)',
    rotation: 'rotate-[-9.05deg]',
    scratched: false,
  },
  {
    src: '/images/about/alps-2.jpg',
    altKey: 'about.photos.alps2Alt',
    tooltipKey: 'about.tooltips.alps2',
    left: 'calc(50% - 66px)',
    top: 'calc(50% + 6px)',
    rotation: 'rotate-[5.03deg]',
    scratched: false,
  },
  {
    src: '/images/about/alps-3.jpg',
    altKey: 'about.photos.alps3Alt',
    tooltipKey: 'about.tooltips.alps3',
    left: 'calc(50% + 66px)',
    top: 'calc(50% + 20px)',
    rotation: 'rotate-0',
    scratched: true,
  },
  {
    src: '/images/about/alps-4.jpg',
    altKey: 'about.photos.alps4Alt',
    tooltipKey: 'about.tooltips.alps4',
    left: 'calc(50% + 204px)',
    top: 'calc(50% + 4px)',
    rotation: 'rotate-[-3.02deg]',
    scratched: true,
  },
]

export const TAPE_SCHOOL_MD: readonly TapePosition[] = [
  { left: 'calc(50% - 60px)', top: 'calc(50% - 126px)', rotateDeg: -50 },
]

export const TAPE_SCHOOL_SM: readonly TapePosition[] = [
  { left: 'calc(50% - 60px)', top: 'calc(50% - 127px)', rotateDeg: -50 },
]

export const TAPE_ALPS_MD: readonly TapePosition[] = [
  { left: 'calc(50% - 289.96px)', top: 'calc(50% - 102.74px)', rotateDeg: -90 },
  { left: 'calc(50% - 89.96px)', top: 'calc(50% - 78.74px)', rotateDeg: -90 },
  { left: 'calc(50% + 94.04px)', top: 'calc(50% - 94.74px)', rotateDeg: -90 },
  { left: 'calc(50% + 262.04px)', top: 'calc(50% - 94.74px)', rotateDeg: -90 },
]

export const TAPE_ALPS_SM: readonly TapePosition[] = [
  { left: 'calc(50% - 204px)', top: 'calc(50% - 89px)', rotateDeg: -90 },
  { left: 'calc(50% - 66px)', top: 'calc(50% - 89px)', rotateDeg: -90 },
  { left: 'calc(50% + 66px)', top: 'calc(50% - 69px)', rotateDeg: -90 },
  { left: 'calc(50% + 204px)', top: 'calc(50% - 89px)', rotateDeg: -90 },
]
