<script setup lang="ts">
import { useReducedMotion } from '~/composables/useReducedMotion'
import {
  caseStudyAspectClass,
  caseStudyMaxWidthClass,
  type CaseStudyAspect,
  type CaseStudyMaxWidth,
} from '~/utils/caseStudyAspect'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    caption?: string
    placeholderLabel?: string
    aspect?: CaseStudyAspect
    variant?: 'default' | 'device' | 'bare'
    maxWidth?: CaseStudyMaxWidth
  }>(),
  {
    src: undefined,
    alt: undefined,
    caption: undefined,
    placeholderLabel: undefined,
    aspect: '16/9',
    variant: 'default',
    maxWidth: undefined,
  },
)

const reducedMotion = useReducedMotion()
const videoRef = ref<HTMLVideoElement | null>(null)

const showVideo = computed(() => Boolean(props.src?.trim()))

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

/** 32px radius + isolate: clips cleanly in light mode (avoids GPU fringe / “inner shadow” at corners). */
const wrapperClass = computed(() => {
  const framed = 'isolate overflow-hidden rounded-[32px]'
  return `w-full ${framed}`
})

/** Same rounding + layer promotion as images — WebKit/Blink composite video more cleanly this way. */
const videoStackClass =
  'rounded-[32px] bg-background-default transform-gpu [backface-visibility:hidden]'

const showCaption = computed(() => Boolean(props.caption?.trim()))

/** Always expose a name; avoid aria-hidden on <video> (focus/shadow controls conflict). */
const videoAriaLabel = computed(() => {
  const t = props.alt?.trim()
  if (t && t.length > 0) return t
  const p = props.placeholderLabel?.trim()
  if (p && p.length > 0) return p
  return 'Video'
})

function enforceMuted() {
  const el = videoRef.value
  if (!el) return
  el.defaultMuted = true
  el.muted = true
}

function syncPlayback() {
  const el = videoRef.value
  if (!el || !showVideo.value) return
  enforceMuted()
  if (reducedMotion.value) {
    el.pause()
  } else {
    el.play().catch(() => {})
  }
}

watch([reducedMotion, showVideo], () => nextTick(() => syncPlayback()))

watch(videoRef, () => nextTick(() => syncPlayback()))

onMounted(() => nextTick(() => syncPlayback()))
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
        <div
          :class="[
            'relative w-full',
            aspectClass,
            isAutoAspect ? 'min-h-[200px]' : '',
          ]"
        >
          <video
            v-if="showVideo"
            ref="videoRef"
            :src="src"
            class="absolute inset-0 size-full border-0 object-contain align-top bg-white transform-gpu [backface-visibility:hidden]"
            autoplay
            muted
            defaultMuted
            loop
            playsinline
            preload="auto"
            :aria-label="videoAriaLabel"
            @loadeddata="() => nextTick(() => syncPlayback())"
            @loadedmetadata="() => nextTick(() => syncPlayback())"
            @volumechange="enforceMuted"
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
      v-else
      :class="[
        wrapperClass,
        bareInnerWidthClass,
        isAutoAspect ? 'min-h-[200px]' : ['relative', aspectClass],
      ].filter(Boolean)"
    >
      <video
        v-if="showVideo"
        ref="videoRef"
        :src="src"
        :class="
          isAutoAspect
            ? ['block h-auto w-full max-w-full border-0 align-top', videoStackClass]
            : ['absolute inset-0 size-full border-0 object-contain align-top', videoStackClass]
        "
        autoplay
        muted
        defaultMuted
        loop
        playsinline
        preload="auto"
        :aria-label="videoAriaLabel"
        @loadeddata="() => nextTick(() => syncPlayback())"
        @loadedmetadata="() => nextTick(() => syncPlayback())"
        @volumechange="enforceMuted"
      />
      <BaseCaseStudyMediaPlaceholder
        v-else
        class="min-h-[200px] w-full"
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
      {{ caption }}
    </figcaption>
  </figure>
</template>
