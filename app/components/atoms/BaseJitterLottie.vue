<script setup lang="ts">
import type { AnimationItem } from 'lottie-web'

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{ complete: [] }>()

const props = withDefaults(
  defineProps<{
    /** Public URL to Lottie JSON (e.g. `/animations/name.json`). */
    src: string
    /** Pauses playback when another card is hovered. */
    paused?: boolean
    loop?: boolean
    /**
     * Defer loading until the block is near the viewport (smaller initial payload).
     */
    lazy?: boolean
    /**
     * `slice` crops to fill the container; `meet` fits the whole animation inside.
     */
    fit?: 'slice' | 'meet'
  }>(),
  {
    paused: false,
    loop: true,
    lazy: true,
    fit: 'slice',
  },
)

const rootRef = ref<HTMLElement | null>(null)
const hostRef = ref<HTMLDivElement | null>(null)

let animation: AnimationItem | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

function syncPause() {
  if (!animation) return
  if (props.paused) animation.pause()
  else animation.play()
}

async function init() {
  if (!import.meta.client || !hostRef.value || animation) return

  const lottie = (await import('lottie-web')).default

  animation = lottie.loadAnimation({
    container: hostRef.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: !props.paused,
    path: props.src,
    rendererSettings: {
      preserveAspectRatio: `xMidYMid ${props.fit}`,
    },
  })

  animation.addEventListener('DOMLoaded', () => {
    animation?.resize()
    syncPause()
  })

  animation.addEventListener('complete', () => emit('complete'))

  resizeObserver = new ResizeObserver(() => animation?.resize())
  resizeObserver.observe(hostRef.value)
}

function destroy() {
  resizeObserver?.disconnect()
  resizeObserver = null
  animation?.destroy()
  animation = null
}

function startLazy() {
  if (!props.lazy) {
    void init()
    return
  }
  if (!rootRef.value) return

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      intersectionObserver?.disconnect()
      intersectionObserver = null
      void init()
    },
    { rootMargin: '120px', threshold: 0.01 },
  )
  intersectionObserver.observe(rootRef.value)
}

onMounted(() => {
  // Refs live inside the template root (not ClientOnly), and lazy IO needs layout;
  // wait one frame so flex/absolute sizing is resolved.
  nextTick(() => {
    requestAnimationFrame(() => startLazy())
  })
})

onBeforeUnmount(() => {
  intersectionObserver?.disconnect()
  intersectionObserver = null
  destroy()
})

watch(
  () => props.src,
  async () => {
    intersectionObserver?.disconnect()
    intersectionObserver = null
    destroy()
    await nextTick()
    if (!props.lazy) {
      void init()
      return
    }
    if (!import.meta.client || !rootRef.value) return
    const { top, bottom } = rootRef.value.getBoundingClientRect()
    const vh = window.innerHeight
    const margin = 120
    const nearViewport = bottom > -margin && top < vh + margin
    if (nearViewport) void init()
    else startLazy()
  },
)

watch(() => props.paused, syncPause)
</script>

<template>
  <!--
    Single DOM root so classes from the parent (e.g. absolute inset-0) apply.
    Lottie only runs on client inside init(); SSR outputs the same box for layout.
  -->
  <div
    ref="rootRef"
    v-bind="$attrs"
    class="[&_svg]:block [&_svg]:size-full"
    aria-hidden="true"
  >
    <div ref="hostRef" class="size-full" />
  </div>
</template>
