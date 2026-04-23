import type { Swiper as SwiperType } from 'swiper'
import {
  onBeforeUnmount,
  readonly,
  ref,
  toValue,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

/** Swiper runtime exposes this; it is missing from published types. */
type SwiperRuntime = SwiperType & {
  updateActiveIndex: () => void
}

/**
 * Pixel distance for one seamless step of the marquee (adjacent slides), or the full
 * track when slide widths vary (e.g. multiple logical items with different widths).
 */
function getMarqueeWrapPeriod(swiper: SwiperType): number {
  const slides = swiper.slides
  if (!slides?.length || slides.length < 2) return 0

  const d0 = slides[1]!.offsetLeft - slides[0]!.offsetLeft
  if (d0 <= 0) return 0

  const sampleCount = Math.min(slides.length - 1, 16)
  for (let i = 1; i < sampleCount; i += 1) {
    const d = slides[i + 1]!.offsetLeft - slides[i]!.offsetLeft
    if (Math.abs(d - d0) > 2) {
      const first = slides[0]!
      const last = slides[slides.length - 1]!
      return last.offsetLeft + last.offsetWidth - first.offsetLeft
    }
  }

  return d0
}

/** Keep manual FreeMode translate inside Swiper bounds; loopFix never runs for RAF ticks. */
function wrapMarqueeTranslate(swiper: SwiperType, t: number): number {
  const rawPeriod = getMarqueeWrapPeriod(swiper)
  if (rawPeriod <= 0) return t

  const minT = swiper.minTranslate()
  const maxT = swiper.maxTranslate()
  const span = minT - maxT
  if (!Number.isFinite(span) || span <= 0) return t

  const period = Math.min(rawPeriod, span)
  let out = t
  let guard = 0
  while (out < maxT && guard < 512) {
    out += period
    guard += 1
  }
  guard = 0
  while (out > minT && guard < 512) {
    out -= period
    guard += 1
  }
  return out
}

export interface UseMarqueeSwiperOptions {
  /** Linear auto-scroll speed in px/s */
  marqueeSpeed?: MaybeRefOrGetter<number>
  /** ms after last wheel before marquee resumes */
  wheelResumeDelay?: MaybeRefOrGetter<number>
  pauseOnWheel?: MaybeRefOrGetter<boolean>
  /** Min drag delta (px) to flip auto direction */
  directionThresholdPx?: MaybeRefOrGetter<number>
  /** Cap frame delta when tab is backgrounded */
  maxFrameDeltaSec?: MaybeRefOrGetter<number>
}

const defaults = {
  marqueeSpeed: 48,
  wheelResumeDelay: 400,
  pauseOnWheel: true,
  directionThresholdPx: 6,
  maxFrameDeltaSec: 0.07,
} as const

function resolveOptions(
  source: MaybeRefOrGetter<UseMarqueeSwiperOptions> | undefined,
) {
  const raw = toValue(source) ?? {}
  return {
    marqueeSpeed: toValue(raw.marqueeSpeed ?? defaults.marqueeSpeed),
    wheelResumeDelay: toValue(raw.wheelResumeDelay ?? defaults.wheelResumeDelay),
    pauseOnWheel: toValue(raw.pauseOnWheel ?? defaults.pauseOnWheel),
    directionThresholdPx: toValue(
      raw.directionThresholdPx ?? defaults.directionThresholdPx,
    ),
    maxFrameDeltaSec: toValue(raw.maxFrameDeltaSec ?? defaults.maxFrameDeltaSec),
  }
}

/**
 * Linear marquee behavior for Swiper (FreeMode + manual translate loop).
 * Wire returned handlers to `<Swiper @swiper @touch-start @touch-end>` and
 * `@wheel.passive` on a wrapper when `pauseOnWheel` is true.
 */
export function useMarqueeSwiper(
  options?: MaybeRefOrGetter<UseMarqueeSwiperOptions>,
) {
  /** 1 = translate decreases (content moves left). */
  const autoDirection = ref<1 | -1>(1)
  const wheelPaused = ref(false)
  const gestureActive = ref(false)

  let swiperInstance: SwiperType | null = null
  let rafId: ReturnType<typeof requestAnimationFrame> | null = null
  let lastFrameTime = 0
  let touchStartTranslate = 0
  let wheelResumeTimer: ReturnType<typeof setTimeout> | undefined

  function clearWheelResume() {
    if (wheelResumeTimer !== undefined) {
      clearTimeout(wheelResumeTimer)
      wheelResumeTimer = undefined
    }
  }

  function scheduleWheelResume() {
    clearWheelResume()
    const delay = resolveOptions(options).wheelResumeDelay
    wheelResumeTimer = setTimeout(() => {
      wheelPaused.value = false
      wheelResumeTimer = undefined
    }, delay)
  }

  function onCarouselWheel() {
    const { pauseOnWheel } = resolveOptions(options)
    if (!pauseOnWheel) return
    wheelPaused.value = true
    scheduleWheelResume()
  }

  function marqueeTick(now: number) {
    rafId = requestAnimationFrame(marqueeTick)
    const swiper = swiperInstance as SwiperRuntime | null
    if (!swiper || swiper.destroyed) return

    const { maxFrameDeltaSec, marqueeSpeed } = resolveOptions(options)
    const dt = Math.min((now - lastFrameTime) / 1000, maxFrameDeltaSec)
    lastFrameTime = now

    if (!gestureActive.value && !wheelPaused.value && dt > 0) {
      const delta = marqueeSpeed * dt * autoDirection.value
      swiper.wrapperEl.style.transitionDuration = '0ms'
      const next = wrapMarqueeTranslate(swiper, swiper.getTranslate() - delta)
      swiper.setTranslate(next)
      swiper.updateProgress()
      swiper.updateActiveIndex()
      swiper.updateSlidesClasses()
    }
  }

  function onSwiper(swiper: SwiperType) {
    swiperInstance = swiper
    lastFrameTime = performance.now()
    if (rafId != null) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(marqueeTick)
    requestAnimationFrame(() => {
      swiper.update()
      swiper.setTranslate(wrapMarqueeTranslate(swiper, swiper.getTranslate()))
      swiper.updateProgress()
      swiper.updateActiveIndex()
      swiper.updateSlidesClasses()
    })
  }

  function onTouchStart(swiper: SwiperType) {
    gestureActive.value = true
    touchStartTranslate = swiper.getTranslate()
  }

  function onTouchEnd(swiper: SwiperType) {
    gestureActive.value = false
    const { directionThresholdPx } = resolveOptions(options)
    const d = swiper.getTranslate() - touchStartTranslate
    if (Math.abs(d) > directionThresholdPx) {
      autoDirection.value = d < 0 ? 1 : -1
    }
    swiper.setTranslate(wrapMarqueeTranslate(swiper, swiper.getTranslate()))
    swiper.updateProgress()
    swiper.updateActiveIndex()
    swiper.updateSlidesClasses()
  }

  function dispose() {
    if (rafId != null) cancelAnimationFrame(rafId)
    rafId = null
    swiperInstance = null
    clearWheelResume()
  }

  onBeforeUnmount(dispose)

  return {
    autoDirection: readonly(autoDirection) as Readonly<Ref<1 | -1>>,
    wheelPaused: readonly(wheelPaused),
    gestureActive: readonly(gestureActive),
    onSwiper,
    onTouchStart,
    onTouchEnd,
    onCarouselWheel,
    dispose,
  }
}

/**
 * Duplicate slides for Swiper `loop` + `slidesPerView: 'auto'` (stable loop).
 */
export function expandMarqueeSlides<T extends { key: string }>(
  slides: readonly T[],
  loopCopies: number,
): Array<T & { slideKey: string }> {
  return slides.flatMap((slide) =>
    Array.from({ length: loopCopies }, (_, i) => ({
      ...slide,
      slideKey: `${slide.key}__${i}`,
    })),
  )
}
