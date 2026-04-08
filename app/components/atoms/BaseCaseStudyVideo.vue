<script setup lang="ts">
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    caption?: string
    placeholderLabel?: string
    aspect?: '16/9' | '4/3' | 'square' | '9/16' | 'auto'
    variant?: 'default' | 'device' | 'bare'
  }>(),
  {
    aspect: '16/9',
    variant: 'default',
  },
)

const reducedMotion = useReducedMotion()
const videoRef = ref<HTMLVideoElement | null>(null)

const showVideo = computed(() => Boolean(props.src?.trim()))

const aspectClass = computed(() => {
  switch (props.aspect) {
    case '4/3':
      return 'aspect-[4/3]'
    case 'square':
      return 'aspect-square'
    case '9/16':
      return 'aspect-[9/16]'
    case 'auto':
      return ''
    default:
      return 'aspect-video'
  }
})

const isAutoAspect = computed(() => props.aspect === 'auto')

const figureClass = computed(() => {
  if (props.variant === 'device') {
    return 'm-0 w-full overflow-hidden border border-surface-border bg-surface-subtle rounded-[32px] flex flex-col items-center p-6 md:p-8'
  }
  return 'm-0 w-full'
})

const stripeStyle = {
  background:
    'repeating-linear-gradient(135deg, transparent, transparent 10px, color-mix(in srgb, var(--color-text-default) 6%, transparent) 10px, color-mix(in srgb, var(--color-text-default) 6%, transparent) 11px)',
}

watch(
  () => props.src,
  () => nextTick(() => syncPlayback()),
)

/** 32px radius, clip overflow — no ring (avoids a visible border around the clip). */
const wrapperClass = computed(() => {
  const framed = 'overflow-hidden rounded-[32px]'
  return `w-full ${framed}`
})

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
            class="absolute inset-0 size-full border-0 object-contain align-top"
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
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center"
            :style="stripeStyle"
          >
            <span
              class="font-heading text-[10px] md:text-xs font-medium uppercase tracking-widest text-muted/70 px-4 text-center"
            >
              {{ placeholderLabel ?? 'Media' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      :class="[
        wrapperClass,
        isAutoAspect ? 'min-h-[200px]' : ['relative', aspectClass],
      ]"
    >
      <video
        v-if="showVideo"
        ref="videoRef"
        :src="src"
        :class="
          isAutoAspect
            ? 'block h-auto w-full max-w-full border-0 align-top'
            : 'absolute inset-0 size-full border-0 object-contain align-top'
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
      <div
        v-else
        class="flex min-h-[200px] w-full items-center justify-center"
        :style="stripeStyle"
      >
        <span
          class="font-heading text-[10px] md:text-xs font-medium uppercase tracking-widest text-muted/70 px-4 text-center"
        >
          {{ placeholderLabel ?? 'Media' }}
        </span>
      </div>
    </div>

    <figcaption
      v-if="showCaption"
      class="font-body mt-4 max-w-prose text-sm leading-6 text-subtle md:text-base"
      :class="
        variant === 'device'
          ? 'px-2 text-center'
          : 'px-0'
      "
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
