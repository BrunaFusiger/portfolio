<script setup lang="ts">
import { useReducedMotion } from '~/composables/useReducedMotion'

type ScreenInset = {
  top: number
  left: number
  right: number
  bottom: number
}

const props = withDefaults(
  defineProps<{
    /** Frame asset (transparent PNG). */
    mockupSrc?: string
    /** Tall screenshot or asset shown inside the screen; uses @nuxt/image (`NuxtImg`). */
    screenImageSrc?: string
    /** Optional video URL inside the screen (mutually exclusive with image in typical use). */
    screenVideoSrc?: string
    alt?: string
    caption?: string
    /** Inset from the mockup edges, in percent of the frame's box (0–100). */
    screenInset?: Partial<ScreenInset>
  }>(),
  {
    mockupSrc: '/media/utils/laptop-mockup.png',
  },
)

/** Measured cutout for `computer-mockup.png` (1536×1024). */
const DEFAULT_INSET_COMPUTER: ScreenInset = {
  top: 12.79,
  left: 5.79,
  right: 22.98,
  bottom: 14.84,
}

/**
 * Tight inner panel for `laptop-mockup.png` (1536×1024): darkest glass only
 * (darkest pixels only, lum under 8), so the mask sits inside the bezel.
 */
const DEFAULT_INSET_LAPTOP: ScreenInset = {
  top: 20,
  left: 18.6,
  right: 18.6,
  bottom: 26,
}

const baseInset = computed((): ScreenInset => {
  const src = props.mockupSrc ?? ''
  if (src.includes('computer-mockup')) return DEFAULT_INSET_COMPUTER
  return DEFAULT_INSET_LAPTOP
})

/** Match the laptop glass corner radius at different scales (~10–14px on the 1536px-wide asset). */
const screenRadiusClass = 'rounded-[clamp(7px,0.85vw,12px)]'

const effectiveInset = computed(() => ({
  ...baseInset.value,
  ...props.screenInset,
}))

const screenBoxStyle = computed(() => ({
  top: `${effectiveInset.value.top}%`,
  left: `${effectiveInset.value.left}%`,
  right: `${effectiveInset.value.right}%`,
  bottom: `${effectiveInset.value.bottom}%`,
}))

const showImage = computed(() => Boolean(props.screenImageSrc?.trim()))
const showVideo = computed(() => Boolean(props.screenVideoSrc?.trim()))
const showCaption = computed(() => Boolean(props.caption?.trim()))

const scrollRegionLabel = computed(() => props.alt?.trim() || 'Screen content')

const reducedMotion = useReducedMotion()
const mockupRootRef = ref<HTMLElement | null>(null)
const scrollRegionRef = ref<HTMLElement | null>(null)

const isScrollable = ref(false)
const hintActive = ref(false)
/** 'off' | 'in' | 'hold' | 'out' */
const hintPhase = ref<'off' | 'in' | 'hold' | 'out'>('off')

let intersectionObserver: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
let hintTimeouts: ReturnType<typeof setTimeout>[] = []
let hintRunId = 0
let wasIntersecting = false

const SCROLL_EPS = 1
const IO_THRESHOLD = 0.32

function clearHintTimeouts() {
  for (const t of hintTimeouts) clearTimeout(t)
  hintTimeouts = []
}

function updateScrollable() {
  const el = scrollRegionRef.value
  if (!el) {
    isScrollable.value = false
    return
  }
  isScrollable.value = el.scrollHeight > el.clientHeight + SCROLL_EPS
}

function stopHint() {
  hintRunId++
  clearHintTimeouts()
  hintPhase.value = 'off'
  hintActive.value = false
}

function runHintSequence() {
  if (!import.meta.client || !isScrollable.value) return

  hintRunId++
  const run = hintRunId
  clearHintTimeouts()
  hintActive.value = true

  if (reducedMotion.value) {
    hintPhase.value = 'hold'
    hintTimeouts.push(
      setTimeout(() => {
        if (run !== hintRunId) return
        hintPhase.value = 'off'
        hintActive.value = false
      }, 900),
    )
    return
  }

  hintPhase.value = 'off'
  requestAnimationFrame(() => {
    if (run !== hintRunId) return
    hintPhase.value = 'in'
  })

  const ENTER_MS = 480
  const HOLD_MS = 1200
  const EXIT_MS = 360

  hintTimeouts.push(
    setTimeout(() => {
      if (run !== hintRunId) return
      hintPhase.value = 'hold'
    }, ENTER_MS),
  )

  hintTimeouts.push(
    setTimeout(() => {
      if (run !== hintRunId) return
      hintPhase.value = 'out'
    }, ENTER_MS + HOLD_MS),
  )

  hintTimeouts.push(
    setTimeout(() => {
      if (run !== hintRunId) return
      hintPhase.value = 'off'
      hintActive.value = false
    }, ENTER_MS + HOLD_MS + EXIT_MS),
  )
}

function onIntersection(entries: IntersectionObserverEntry[]) {
  const entry = entries[0]
  if (!entry) return

  const intersecting = entry.isIntersecting && entry.intersectionRatio >= IO_THRESHOLD

  if (!intersecting) {
    wasIntersecting = false
    stopHint()
    return
  }

  updateScrollable()

  if (!wasIntersecting && intersecting && isScrollable.value) {
    runHintSequence()
  }

  wasIntersecting = true
}

function onScrollRegionScroll() {
  if (scrollRegionRef.value && scrollRegionRef.value.scrollTop > SCROLL_EPS) {
    stopHint()
  }
}

onMounted(() => {
  if (!import.meta.client) return

  nextTick(() => {
    updateScrollable()

    const root = mockupRootRef.value
    const scrollEl = scrollRegionRef.value

    if (scrollEl) {
      resizeObserver = new ResizeObserver(() => {
        updateScrollable()
      })
      resizeObserver.observe(scrollEl)
      scrollEl.addEventListener('scroll', onScrollRegionScroll, { passive: true })
    }

    if (root) {
      intersectionObserver = new IntersectionObserver(onIntersection, {
        threshold: [0, IO_THRESHOLD, 0.5, 1],
      })
      intersectionObserver.observe(root)
    }
  })
})

onBeforeUnmount(() => {
  clearHintTimeouts()
  hintRunId++
  intersectionObserver?.disconnect()
  intersectionObserver = null
  resizeObserver?.disconnect()
  resizeObserver = null
  scrollRegionRef.value?.removeEventListener('scroll', onScrollRegionScroll)
})

const hintWrapClass = computed(() => {
  const base =
    'pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center'
  if (!hintActive.value) return base

  if (reducedMotion.value) {
    return `${base} translate-y-0 opacity-100`
  }

  switch (hintPhase.value) {
    case 'in':
      return `${base} computer-mockup-hint-enter`
    case 'hold':
      return `${base} computer-mockup-hint-stable`
    case 'out':
      return `${base} computer-mockup-hint-exit`
    default:
      return `${base} opacity-0`
  }
})

const chevronBounceClass = computed(() => {
  if (!hintActive.value || hintPhase.value !== 'hold' || reducedMotion.value) return ''
  return 'computer-mockup-hint-bounce'
})
</script>

<template>
  <figure class="w-full">
    <div ref="mockupRootRef" class="relative w-full max-w-full select-none leading-none">
      <NuxtImg
        :src="mockupSrc"
        alt=""
        class="pointer-events-none relative z-0 block h-auto w-full max-w-full align-top"
        loading="lazy"
        decoding="async"
      />
      <div
        class="absolute z-10 min-h-0 min-w-0 overflow-hidden bg-black"
        :class="screenRadiusClass"
        :style="screenBoxStyle"
      >
        <div class="relative h-full min-h-0 w-full">
          <div
            ref="scrollRegionRef"
            class="computer-mockup-scroll box-border h-full max-h-full min-h-0 min-w-0 w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-contain"
            tabindex="0"
            role="region"
            :aria-label="scrollRegionLabel"
          >
            <slot>
              <NuxtImg
                v-if="showImage"
                :src="screenImageSrc!"
                :alt="alt ?? ''"
                class="block h-auto w-full max-w-full min-w-0 align-top"
                sizes="(max-width: 768px) 85vw, 900px"
                loading="lazy"
                decoding="async"
              />
              <video
                v-else-if="showVideo"
                :src="screenVideoSrc"
                class="block h-auto w-full max-w-full align-top"
                muted
                loop
                playsinline
                controls
              />
              <div
                v-else
                class="flex min-h-[120px] w-full items-center justify-center bg-neutral-900"
              >
                <span class="font-heading text-[10px] font-medium uppercase tracking-widest text-white/40 px-4 text-center md:text-xs">
                  Screen content
                </span>
              </div>
            </slot>
          </div>

          <div
            v-show="hintActive"
            :class="hintWrapClass"
            aria-hidden="true"
          >
            <div
              class="flex flex-col items-center gap-0.5 rounded-full bg-black/55 px-3 py-2 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/15"
            >
              <svg
                class="size-5 shrink-0 text-white/95"
                :class="chevronBounceClass"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6 14l6 6 6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  opacity="0.45"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <figcaption
      v-if="showCaption"
      class="font-body mt-4 max-w-prose text-sm leading-6 text-subtle md:text-base"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
.computer-mockup-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.computer-mockup-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.computer-mockup-hint-enter {
  animation: computer-mockup-hint-slide-in 480ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.computer-mockup-hint-stable {
  opacity: 1;
  transform: translateY(0);
}

.computer-mockup-hint-exit {
  transition:
    opacity 360ms cubic-bezier(0.4, 0, 1, 1),
    transform 360ms cubic-bezier(0.4, 0, 1, 1);
}

@keyframes computer-mockup-hint-slide-in {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.computer-mockup-hint-bounce {
  animation: computer-mockup-hint-chevron 1.05s ease-in-out infinite;
}

@keyframes computer-mockup-hint-chevron {
  0%,
  100% {
    transform: translateY(0);
  }
  45% {
    transform: translateY(5px);
  }
  55% {
    transform: translateY(2px);
  }
}
</style>
