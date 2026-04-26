<script setup lang="ts">
import { useReducedMotion } from '~/composables/useReducedMotion'
import { nuxtImgRasterDefaults } from '~/utils/nuxtImgRasterDefaults'

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
    screenImageSrc: undefined,
    screenVideoSrc: undefined,
    alt: undefined,
    caption: undefined,
    screenInset: undefined,
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
/** True once the user has scrolled the screen region away from the top. */
const hasUserScrolled = ref(false)
/** Mockup is sufficiently visible in the viewport (live IO signal, can flicker during page scroll). */
const isInView = ref(false)
/**
 * Once this mockup is scrollable while sufficiently intersecting, the scroll hint
 * stays eligible until the user scrolls this screen — independent of IO flicker on
 * other instances or page-level scroll while interacting with another mockup.
 */
const hintViewportLatch = ref(false)

let intersectionObserver: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null

const SCROLL_EPS = 1
const IO_THRESHOLD = 0.32

function updateScrollable() {
  const el = scrollRegionRef.value
  if (!el) {
    isScrollable.value = false
    return
  }
  const next = el.scrollHeight > el.clientHeight + SCROLL_EPS
  if (!next) hasUserScrolled.value = false
  isScrollable.value = next
  if (next && isInView.value) hintViewportLatch.value = true
}

function onIntersection(entries: IntersectionObserverEntry[]) {
  const entry = entries[0]
  if (!entry) return

  const intersecting = entry.isIntersecting && entry.intersectionRatio >= IO_THRESHOLD
  isInView.value = intersecting
  updateScrollable()
}

function syncScrollDismissed() {
  const el = scrollRegionRef.value
  if (!(el instanceof HTMLElement)) return
  if (el.scrollTop > SCROLL_EPS) hasUserScrolled.value = true
}

function onScrollRegionScroll(ev: Event) {
  const el = ev.currentTarget
  if (el instanceof HTMLElement && el.scrollTop > SCROLL_EPS) {
    hasUserScrolled.value = true
  }
}

const showScrollHint = computed(
  () => isScrollable.value && !hasUserScrolled.value && hintViewportLatch.value,
)

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
      syncScrollDismissed()
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
  intersectionObserver?.disconnect()
  intersectionObserver = null
  resizeObserver?.disconnect()
  resizeObserver = null
  scrollRegionRef.value?.removeEventListener('scroll', onScrollRegionScroll)
})

const hintWrapClass =
  'pointer-events-none absolute inset-x-0 bottom-2 z-20 flex translate-y-0 justify-center opacity-100'

const mouseScrollAnimClass = computed(() =>
  reducedMotion.value ? '' : 'computer-mockup-hint-mouse-anim',
)
</script>

<template>
  <figure class="w-full flex flex-col items-center">
    <div ref="mockupRootRef" class="relative w-full max-w-full select-none leading-none">
      <NuxtImg
        :src="mockupSrc"
        alt=""
        v-bind="nuxtImgRasterDefaults"
        class="pointer-events-none relative z-0 block h-auto w-full max-w-full align-top"
        sizes="100vw md:min(100vw, 1120px)"
        loading="lazy"
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
                v-bind="nuxtImgRasterDefaults"
                class="block h-auto w-full max-w-full min-w-0 align-top"
                sizes="(max-width: 768px) 85vw, 900px"
                loading="lazy"
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

          <Transition name="computer-mockup-hint" :css="!reducedMotion">
            <div
              v-show="showScrollHint"
              :class="hintWrapClass"
              aria-hidden="true"
              class="text-center"
            >
              <div
                class="flex flex-col items-center gap-0.5 rounded-full bg-black/55 px-3 py-2 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/15"
              >
                <svg
                  class="size-5 shrink-0 text-white/95"
                  :class="mouseScrollAnimClass"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="6.5"
                    y="3.5"
                    width="11"
                    height="17"
                    rx="5.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <rect
                    class="computer-mockup-hint-mouse-wheel"
                    x="9.25"
                    y="7.5"
                    width="5.5"
                    height="4"
                    rx="2"
                    fill="currentColor"
                    opacity="0.92"
                  />
                  <g
                    class="computer-mockup-hint-mouse-arrows"
                    stroke="currentColor"
                    stroke-width="1.35"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    opacity="0.55"
                  >
                    <path d="M12 15.5v3.5" />
                    <path d="M9.5 17.5L12 20l2.5-2.5" />
                  </g>
                </svg>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <figcaption
      v-if="showCaption"
      class="font-body mt-4 max-w-prose text-sm leading-6 text-subtle text-center w-full md:text-base"
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

.computer-mockup-hint-enter-active {
  transition:
    opacity 340ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

.computer-mockup-hint-leave-active {
  transition:
    opacity 520ms cubic-bezier(0.32, 0, 0.08, 1),
    transform 560ms cubic-bezier(0.26, 0.1, 0.12, 1);
}

.computer-mockup-hint-enter-from {
  opacity: 0;
  transform: translate3d(0, 8px, 0);
}

.computer-mockup-hint-enter-to,
.computer-mockup-hint-leave-from {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.computer-mockup-hint-leave-to {
  opacity: 0;
  transform: translate3d(0, 18px, 0);
}

.computer-mockup-hint-mouse-anim .computer-mockup-hint-mouse-wheel {
  transform-box: fill-box;
  transform-origin: 50% 40%;
  animation: computer-mockup-hint-wheel 2.1s cubic-bezier(0.45, 0.02, 0.2, 1) infinite;
}

.computer-mockup-hint-mouse-anim .computer-mockup-hint-mouse-arrows {
  transform-box: fill-box;
  transform-origin: 50% 72%;
  animation: computer-mockup-hint-arrows 2.1s cubic-bezier(0.45, 0.02, 0.2, 1) infinite;
  animation-delay: -0.35s;
}

@keyframes computer-mockup-hint-wheel {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 0.9;
  }
  18% {
    transform: translate3d(0, 1.25px, 0);
    opacity: 0.78;
  }
  42% {
    transform: translate3d(0, 4.25px, 0);
    opacity: 0.52;
  }
  58% {
    transform: translate3d(0, 4.75px, 0);
    opacity: 0.48;
  }
  82% {
    transform: translate3d(0, 1.1px, 0);
    opacity: 0.8;
  }
}

@keyframes computer-mockup-hint-arrows {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 0.5;
  }
  22% {
    transform: translate3d(0, 1.5px, 0);
    opacity: 0.62;
  }
  48% {
    transform: translate3d(0, 3.75px, 0);
    opacity: 0.82;
  }
  62% {
    transform: translate3d(0, 4px, 0);
    opacity: 0.78;
  }
  85% {
    transform: translate3d(0, 0.75px, 0);
    opacity: 0.55;
  }
}
</style>
