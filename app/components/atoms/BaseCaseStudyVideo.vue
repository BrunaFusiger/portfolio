<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    caption?: string
    placeholderLabel?: string
    poster?: string
    priority?: boolean
    aspect?: CaseStudyAspect
    variant?: 'default' | 'device' | 'bare'
    maxWidth?: CaseStudyMaxWidth
  }>(),
  {
    src: undefined,
    alt: undefined,
    caption: undefined,
    placeholderLabel: undefined,
    poster: undefined,
    priority: false,
    aspect: '16/9',
    variant: 'default',
    maxWidth: undefined,
  },
)

const reducedMotion = useReducedMotion()
const videoRef = ref<HTMLVideoElement | null>(null)
const loadGateRef = ref<HTMLElement | null>(null)
const videoReady = ref(false)

const showVideo = computed(() => Boolean(props.src?.trim()))

const { canLoad } = useInViewOrPriorityLoad({
  hasSource: () => showVideo.value,
  priority: () => props.priority,
  target: loadGateRef,
})

const effectiveSrc = computed(() => {
  if (!props.src?.trim() || !canLoad.value) return undefined
  return props.src
})

watch(effectiveSrc, () => {
  videoReady.value = false
})

const widthClass = computed(() => caseStudyMaxWidthClass(props.maxWidth))

const bareInnerWidthClass = computed(() =>
  props.variant === 'bare' && props.maxWidth ? widthClass.value : '',
)

const aspectClass = computed(() => caseStudyAspectClass(props.aspect))

const isAutoAspect = computed(() => props.aspect === 'auto')

const figureClass = computed(() => {
  if (props.variant === 'device') {
    return 'm-0 w-full overflow-hidden border border-surface-border bg-surface-subtle rounded-[32px] flex flex-col items-center p-6 md:p-8'
  }
  if (props.variant === 'bare') {
    return props.maxWidth ? 'm-0 w-full flex flex-col items-center' : 'm-0 w-full'
  }
  return 'm-0 w-full'
})

watch(
  () => props.src,
  () => nextTick(() => syncPlayback()),
)

const wrapperClass = computed(() => {
  const framed = 'isolate overflow-hidden rounded-[32px]'
  return `w-full ${framed}`
})

const videoStackClass =
  'rounded-[32px] bg-background-default transform-gpu [backface-visibility:hidden]'

const showCaption = computed(() => Boolean(props.caption?.trim()))

const videoAriaLabel = computed(() => {
  const t = props.alt?.trim()
  if (t && t.length > 0) return t
  const p = props.placeholderLabel?.trim()
  if (p && p.length > 0) return p
  return 'Video'
})

const transitionClass = computed(() =>
  reducedMotion.value ? '' : 'transition-opacity duration-300 ease-out',
)

const videoOpacityClass = computed(() => {
  if (reducedMotion.value || videoReady.value) return 'opacity-100'
  return 'opacity-0'
})

const showMediaPlaceholder = computed(
  () => !showVideo.value || !effectiveSrc.value || !videoReady.value,
)

function onVideoFrameReady() {
  videoReady.value = true
  nextTick(() => syncPlayback())
}

function enforceMuted() {
  const el = videoRef.value
  if (!el) return
  el.defaultMuted = true
  el.muted = true
}

function syncPlayback() {
  const el = videoRef.value
  if (!el || !effectiveSrc.value) return
  enforceMuted()
  if (reducedMotion.value) {
    el.pause()
  } else {
    el.play().catch(() => {})
  }
}

watch([reducedMotion, effectiveSrc], () => nextTick(() => syncPlayback()))

watch(videoRef, () => nextTick(() => syncPlayback()))

onMounted(() => nextTick(() => syncPlayback()))
</script>

<template>
  <figure ref="loadGateRef" :class="figureClass">
    <div
      v-if="variant === 'device'"
      class="w-full flex justify-center"
    >
      <div
        class="w-full max-w-[280px] md:max-w-[320px] overflow-hidden rounded-[24px] border border-surface-border"
      >
        <div
          :class="[
            'relative w-full',
            aspectClass,
            isAutoAspect ? 'min-h-[200px]' : '',
          ]"
        >
          <BaseCaseStudyMediaPlaceholder
            v-if="showMediaPlaceholder"
            class="media-loading-layer"
            :label="placeholderLabel ?? 'Media'"
            variant="pulse"
          />
          <video
            v-if="effectiveSrc"
            ref="videoRef"
            :src="effectiveSrc"
            :poster="poster"
            class="absolute inset-0 z-10 size-full border-0 object-contain align-top bg-white transform-gpu [backface-visibility:hidden]"
            :class="[transitionClass, videoOpacityClass]"
            autoplay
            muted
            defaultMuted
            loop
            playsinline
            preload="auto"
            :aria-label="videoAriaLabel"
            @loadeddata="onVideoFrameReady"
            @loadedmetadata="() => nextTick(() => syncPlayback())"
            @volumechange="enforceMuted"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      :class="[
        'relative',
        wrapperClass,
        bareInnerWidthClass,
        isAutoAspect ? 'min-h-[200px]' : aspectClass,
      ].filter(Boolean)"
    >
      <BaseCaseStudyMediaPlaceholder
        v-if="showMediaPlaceholder"
        :class="['media-loading-layer', isAutoAspect ? 'min-h-[200px] w-full' : '']"
        :label="placeholderLabel ?? 'Media'"
        variant="pulse"
      />
      <video
        v-if="effectiveSrc"
        ref="videoRef"
        :src="effectiveSrc"
        :poster="poster"
        :class="[
          isAutoAspect
            ? ['block h-auto w-full max-w-full border-0 align-top', videoStackClass]
            : ['absolute inset-0 size-full border-0 object-contain align-top', videoStackClass],
          'z-10',
          transitionClass,
          videoOpacityClass,
        ]"
        autoplay
        muted
        defaultMuted
        loop
        playsinline
        preload="auto"
        :aria-label="videoAriaLabel"
        @loadeddata="onVideoFrameReady"
        @loadedmetadata="() => nextTick(() => syncPlayback())"
        @volumechange="enforceMuted"
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
      {{ caption }}
    </figcaption>
  </figure>
</template>
