<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'

export interface BaseMarqueeSwiperSlide {
  /** Stable id for keys and scoped slot identity */
  key: string
  /** Width utilities for `slidesPerView: 'auto'` (e.g. `!w-[200px]`) */
  class?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    slides: BaseMarqueeSwiperSlide[]
    /** Linear auto-scroll speed in px/s */
    marqueeSpeed?: number
    spaceBetween?: number
    centeredSlides?: boolean
    loop?: boolean
    /** Duplicate each slide this many times so Swiper loop stays stable with `auto` widths */
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
    centeredSlides: true,
    loop: true,
    loopCopies: 3,
    loopAdditionalSlides: 2,
    grabCursor: true,
    slideHeightClass: '',
    wheelResumeDelay: 400,
    pauseOnWheel: true,
  },
)

const carouselSlides = computed(() =>
  expandMarqueeSlides(props.slides, props.loopCopies),
)

const { onSwiper, onTouchStart, onTouchEnd, onCarouselWheel } = useMarqueeSwiper(
  () => ({
    marqueeSpeed: props.marqueeSpeed,
    wheelResumeDelay: props.wheelResumeDelay,
    pauseOnWheel: props.pauseOnWheel,
  }),
)
</script>

<template>
  <div v-bind="$attrs" @wheel.passive="onCarouselWheel">
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
