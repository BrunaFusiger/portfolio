<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    beforeSrc: string
    afterSrc: string
    beforeAlt?: string
    afterAlt?: string
    beforeLabel?: string
    afterLabel?: string
    caption?: string
    aspect?: '16/9' | '4/3' | 'square' | '9/16' | 'auto'
    variant?: 'default' | 'device' | 'bare'
    /** Fixed height viewport; both layers use `object-cover object-top` so the split aligns. */
    maxHeight?: 'xs' | 'sm' | 'md'
  }>(),
  {
    aspect: '16/9',
    variant: 'bare',
  },
)

/** Layout hint only; `object-contain` preserves aspect. Native `<img>` avoids IPX failing on very large PNGs. */
const IMG_WIDTH = 1600

const trackRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

/** 0 = all after (right), 100 = all before (left) — matches clip showing left `percent` of before layer. */
const percent = ref(50)

const isAutoAspect = computed(() => props.aspect === 'auto')

const isCropFrame = computed(() => Boolean(props.maxHeight))

const maxHeightClass = computed(() => {
  switch (props.maxHeight) {
    case 'xs':
      return 'h-48'
    case 'sm':
      return 'h-64'
    case 'md':
      return 'h-80'
    default:
      return ''
  }
})

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

const widthClass = 'w-full'

const figureClass = computed(() => {
  if (props.variant === 'bare') return widthClass
  if (props.variant === 'device') {
    return 'w-full overflow-hidden rounded-[32px] bg-surface-subtle flex flex-col items-center p-6 md:p-8'
  }
  return 'w-full overflow-hidden rounded-[32px] bg-surface-subtle'
})

const beforeClipStyle = computed(() => ({
  clipPath: `inset(0 ${100 - percent.value}% 0 0)`,
}))

const handleStyle = computed(() => ({
  left: `${percent.value}%`,
}))

const showCaption = computed(() => Boolean(props.caption?.trim()))

function clampPercent(n: number) {
  return Math.min(100, Math.max(0, n))
}

function setPercentFromClientX(clientX: number) {
  const el = trackRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0) return
  const x = clientX - rect.left
  percent.value = clampPercent((x / rect.width) * 100)
}

function onPointerDown(e: PointerEvent) {
  if (!(e.target instanceof Element) || !trackRef.value?.contains(e.target)) return
  if (e.button !== 0) return
  trackRef.value.focus({ preventScroll: true })
  dragging.value = true
  trackRef.value.setPointerCapture(e.pointerId)
  setPercentFromClientX(e.clientX)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  setPercentFromClientX(e.clientX)
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  try {
    trackRef.value?.releasePointerCapture(e.pointerId)
  } catch {
    /* pointer was not captured */
  }
}

function onKeydown(e: KeyboardEvent) {
  const step = e.shiftKey ? 10 : 2
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    percent.value = clampPercent(percent.value - step)
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    percent.value = clampPercent(percent.value + step)
  } else if (e.key === 'Home') {
    e.preventDefault()
    percent.value = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    percent.value = 100
  }
}

const labelBefore = computed(() => props.beforeLabel ?? 'Wireframe')
const labelAfter = computed(() => props.afterLabel ?? 'Final design')

onBeforeUnmount(() => {
  dragging.value = false
})
</script>

<template>
  <figure :class="figureClass">
    <div
      ref="trackRef"
      role="slider"
      :tabindex="0"
      :aria-valuenow="Math.round(percent)"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Compare before and after images"
      class="group/track relative w-full touch-none select-none overflow-hidden rounded-[32px] border border-surface-subtle leading-none outline-none ring-0 ring-offset-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      :class="[
        isCropFrame ? maxHeightClass : aspectClass,
        isCropFrame ? 'bg-surface-subtle' : '',
        !isCropFrame && isAutoAspect ? 'min-h-[200px] bg-surface-subtle' : '',
      ]"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown="onKeydown"
    >
      <!-- Cropped viewport: same box + object-cover so before/after align (fixes “both look final”). -->
      <template v-if="isCropFrame">
        <img
          :src="afterSrc"
          :alt="afterAlt ?? ''"
          :width="IMG_WIDTH"
          class="pointer-events-none absolute inset-0 size-full object-cover object-top align-top"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          draggable="false"
        >
        <img
          :src="beforeSrc"
          :alt="beforeAlt ?? ''"
          :width="IMG_WIDTH"
          class="pointer-events-none absolute inset-0 z-[1] size-full object-cover object-top align-top"
          loading="eager"
          decoding="async"
          draggable="false"
          :style="beforeClipStyle"
        >
      </template>

      <!-- Fixed aspect: both layers absolute -->
      <template v-else-if="!isAutoAspect">
        <img
          :src="afterSrc"
          :alt="afterAlt ?? ''"
          :width="IMG_WIDTH"
          class="pointer-events-none absolute inset-0 size-full object-contain align-top"
          loading="lazy"
          decoding="async"
          draggable="false"
        >
        <img
          :src="beforeSrc"
          :alt="beforeAlt ?? ''"
          :width="IMG_WIDTH"
          class="pointer-events-none absolute inset-0 z-[1] size-full object-contain align-top"
          loading="lazy"
          decoding="async"
          draggable="false"
          :style="beforeClipStyle"
        >
      </template>

      <!-- Auto aspect: after establishes height, before overlaid -->
      <template v-else>
        <img
          :src="afterSrc"
          :alt="afterAlt ?? ''"
          :width="IMG_WIDTH"
          class="pointer-events-none relative z-0 block h-auto w-full max-w-full align-top"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          draggable="false"
        >
        <div class="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <img
            :src="beforeSrc"
            :alt="beforeAlt ?? ''"
            :width="IMG_WIDTH"
            class="absolute inset-0 size-full object-contain align-top"
            loading="eager"
            decoding="async"
            draggable="false"
            :style="beforeClipStyle"
          >
        </div>
      </template>

      <!-- Region labels -->
      <div
        class="pointer-events-none absolute left-3 top-3 z-[2] max-w-[45%]"
        aria-hidden="true"
      >
        <span
          class="font-heading text-[10px] font-medium uppercase leading-tight tracking-widest text-default md:text-xs bg-white/90 px-2 py-1 backdrop-blur-sm dark:bg-neutral-900/85"
        >
          {{ labelBefore }}
        </span>
      </div>
      <div
        class="pointer-events-none absolute right-3 top-3 z-[2] max-w-[45%] text-right"
        aria-hidden="true"
      >
        <span
          class="font-heading text-[10px] font-medium uppercase leading-tight tracking-widest text-default md:text-xs bg-white/90 px-2 py-1 backdrop-blur-sm dark:bg-neutral-900/85"
        >
          {{ labelAfter }}
        </span>
      </div>

      <!-- Divider + handle -->
      <div
        class="pointer-events-none absolute inset-y-0 z-[3] w-px -translate-x-1/2 bg-surface-border"
        :style="handleStyle"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute top-1/2 z-[4] size-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-brand shadow-sm ring-0"
        :style="handleStyle"
        aria-hidden="true"
      />
    </div>

    <figcaption
      v-if="showCaption"
      class="font-body mt-4 max-w-prose text-sm leading-6 text-subtle md:text-base"
      :class="variant === 'bare' ? 'text-left' : 'px-6 pb-6 md:px-8 md:pb-8'"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
