import type GSAP from 'gsap'

export type GsapTimeline = ReturnType<GSAP['timeline']>

type ScrollTriggerCtor = (typeof import('gsap/ScrollTrigger'))['ScrollTrigger']

export type GsapBundle = {
  gsap: GSAP
  ScrollTrigger: ScrollTriggerCtor
}

let clientBundle: Promise<GsapBundle> | null = null

function normalizeGsap(mod: typeof import('gsap').default & { default?: typeof import('gsap').default }) {
  return mod.default ?? mod
}

/**
 * Lazy-loads GSAP + ScrollTrigger once (client-only). Keeps animation code in a
 * separate chunk so initial JS parses faster; call early (e.g. via `useGsap()`)
 * so the request overlaps with paint.
 */
export function loadGsap(): Promise<GsapBundle> {
  if (!import.meta.client) {
    return Promise.reject(new Error('GSAP is client-only'))
  }

  clientBundle ??= (async () => {
    const [gsapMod, scrollMod] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])

    const gsap = normalizeGsap(gsapMod.default)
    const { ScrollTrigger } = scrollMod
    gsap.registerPlugin(ScrollTrigger)

    return { gsap, ScrollTrigger }
  })()

  return clientBundle
}

export function prefetchGsap() {
  if (import.meta.client) void loadGsap()
}

export const useGsap = () => {
  prefetchGsap()
  return { loadGsap }
}
