import type { Swiper as SwiperType } from 'swiper'
import type { MaybeRefOrGetter, Ref } from 'vue'

type SwiperRuntime = SwiperType & {
  updateActiveIndex: () => void
}

type MarqueeMetrics = {
  period: number
  minT: number
  maxT: number
}

function getMarqueeWrapPeriod(
  swiper: SwiperType,
  wrapCycleSlideCount?: number,
): number {
  const slides = swiper.slides
  if (!slides?.length || slides.length < 2) return 0

  if (
    wrapCycleSlideCount != null &&
    wrapCycleSlideCount >= 1 &&
    wrapCycleSlideCount < slides.length
  ) {
    const cycleEnd = slides[wrapCycleSlideCount]!
    const first = slides[0]!
    const cycleW = cycleEnd.offsetLeft - first.offsetLeft
    if (cycleW > 0) return cycleW
  }

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

function computeMarqueeMetrics(
  swiper: SwiperType,
  wrapCycleSlideCount?: number,
): MarqueeMetrics {
  return {
    period: getMarqueeWrapPeriod(swiper, wrapCycleSlideCount),
    minT: swiper.minTranslate(),
    maxT: swiper.maxTranslate(),
  }
}

function applyMarqueeWrap(t: number, m: MarqueeMetrics): number {
  const rawPeriod = m.period
  if (rawPeriod <= 0) return t

  const { minT, maxT } = m
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
  marqueeSpeed?: MaybeRefOrGetter<number>
  wheelResumeDelay?: MaybeRefOrGetter<number>
  pauseOnWheel?: MaybeRefOrGetter<boolean>
  directionThresholdPx?: MaybeRefOrGetter<number>
  maxFrameDeltaSec?: MaybeRefOrGetter<number>
  wrapCycleSlideCount?: MaybeRefOrGetter<number | undefined>
}

const defaults = {
  marqueeSpeed: 48,
  wheelResumeDelay: 400,
  pauseOnWheel: true,
  directionThresholdPx: 6,
  maxFrameDeltaSec: 0.07,
} as const

const PASSIVE_SLIDE_SYNC_INTERVAL = 3

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
    wrapCycleSlideCount: toValue(raw.wrapCycleSlideCount) as number | undefined,
  }
}

export function useMarqueeSwiper(
  options?: MaybeRefOrGetter<UseMarqueeSwiperOptions>,
) {
  const autoDirection = ref<1 | -1>(1)
  const wheelPaused = ref(false)
  const gestureActive = ref(false)

  let swiperInstance: SwiperType | null = null
  let rafId: ReturnType<typeof requestAnimationFrame> | null = null
  let lastFrameTime = 0
  let touchStartTranslate = 0
  let wheelResumeTimer: ReturnType<typeof setTimeout> | undefined

  let cachedMarqueeMetrics: MarqueeMetrics | null = null
  let detachMarqueeMetrics: (() => void) | null = null
  let passiveSlideSyncPhase = 0

  function refreshMarqueeMetrics(swiper: SwiperType) {
    const { wrapCycleSlideCount } = resolveOptions(options)
    cachedMarqueeMetrics = computeMarqueeMetrics(swiper, wrapCycleSlideCount)
  }

  function attachMarqueeMetricsListeners(swiper: SwiperType) {
    if (detachMarqueeMetrics) detachMarqueeMetrics()
    const onLayout = () => {
      if (swiperInstance !== swiper || swiper.destroyed) return
      refreshMarqueeMetrics(swiper)
    }
    swiper.on('resize', onLayout)
    swiper.on('observerUpdate', onLayout)
    swiper.on('slidesUpdated', onLayout)
    swiper.on('breakpoint', onLayout)
    detachMarqueeMetrics = () => {
      swiper.off('resize', onLayout)
      swiper.off('observerUpdate', onLayout)
      swiper.off('slidesUpdated', onLayout)
      swiper.off('breakpoint', onLayout)
      detachMarqueeMetrics = null
    }
  }

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
    const s = swiperInstance as SwiperRuntime | null
    if (!s || s.destroyed) return

    const { maxFrameDeltaSec, marqueeSpeed } = resolveOptions(options)
    const dt = Math.min((now - lastFrameTime) / 1000, maxFrameDeltaSec)
    lastFrameTime = now

    if (!gestureActive.value && !wheelPaused.value && dt > 0) {
      if (!cachedMarqueeMetrics) refreshMarqueeMetrics(s)

      const delta = marqueeSpeed * dt * autoDirection.value
      const next = applyMarqueeWrap(
        s.translate - delta,
        cachedMarqueeMetrics!,
      )

      s.wrapperEl.style.transitionDuration = '0ms'
      s.setTranslate(next)

      passiveSlideSyncPhase += 1
      if (passiveSlideSyncPhase % PASSIVE_SLIDE_SYNC_INTERVAL === 0) {
        s.updateActiveIndex()
        s.updateSlidesClasses()
      }
    }
  }

  function onSwiper(swiper: SwiperType) {
    swiperInstance = swiper
    lastFrameTime = performance.now()
    passiveSlideSyncPhase = 0
    attachMarqueeMetricsListeners(swiper)
    refreshMarqueeMetrics(swiper)
    if (rafId != null) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(marqueeTick)
    requestAnimationFrame(() => {
      const s = swiper as SwiperRuntime
      swiper.update()
      refreshMarqueeMetrics(swiper)
      swiper.setTranslate(
        applyMarqueeWrap(swiper.getTranslate(), cachedMarqueeMetrics!),
      )
      swiper.updateProgress()
      s.updateActiveIndex()
      swiper.updateSlidesClasses()
    })
  }

  function onTouchStart(swiper: SwiperType) {
    gestureActive.value = true
    touchStartTranslate = swiper.getTranslate()
  }

  function onTouchEnd(swiper: SwiperType) {
    const s = swiper as SwiperRuntime
    gestureActive.value = false
    passiveSlideSyncPhase = 0
    const { directionThresholdPx } = resolveOptions(options)
    const d = swiper.getTranslate() - touchStartTranslate
    if (Math.abs(d) > directionThresholdPx) {
      autoDirection.value = d < 0 ? 1 : -1
    }
    refreshMarqueeMetrics(swiper)
    swiper.setTranslate(
      applyMarqueeWrap(swiper.getTranslate(), cachedMarqueeMetrics!),
    )
    swiper.updateProgress()
    s.updateActiveIndex()
    swiper.updateSlidesClasses()
  }

  function dispose() {
    detachMarqueeMetrics?.()
    cachedMarqueeMetrics = null
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

export function expandMarqueeSlides<T extends { key: string }>(
  slides: readonly T[],
  loopCopies: number,
): Array<T & { slideKey: string }> {
  const copies = Math.max(1, loopCopies)
  return Array.from({ length: copies }, (_, copyIndex) =>
    slides.map((slide, slideIndex) => ({
      ...slide,
      slideKey: `${slide.key}__${copyIndex}_${slideIndex}`,
    })),
  ).flat()
}
