<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import type { BaseMarqueeSwiperSlide } from '~/types/marquee'
import 'swiper/css'

defineOptions({ inheritAttrs: false })

/** Track must be much wider than the viewport so FreeMode never shows empty gutters. */
const VIEWPORT_TO_TRACK_MULT = 2.9
/** Lower bound on average slide width (px) when measuring viewport only; avoids too-few copies. */
const MIN_ASSUMED_SLIDE_PX = 130

const props = withDefaults(
  defineProps<{
    slides: BaseMarqueeSwiperSlide[]
    /** Linear auto-scroll speed in px/s */
    marqueeSpeed?: number
    spaceBetween?: number
    centeredSlides?: boolean
    loop?: boolean
    /**
     * Repeat the full slide list this many times so the track is wider than the viewport
     * (`slides-per-view="auto"`); too few copies can leave empty gutters on wide screens.
     */
    loopCopies?: number
    loopAdditionalSlides?: number
    grabCursor?: boolean
    /** Applied to every `SwiperSlide` (e.g. fixed height) */
    slideHeightClass?: string
    /** Resume auto-scroll after wheel ends */
    wheelResumeDelay?: number
    pauseOnWheel?: boolean
  }>(),
  {
    marqueeSpeed: 48,
    spaceBetween: 16,
    /** Edge-to-edge marquee: centered mode leaves empty gutters when the strip is shorter than the viewport. */
    centeredSlides: false,
    /** Swiper `loop` does not run during RAF `setTranslate`; use `false` + wrap in `useMarqueeSwiper`. */
    loop: false,
    loopCopies: 8,
    loopAdditionalSlides: 0,
    grabCursor: true,
    slideHeightClass: '',
    wheelResumeDelay: 400,
    pauseOnWheel: true,
  },
)

const rootEl = ref<HTMLElement | null>(null)
const viewportW = ref(0)
let viewportObserver: ResizeObserver | null = null

onMounted(() => {
  viewportObserver = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect.width
    viewportW.value = w ? Math.ceil(w) : 0
  })
  if (rootEl.value) {
    viewportObserver.observe(rootEl.value)
    viewportW.value = Math.ceil(rootEl.value.getBoundingClientRect().width)
  }
})

onBeforeUnmount(() => {
  viewportObserver?.disconnect()
  viewportObserver = null
})

const effectiveLoopCopies = computed(() => {
  const n = Math.max(1, props.slides.length)
  const denom = n * MIN_ASSUMED_SLIDE_PX
  const vp = viewportW.value
  const fromViewport =
    vp > 0
      ? Math.ceil((vp * VIEWPORT_TO_TRACK_MULT) / denom)
      : Math.ceil((1400 * VIEWPORT_TO_TRACK_MULT) / denom)
  return Math.max(props.loopCopies, fromViewport)
})

const carouselSlides = computed(() =>
  expandMarqueeSlides(props.slides, effectiveLoopCopies.value),
)

const { onSwiper, onTouchStart, onTouchEnd, onCarouselWheel } = useMarqueeSwiper(
  () => ({
    marqueeSpeed: props.marqueeSpeed,
    wheelResumeDelay: props.wheelResumeDelay,
    pauseOnWheel: props.pauseOnWheel,
    wrapCycleSlideCount: props.slides.length,
  }),
)
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    class="marquee-swiper min-w-0 w-full overflow-x-clip overflow-y-visible py-10 md:py-14"
    @wheel.passive="onCarouselWheel"
  >
    <Swiper
      v-if="slides.length > 0"
      :modules="[FreeMode]"
      slides-per-view="auto"
      :space-between="spaceBetween"
      :centered-slides="centeredSlides"
      :loop="loop"
      :loop-additional-slides="loopAdditionalSlides"
      :grab-cursor="grabCursor"
      :watch-slides-progress="true"
      :free-mode="{
        enabled: true,
        momentum: false,
        sticky: false,
      }"
      class="w-full"
      @swiper="onSwiper"
      @touch-start="onTouchStart"
      @touch-end="onTouchEnd"
    >
      <SwiperSlide
        v-for="slide in carouselSlides"
        :key="slide.slideKey"
        :class="[slide.class, slideHeightClass]"
      >
        <slot
          :slide="{
            key: slide.key,
            class: slide.class ?? '',
          }"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
/*
 * Swiper ships `.swiper { overflow: hidden }`, which clips box-shadows on slides.
 * `overflow-x-hidden` on an ancestor also forces `overflow-y: auto`, clipping top/bottom shadow.
 * Match BaseMediaCarousel: horizontal containment on the outer wrapper only, visible on Swiper.
 */
.marquee-swiper :deep(.swiper),
.marquee-swiper :deep(.swiper-wrapper) {
  overflow: visible;
}
</style>
