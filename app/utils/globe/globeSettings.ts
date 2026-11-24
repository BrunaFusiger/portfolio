type Rgb = [number, number, number]

const GREY: Rgb = [0.541, 0.541, 0.541]
const PAPER: Rgb = [1, 1, 1]
const BRAND_RED: Rgb = [0.902, 0.188, 0.133]

export const GLOBE_LOOK = {
  dark: 0,
  diffuse: 1.2,
  mapBrightness: 0.5,
  mapBaseBrightness: 0,
  baseColor: PAPER,
  glowColor: PAPER,
  markerColor: BRAND_RED,
  markerElevation: 0.02,
  opacity: 0.9,
} as const

export const GLOBE_MAP_SAMPLES = { phone: 10000, desktop: 18000 } as const

export const GLOBE_MAX_PIXEL_RATIO = { phone: 1.5, desktop: 2 } as const

export const GLOBE_MARKER = {
  activeSize: 0.025,
  idleSize: 0.015,
  activeColor: BRAND_RED,
  idleColor: GREY,
} as const

export const GLOBE_FLIGHT = {
  duration: 1.1,
  ease: 'power2.inOut',
  overviewScale: 1,
  longHopRadians: 0.35,
} as const

export const GLOBE_PHONE_QUERY = '(max-width: 767px)'
