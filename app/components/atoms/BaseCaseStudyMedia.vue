<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    caption?: string
    placeholderLabel?: string
    aspect?: CaseStudyAspect
    variant?: 'default' | 'device' | 'bare'
    rounded?: boolean
    maxWidth?: CaseStudyMaxWidth
    maxHeight?: CaseStudyMaxHeight
    /** Eager load + high fetch priority + preload (use sparingly for above-the-fold / LCP media). */
    priority?: boolean
  }>(),
  {
    src: undefined,
    alt: undefined,
    caption: undefined,
    placeholderLabel: undefined,
    aspect: '16/9',
    variant: 'default',
    rounded: false,
    maxWidth: undefined,
    maxHeight: undefined,
    priority: false,
  },
)

const reducedMotion = useReducedMotion()
const loaded = ref(false)
const localePath = useLocalePath()
const { t } = useI18n()

function linkDisplayLabel(label: string) {
  return caseStudyLinkDisplayLabel(label, t('work.linkHere'))
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href)
}

const captionSegments = computed(() => parseCaseStudyMarkdown(props.caption?.trim() ?? ''))

const aspectClass = computed(() => caseStudyAspectClass(props.aspect))

const isAutoAspect = computed(() => props.aspect === 'auto')

const isCropFrame = computed(() => Boolean(props.maxHeight))

/** `maxHeight` + fixed aspect: box keeps width:height, capped by max height (so `9/16` stays portrait). */
const isAspectHeightCap = computed(() => isCropFrame.value && !isAutoAspect.value)

const aspectCappedFrameStyle = computed(() => {
  if (!isAspectHeightCap.value || !props.maxHeight) return undefined
  const mh = CASE_STUDY_MAX_H_REM[props.maxHeight]
  const [aw, ah] = caseStudyAspectRatioWH(props.aspect)
  return {
    aspectRatio: `${aw} / ${ah}`,
    maxHeight: mh,
    width: `min(100%, calc(${mh} * ${aw} / ${ah}))`,
    marginLeft: 'auto',
    marginRight: 'auto',
  }
})

const maxHeightClass = computed(() => caseStudyMaxHeightClass(props.maxHeight))

/** Contain keeps full screenshot/UI visible inside the aspect box (no edge crop). */
const imageFitClass = 'object-contain'

/**
 * `auto` + `maxHeight`: full-width strip, top-cropped cover (like `beforeAfter` crop).
 * Fixed aspect + `maxHeight`: aspect-capped frame; contain keeps the still readable inside the box.
 */
const imageObjectClass = computed(() => {
  if (!isCropFrame.value) return imageFitClass
  if (isAspectHeightCap.value) return imageFitClass
  return 'object-cover object-top'
})

const showImage = computed(() => Boolean(props.src?.trim()))

const transitionClass = computed(() =>
  reducedMotion.value ? '' : 'transition-opacity duration-300 ease-out',
)

const imageOpacityClass = computed(() => {
  if (reducedMotion.value || loaded.value) return 'opacity-100'
  return 'opacity-0'
})

watch(
  () => props.src,
  () => {
    loaded.value = false
  },
)

const widthClass = computed(() => caseStudyMaxWidthClass(props.maxWidth))

/** Width cap on inner wrappers, not on `<figure>` (figure stays `w-full` in flex columns so `max-width` can win). */
const bareInnerWidthClass = computed(() =>
  props.variant === 'bare' && props.maxWidth ? widthClass.value : '',
)

const roundedClipClass = computed(() =>
  props.rounded ? 'overflow-hidden rounded-[32px]' : '',
)

const figureClass = computed(() => {
  if (props.variant === 'bare') {
    return props.maxWidth ? 'm-0 w-full flex flex-col items-center' : 'm-0 w-full'
  }
  if (props.variant === 'device') {
    return 'w-full overflow-hidden border border-surface-border bg-surface-subtle rounded-[32px] flex flex-col items-center p-6 md:p-8'
  }
  return 'w-full overflow-hidden border border-surface-border bg-surface-subtle rounded-[32px]'
})

/** Inner frame for `variant: device` (phone mockup). */
const deviceInnerFrameClass = computed(() => {
  const rounded = roundedClipClass.value
  if (isAspectHeightCap.value) {
    return ['relative w-full overflow-hidden bg-surface-subtle', rounded].filter(Boolean)
  }
  if (isCropFrame.value && isAutoAspect.value) {
    return ['relative w-full overflow-hidden bg-surface-subtle', maxHeightClass.value, rounded].filter(Boolean)
  }
  return ['relative w-full', aspectClass.value, rounded].filter(Boolean)
})

const deviceInnerFrameStyle = computed(() =>
  isAspectHeightCap.value ? aspectCappedFrameStyle.value : undefined,
)

const fixedAspectOnlyFrameClass = computed(() =>
  ['relative w-full', aspectClass.value, roundedClipClass.value].filter(Boolean),
)

const fixedAspectFrameWithBareWidth = computed(() =>
  [...fixedAspectOnlyFrameClass.value, bareInnerWidthClass.value].filter(Boolean),
)

const showCaption = computed(() => Boolean(props.caption?.trim()))

/** Matches phone mockup shell `max-w-[280px] md:max-w-[320px]`. */
const nuxtImgSizesDevice = '280px md:320px'

/** ~`col-main` inside `max-w-[1120px]` section grid. */
const nuxtImgSizesFullColumn = '100vw md:896px'

/** Matches `.case-study-mw-*` (20rem / 24rem / 28rem). */
const nuxtImgSizesBareMax = computed(() => {
  switch (props.maxWidth) {
    case 'xs':
      return 'min(100vw, 320px) md:320px'
    case 'sm':
      return 'min(100vw, 384px) md:384px'
    case 'md':
      return 'min(100vw, 448px) md:448px'
    default:
      return nuxtImgSizesFullColumn
  }
})

const nuxtImgSizesNonDevice = computed(() =>
  bareInnerWidthClass.value ? nuxtImgSizesBareMax.value : nuxtImgSizesFullColumn,
)

const nuxtImgBaseProps = computed(() => ({
  ...nuxtImgRasterDefaults,
  loading: (props.priority ? 'eager' : 'lazy') as 'eager' | 'lazy',
  ...(props.priority
    ? {
        fetchpriority: 'high' as const,
        preload: { fetchPriority: 'high' as const },
      }
    : {}),
}))
</script>

<template>
  <figure :class="figureClass">
    <div
      v-if="variant === 'device'"
      class="w-full flex justify-center"
    >
      <div
        class="w-full max-w-[280px] md:max-w-[320px] overflow-hidden rounded-[24px] border border-surface-border"
      >
        <div :class="deviceInnerFrameClass" :style="deviceInnerFrameStyle">
          <NuxtImg
            v-if="showImage"
            :src="src!"
            :alt="alt ?? ''"
            v-bind="nuxtImgBaseProps"
            :sizes="nuxtImgSizesDevice"
            densities="x1 x2"
            class="absolute inset-0 size-full"
            :class="[imageObjectClass, transitionClass, imageOpacityClass]"
            @load="loaded = true"
          />
          <BaseCaseStudyMediaPlaceholder
            v-else
            class="absolute inset-0"
            :label="placeholderLabel ?? 'Media'"
          />
        </div>
      </div>
    </div>

    <div
      v-else-if="isAutoAspect && isCropFrame"
      :class="['relative w-full overflow-hidden bg-surface-subtle', maxHeightClass, roundedClipClass, bareInnerWidthClass].filter(Boolean)"
    >
      <NuxtImg
        v-if="showImage"
        :src="src!"
        :alt="alt ?? ''"
        v-bind="nuxtImgBaseProps"
        :sizes="nuxtImgSizesNonDevice"
        class="absolute inset-0 size-full object-cover object-top"
        :class="[transitionClass, imageOpacityClass]"
        @load="loaded = true"
      />
      <BaseCaseStudyMediaPlaceholder
        v-else
        class="absolute inset-0"
        :label="placeholderLabel ?? 'Media'"
      />
    </div>

    <div
      v-else-if="isAutoAspect"
      :class="['relative w-full min-h-[200px]', roundedClipClass, bareInnerWidthClass].filter(Boolean)"
    >
      <NuxtImg
        v-if="showImage"
        :src="src!"
        :alt="alt ?? ''"
        v-bind="nuxtImgBaseProps"
        :sizes="nuxtImgSizesNonDevice"
        class="block h-auto w-full max-w-full"
        :class="[transitionClass, imageOpacityClass]"
        @load="loaded = true"
      />
      <BaseCaseStudyMediaPlaceholder
        v-else
        class="min-h-[200px] w-full"
        :label="placeholderLabel ?? 'Media'"
      />
    </div>

    <div
      v-else-if="isAspectHeightCap"
      :class="['relative overflow-hidden bg-surface-subtle', roundedClipClass, bareInnerWidthClass].filter(Boolean)"
      :style="aspectCappedFrameStyle"
    >
      <NuxtImg
        v-if="showImage"
        :src="src!"
        :alt="alt ?? ''"
        v-bind="nuxtImgBaseProps"
        :sizes="nuxtImgSizesNonDevice"
        class="absolute inset-0 size-full"
        :class="[imageObjectClass, transitionClass, imageOpacityClass]"
        @load="loaded = true"
      />
      <BaseCaseStudyMediaPlaceholder
        v-else
        class="absolute inset-0"
        :label="placeholderLabel ?? 'Media'"
      />
    </div>

    <div
      v-else
      :class="fixedAspectFrameWithBareWidth"
    >
      <NuxtImg
        v-if="showImage"
        :src="src!"
        :alt="alt ?? ''"
        v-bind="nuxtImgBaseProps"
        :sizes="nuxtImgSizesNonDevice"
        class="absolute inset-0 size-full"
        :class="[imageObjectClass, transitionClass, imageOpacityClass]"
        @load="loaded = true"
      />
      <BaseCaseStudyMediaPlaceholder
        v-else
        class="absolute inset-0"
        :label="placeholderLabel ?? 'Media'"
      />
    </div>

    <figcaption
      v-if="showCaption"
      class="font-body text-sm md:text-base text-subtle leading-6 mt-4 text-center"
      :class="
        variant === 'device'
          ? 'text-center px-2 w-full'
          : variant === 'bare'
            ? ['text-center', bareInnerWidthClass || 'w-full']
            : 'w-full px-6 pb-6 md:px-8 md:pb-8'
      "
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

