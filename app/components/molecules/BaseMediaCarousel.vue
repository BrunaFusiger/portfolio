<script setup lang="ts">
import type { Swiper as SwiperClass } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Pagination } from 'swiper/modules'
import type { MediaAspect, MediaVariant, MediaCarouselSlide } from '~/types/case-study'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    slides: MediaCarouselSlide[]
    aspect?: MediaAspect
    variant?: MediaVariant
    rounded?: boolean
  }>(),
  {
    aspect: '16/9',
    variant: 'bare',
    rounded: true,
  },
)

const reducedMotion = useReducedMotion()
const activeIndex = ref(0)
const localePath = useLocalePath()
const { t } = useI18n()

/** Pagination only; prev/next use manual `slidePrev` / `slideNext` so Swiper never injects extra nav UI. */
const carouselUid = useId().replace(/:/g, '')
const paginationSelector = `.media-carousel__pagination--${carouselUid}`

const paginationOptions = computed(() => ({
  clickable: true,
  el: paginationSelector,
  bulletClass: 'media-carousel__bullet',
  bulletActiveClass: 'media-carousel__bullet--active',
}))

const modules = computed(() =>
  reducedMotion.value ? [Pagination] : [EffectCoverflow, Pagination],
)

const swiperRef = shallowRef<SwiperClass | null>(null)
const navPrevDisabled = ref(false)
const navNextDisabled = ref(false)

function syncNavDisabled(s: SwiperClass) {
  navPrevDisabled.value = s.isBeginning
  navNextDisabled.value = s.isEnd
}

function onSwiper(s: SwiperClass) {
  swiperRef.value = s
  syncNavDisabled(s)
}

function slidePrev() {
  swiperRef.value?.slidePrev()
}

function slideNext() {
  swiperRef.value?.slideNext()
}

const swiperEffect = computed(() => (reducedMotion.value ? 'slide' : 'coverflow'))

const coverflowEffect = computed(() =>
  reducedMotion.value
    ? { rotate: 0, stretch: 0, depth: 0, modifier: 1, slideShadows: false }
    : { rotate: 22, stretch: 20, depth: 220, modifier: 1.08, slideShadows: false },
)

const speed = computed(() => (reducedMotion.value ? 160 : 520))

function linkDisplayLabel(label: string) {
  return caseStudyLinkDisplayLabel(label, t('work.linkHere'))
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href)
}

/** 1080×1350-style feed frame: portrait 4:5, capped to column width (same grid as garden body). */
const postFrameStyle = computed(() => {
  if (props.aspect !== '4/5')
    return undefined
  return {
    aspectRatio: '4 / 5',
    maxHeight: 'min(85svh, 1350px)',
    width: 'min(100%, calc(min(85svh, 1350px) * 4 / 5))',
    marginLeft: 'auto',
    marginRight: 'auto',
  } as const
})

const aspectClass = computed(() => {
  switch (props.aspect) {
    case '4/3':
      return 'aspect-[4/3]'
    case '4/5':
      return ''
    case 'square':
      return 'aspect-square'
    case '9/16':
      return 'aspect-[9/16]'
    case 'auto':
      return 'min-h-[200px]'
    default:
      return 'aspect-video'
  }
})

const activeCaption = computed(() => props.slides[activeIndex.value]?.caption?.trim() ?? '')
const captionSegments = computed(() => parseCaseStudyMarkdown(activeCaption.value))

function onSlideChange(swiper: SwiperClass) {
  activeIndex.value = swiper.activeIndex
  syncNavDisabled(swiper)
}

const figureClass = computed(() => {
  if (props.variant === 'bare') return 'w-full'
  if (props.variant === 'device') {
    return 'w-full overflow-hidden border border-surface-border bg-surface-subtle rounded-[32px] flex flex-col items-center p-6 md:p-8'
  }
  return 'w-full overflow-hidden border border-surface-border bg-surface-subtle rounded-[32px]'
})

const roundedInner = computed(() =>
  props.rounded ? 'overflow-hidden rounded-[24px] md:rounded-[32px]' : 'overflow-hidden',
)

const showCaption = computed(() => captionSegments.value.length > 0)

/** Fewer “slots” in view so the active slide uses more width (still peeks neighbors). */
const slidesPerViewBreakpoints = {
  0: { slidesPerView: 1.08, spaceBetween: 10 },
  520: { slidesPerView: 1.22, spaceBetween: 12 },
  768: { slidesPerView: 1.42, spaceBetween: 14 },
  1024: { slidesPerView: 1.58, spaceBetween: 16 },
  1280: { slidesPerView: 1.72, spaceBetween: 18 },
} as const
</script>

<template>
  <figure :class="figureClass">
    <!-- Stays within page `section-grid` / `col-main` like other garden blocks -->
    <div class="media-carousel relative w-full px-1 sm:px-2 pb-12">
      <Swiper
        class="media-carousel__swiper w-full rounded-[20px] md:rounded-[28px]"
        :modules="modules"
        :effect="swiperEffect"
        :coverflow-effect="coverflowEffect"
        :grab-cursor="true"
        :centered-slides="true"
        :slides-per-view="1.08"
        :space-between="10"
        :pagination="paginationOptions"
        :speed="speed"
        :breakpoints="slidesPerViewBreakpoints"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide
          v-for="(slide, i) in slides"
          :key="`${slide.src}-${i}`"
          class="!h-auto overflow-visible"
        >
          <div
            class="media-carousel__slide-inner relative mx-auto w-full overflow-hidden bg-surface-subtle transition-[filter,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            :class="[
              roundedInner,
              aspect === '4/5' ? '' : aspectClass,
            ]"
            :style="postFrameStyle"
          >
            <NuxtImg
              :src="slide.src"
              :alt="slide.alt"
              v-bind="nuxtImgRasterDefaults"
              class="absolute inset-0 size-full object-contain"
              sizes="100vw md:896px"
              loading="lazy"
            />
          </div>
        </SwiperSlide>
      </Swiper>

      <BaseIconDisk
        as="button"
        size="lg"
        interaction="button"
        variant="fab"
        :class="[
          'absolute left-0 top-1/2 z-10 -translate-y-1/2',
          navPrevDisabled && 'pointer-events-none opacity-35',
        ]"
        :aria-disabled="navPrevDisabled"
        aria-label="Previous slide"
        @click="slidePrev"
      >
        <svg
          class="size-[11px] shrink-0 text-default"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 18 9 12l6-6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </BaseIconDisk>
      <BaseIconDisk
        as="button"
        size="lg"
        interaction="button"
        variant="fab"
        :class="[
          'absolute right-0 top-1/2 z-10 -translate-y-1/2',
          navNextDisabled && 'pointer-events-none opacity-35',
        ]"
        :aria-disabled="navNextDisabled"
        aria-label="Next slide"
        @click="slideNext"
      >
        <svg
          class="size-[11px] shrink-0 text-default"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m9 18 6-6-6-6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </BaseIconDisk>

      <div
        data-carousel-el="pagination"
        class="flex justify-center gap-2 pt-8"
        :class="`media-carousel__pagination--${carouselUid}`"
        aria-label="Slide indicators"
      />
    </div>

    <figcaption
      v-if="showCaption"
      class="font-body text-sm md:text-base text-subtle leading-6 mt-4 text-center w-full"
      :class="variant === 'bare' ? 'text-center' : 'px-6 pb-6 md:px-8 md:pb-8'"
    >
      <template v-for="(seg, i) in captionSegments" :key="i">
        <span v-if="seg.type === 'text'">{{ seg.value }}</span>
        <a
          v-else-if="isExternal(seg.href)"
          :href="seg.href"
          class="font-body text-link underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >{{ linkDisplayLabel(seg.label) }}</a>
        <NuxtLink
          v-else
          :to="localePath(seg.href)"
          class="font-body text-link underline underline-offset-2"
        >{{ linkDisplayLabel(seg.label) }}</NuxtLink>
      </template>
    </figcaption>
  </figure>
</template>

<style scoped>
/* No shadow on the Swiper root — it reads as depth behind neighbors; shadow belongs on the active card only. */
.media-carousel :deep(.swiper) {
  overflow: visible;
}

.media-carousel :deep(.swiper-wrapper) {
  overflow: visible;
}

.media-carousel :deep(.swiper-slide) {
  transition-property: transform, opacity;
  transition-duration: 0.45s;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.media-carousel :deep(.swiper-slide-active) {
  z-index: 2;
}

/* Inactive: blur only; no elevation (avoids muddy halos / “shadow” under side cards) */
.media-carousel :deep(.swiper-slide:not(.swiper-slide-active) .media-carousel__slide-inner) {
  filter: blur(10px);
  transform: translateZ(0);
  box-shadow: none;
}

/* Light: soft neutral lift. Dark: deeper black stack so the card stays legible on dark surfaces. */
.media-carousel :deep(.swiper-slide-active .media-carousel__slide-inner) {
  filter: blur(0);
  box-shadow:
    0 28px 52px -18px rgba(0, 0, 0, 0.1),
    0 14px 30px -12px rgba(0, 0, 0, 0.06),
    0 4px 12px -2px rgba(0, 0, 0, 0.04);
}

:global(.dark) .media-carousel :deep(.swiper-slide-active .media-carousel__slide-inner) {
  box-shadow:
    0 32px 64px -18px rgba(0, 0, 0, 0.62),
    0 16px 38px -12px rgba(0, 0, 0, 0.48),
    0 6px 16px -4px rgba(0, 0, 0, 0.38);
}

@media (prefers-reduced-motion: reduce) {
  .media-carousel :deep(.swiper-slide:not(.swiper-slide-active) .media-carousel__slide-inner) {
    filter: blur(3px);
  }
}

.media-carousel__bullet {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--color-text-default) 35%, transparent);
  background: transparent;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.media-carousel__bullet--active {
  transform: scale(1.25);
  background: var(--color-text-default);
  border-color: var(--color-text-default);
}

@media (prefers-reduced-motion: reduce) {
  .media-carousel :deep(.swiper-slide) {
    transition-duration: 0.01ms;
  }

  .media-carousel :deep(.media-carousel__slide-inner) {
    transition-duration: 0.01ms;
  }
}
</style>
