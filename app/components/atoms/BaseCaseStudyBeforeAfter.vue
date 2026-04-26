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
    aspect?: CaseStudyAspect
    variant?: 'default' | 'device' | 'bare'
    maxHeight?: CaseStudyMaxHeight
  }>(),
  {
    beforeSrc: undefined,
    afterSrc: undefined,
    beforeAlt: undefined,
    afterAlt: undefined,
    beforeLabel: undefined,
    afterLabel: undefined,
    caption: undefined,
    aspect: '16/9',
    variant: 'bare',
    maxHeight: 'xl'
  },
)

/** Layout hint only; `object-contain` preserves aspect. Native `<img>` avoids IPX failing on very large PNGs. */
const IMG_WIDTH = 1600

const trackRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

/** 0 = all after (right), 100 = all before (left) — matches clip showing left `percent` of before layer. */
const percent = ref(50)

/** Handle's vertical position as % of track height. Updated on scroll so the pill tracks viewport center. */
const handleTop = ref(50)
let rafId: number | null = null

/** Px inset from the track's top/bottom edges so the handle never touches the frame. */
const HANDLE_EDGE_INSET = 32

function updateHandleTop() {
  const el = trackRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (rect.height <= 0) return
  const viewportCenter = window.innerHeight / 2
  const offsetWithinTrack = viewportCenter - rect.top
  const inset = Math.min(HANDLE_EDGE_INSET, rect.height / 2)
  const clamped = Math.min(rect.height - inset, Math.max(inset, offsetWithinTrack))
  handleTop.value = (clamped / rect.height) * 100
}

function scheduleUpdate() {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    updateHandleTop()
  })
}

const isAutoAspect = computed(() => props.aspect === 'auto')

const isCropFrame = computed(() => Boolean(props.maxHeight))

const maxHeightClass = computed(() => caseStudyMaxHeightClass(props.maxHeight))

const aspectClass = computed(() => caseStudyAspectClass(props.aspect))

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
  top: `${handleTop.value}%`,
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

onMounted(() => {
  if (import.meta.server) return
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    handleTop.value = 50
    return
  }
  updateHandleTop()
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate, { passive: true })
})

onBeforeUnmount(() => {
  dragging.value = false
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <figure :class="figureClass" class="bg-surface-default p-3 rounded-9 shadow-lg">
    <div
      ref="trackRef"
      role="slider"
      :tabindex="0"
      :aria-valuenow="Math.round(percent)"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Compare before and after images"
      class="group/track relative w-full touch-none select-none overflow-hidden rounded-8 border-2 border-surface-subtle outline-none focus:outline-none focus-visible:outline-none"
      :class="[
        isCropFrame ? maxHeightClass : aspectClass,
        isCropFrame ? 'bg-surface-subtle' : '',
        !isCropFrame && isAutoAspect ? 'min-h-[200px] bg-surface-subtle' : '',
        dragging ? 'cursor-grabbing' : 'cursor-grab',
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

      <!-- Subtle inner border inside the scrolling viewport -->
      <div
        class="pointer-events-none absolute inset-0 z-[1] rounded-[28px] border border-surface-subtle"
        aria-hidden="true"
      />

      <!-- Region labels -->
      <div
        class="pointer-events-none absolute left-4 top-4 z-[2] max-w-[45%]"
        aria-hidden="true"
      >
        <span
          class="font-heading inline-flex items-center rounded-lg bg-background-default px-3 py-1.5 text-xs font-medium leading-tight tracking-wide text-default shadow-lg"
        >
          {{ labelBefore }}
        </span>
      </div>
      <div
        class="pointer-events-none absolute right-4 top-4 z-[2] max-w-[45%] text-right"
        aria-hidden="true"
      >
        <span
          class="font-heading inline-flex items-center rounded-lg bg-background-default px-3 py-1.5 text-xs font-medium leading-tight tracking-wide text-default shadow-lg"
        >
          {{ labelAfter }}
        </span>
      </div>

      <!-- Divider + handle -->
      <div
        class="pointer-events-none absolute inset-y-0 z-[3] w-px -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35),0_0_2px_rgba(0,0,0,0.25)] dark:shadow-[0_0_14px_rgba(0,0,0,0.7),0_0_3px_rgba(0,0,0,0.5)]"
        :style="{ left: `${percent}%` }"
        aria-hidden="true"
      />
      <div
        class="pointer-events-auto absolute z-[4] flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-surface-subtle bg-background-default text-default shadow-[0_6px_24px_-4px_rgba(0,0,0,0.35),0_2px_8px_-2px_rgba(0,0,0,0.22)] dark:shadow-[0_8px_28px_-4px_rgba(0,0,0,0.7),0_3px_10px_-2px_rgba(0,0,0,0.5)]"
        :class="dragging ? 'cursor-grabbing' : 'cursor-pointer'"
        :style="handleStyle"
        aria-hidden="true"
      >
        <span class="i-hugeicons-arrow-left-right size-5 text-default" aria-hidden="true" />
      </div>
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
