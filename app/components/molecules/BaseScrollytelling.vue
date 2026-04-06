<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

interface ScrollytellingItem {
  title: string
  label: string
  image: string
}

const props = defineProps<{
  items: ScrollytellingItem[]
}>()

const sectionRefs = ref<(HTMLElement | null)[]>([])
const activeIndex = ref(0)
const reducedMotion = useReducedMotion()

let observer: IntersectionObserver | null = null
let rafScroll = 0

function setSectionRef(el: Element | ComponentPublicInstance | null, i: number) {
  const node = el && '$el' in el ? (el.$el as HTMLElement) : (el as HTMLElement | null)
  sectionRefs.value[i] = node
}

/**
 * Tall enough for sticky: first step matches the sticky stage height; later steps use min vh rails.
 */
const desktopTrackMinHeight = computed(() => {
  const n = props.items.length
  if (n < 1) return undefined
  const stage = '100dvh - var(--site-header-h, 0px)'
  if (n === 1) return `calc(${stage})`
  const tailVh = 45 + Math.max(0, n - 2) * 50
  return `calc((${stage}) + ${tailVh}vh)`
})

/** Vertical center of the main content band (below fixed header), matches sticky stage. */
function contentAreaMidY(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-h').trim()
  const headerPx = Number.parseFloat(raw) || 0
  return headerPx + (window.innerHeight - headerPx) / 2
}

/** Closest section center to that midline. */
function updateActiveSection() {
  if (!import.meta.client) return
  const els = sectionRefs.value
  if (!els.length || !els.some(Boolean)) return

  const midY = contentAreaMidY()
  let bestIdx = 0
  let bestDist = Number.POSITIVE_INFINITY

  els.forEach((el, i) => {
    if (!el) return
    const r = el.getBoundingClientRect()
    const sectionMid = r.top + r.height / 2
    const dist = Math.abs(sectionMid - midY)
    if (dist < bestDist) {
      bestDist = dist
      bestIdx = i
    }
  })

  activeIndex.value = bestIdx
}

function onScrollOrResize() {
  cancelAnimationFrame(rafScroll)
  rafScroll = requestAnimationFrame(updateActiveSection)
}

function setupObservers() {
  if (!import.meta.client || !props.items.length) return

  observer?.disconnect()
  observer = new IntersectionObserver(
    () => onScrollOrResize(),
    {
      root: null,
      rootMargin: '-35% 0px -35% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    },
  )

  nextTick(() => {
    sectionRefs.value.forEach((el) => {
      if (el) observer?.observe(el)
    })
    updateActiveSection()
  })
}

onMounted(() => {
  setupObservers()
  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })
})

watch(
  () => props.items,
  () => {
    sectionRefs.value = []
    nextTick(() => {
      setupObservers()
      onScrollOrResize()
    })
  },
  { deep: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScrollOrResize)
  window.removeEventListener('resize', onScrollOrResize)
  cancelAnimationFrame(rafScroll)
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <!-- sm: small detail image above copy -->
  <div class="flex flex-col gap-16 md:hidden">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="flex flex-col gap-1"
    >
      <NuxtImg
        :src="item.image"
        :alt="item.title"
        width="56"
        height="56"
        class="size-8 shrink-0 object-contain self-start opacity-90"
      />
      <div class="flex flex-col gap-2">
        <p class="font-heading font-semibold text-lg leading-8 text-muted">
          {{ item.title }}
        </p>
        <p class="font-body text-lg leading-7 text-muted">
          {{ item.label }}
        </p>
      </div>
    </div>
  </div>

  <!-- md+: two columns, sticky image centered in viewport while text scrolls -->
  <div
    class="hidden w-full md:grid md:grid-cols-2 md:items-stretch md:gap-8 lg:gap-10"
    :style="desktopTrackMinHeight ? { minHeight: desktopTrackMinHeight } : undefined"
  >
    <div class="min-w-0 flex flex-col">
      <section
        v-for="(item, i) in items"
        :key="i"
        :ref="(el) => setSectionRef(el, i)"
        class="flex items-center scroll-mt-8"
        :class="[
          i === 0
            ? 'min-h-[calc(100dvh-var(--site-header-h,0px))]'
            : i === items.length - 1
              ? 'min-h-[min(45vh,20rem)]'
              : 'min-h-[min(50vh,22rem)]',
        ]"
        :aria-current="activeIndex === i || undefined"
      >
        <div
          class="flex max-w-prose flex-col gap-2 transition-opacity duration-300 ease-out"
          :class="activeIndex === i ? 'opacity-100' : 'opacity-[0.38]'"
        >
          <p class="font-heading font-semibold text-xl leading-8 text-muted lg:text-2xl">
            {{ item.title }}
          </p>
          <p class="font-body text-lg leading-7 text-muted lg:text-2xl lg:leading-8">
            {{ item.label }}
          </p>
        </div>
      </section>
    </div>

    <div class="relative min-h-0 min-w-0 self-stretch">
      <div
        class="sticky flex w-full items-center justify-center overflow-hidden md:justify-end"
        style="top: var(--site-header-h, 0px); height: calc(100dvh - var(--site-header-h, 0px)); max-height: calc(100dvh - var(--site-header-h, 0px))"
      >
        <div class="relative aspect-square w-full max-w-[240px] sm:max-w-[280px] xl:max-w-[348px]">
          <NuxtImg
            v-for="(item, i) in items"
            :key="`${item.image}-${i}`"
            :src="item.image"
            :alt="item.title"
            width="348"
            height="348"
            sizes="(min-width: 1280px) 348px, (min-width: 768px) 280px, 200px"
            class="absolute inset-0 size-full object-contain transition-opacity ease-out"
            :class="[
              activeIndex === i ? 'z-10 opacity-100' : 'z-0 opacity-0',
              reducedMotion ? '' : 'duration-500',
            ]"
            :aria-hidden="activeIndex !== i"
          />
        </div>
      </div>
    </div>
  </div>
</template>
