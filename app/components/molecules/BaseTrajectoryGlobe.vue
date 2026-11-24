<script setup lang="ts">
import type { TrajectoryStop } from '~/types/trajectory'

const props = defineProps<{
  stops: readonly TrajectoryStop[]
}>()

const MIN_FACING_TO_SHOW = 0.2

const FAN_LAYOUTS: Record<number, readonly string[]> = {
  1: ['-translate-x-1/2 -translate-y-[calc(100%+14px)] -rotate-3'],
  2: [
    '-translate-x-[calc(100%-6px)] -translate-y-[calc(100%+10px)] -rotate-6',
    '-translate-x-[6px] -translate-y-[calc(100%+18px)] rotate-4',
  ],
  3: [
    '-translate-x-[calc(150%-4px)] -translate-y-[calc(100%+6px)] -rotate-6',
    '-translate-x-1/2 -translate-y-[calc(100%+26px)] rotate-2',
    'translate-x-[calc(50%+4px)] -translate-y-[calc(100%+6px)] rotate-6',
  ],
  4: [
    '-translate-x-[calc(200%-2px)] -translate-y-[calc(100%+2px)] -rotate-8',
    '-translate-x-[calc(100%-2px)] -translate-y-[calc(100%+24px)] -rotate-2',
    '-translate-x-[2px] -translate-y-[calc(100%+24px)] rotate-3',
    'translate-x-[calc(100%-2px)] -translate-y-[calc(100%+2px)] rotate-7',
  ],
}

const SWIPE_MIN_DISTANCE = 40

const POP_DELAYS = ['delay-0', 'delay-30', 'delay-60', 'delay-90'] as const

const INSIDE_MARKER_CLASS = '-translate-1/2 rotate-0 scale-0 opacity-0 pointer-events-none'

const canvas = ref<HTMLCanvasElement | null>(null)
const activeIndex = ref(0)

const { projectedStops, hasEnteredView } = useTrajectoryGlobe(canvas, () => props.stops, activeIndex)

const activeStop = computed(() => props.stops[activeIndex.value])
const isFirst = computed(() => activeIndex.value === 0)
const isLast = computed(() => activeIndex.value === props.stops.length - 1)

function fanClass(photoCount: number, photoIndex: number) {
  const layout = FAN_LAYOUTS[Math.min(photoCount, 4)] ?? FAN_LAYOUTS[1]!
  return layout[photoIndex % layout.length]
}

function isStopShown(index: number) {
  const point = projectedStops.value[index]
  return index === activeIndex.value && hasEnteredView.value && !!point && point.facing > MIN_FACING_TO_SHOW
}

function photoClass(stopIndex: number, photoCount: number, photoIndex: number) {
  if (!isStopShown(stopIndex)) return INSIDE_MARKER_CLASS
  return [fanClass(photoCount, photoIndex), 'scale-100 opacity-100', POP_DELAYS[photoIndex % POP_DELAYS.length]]
}

type ArrowControl = {
  direction: 'left' | 'right'
  label: string
  disabled: boolean
  go: () => void
  edgeClass: string
}

const arrows = computed<ArrowControl[]>(() => [
  { direction: 'left', label: 'Previous place', disabled: isFirst.value, go: previous, edgeClass: 'left-0' },
  { direction: 'right', label: 'Next place', disabled: isLast.value, go: next, edgeClass: 'right-0' },
])

let swipeStart: { x: number, y: number } | null = null

function onSwipeStart(event: PointerEvent) {
  swipeStart = { x: event.clientX, y: event.clientY }
}

function onSwipeEnd(event: PointerEvent) {
  if (!swipeStart) return
  const dx = event.clientX - swipeStart.x
  const dy = event.clientY - swipeStart.y
  swipeStart = null
  if (Math.abs(dx) < SWIPE_MIN_DISTANCE || Math.abs(dx) < Math.abs(dy)) return
  if (dx < 0) next()
  else previous()
}

function onSwipeCancel() {
  swipeStart = null
}

function goTo(index: number) {
  activeIndex.value = Math.min(Math.max(index, 0), props.stops.length - 1)
}

function previous() {
  goTo(activeIndex.value - 1)
}

function next() {
  goTo(activeIndex.value + 1)
}
</script>

<template>
  <div
    class="flex flex-col items-center gap-8 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4"
    role="region"
    aria-roledescription="carousel"
    aria-label="My trajectory"
    tabindex="0"
    @keydown.left.prevent="previous"
    @keydown.right.prevent="next"
  >
    <div
      class="relative aspect-square w-full max-w-[560px] touch-pan-y select-none"
      @pointerdown="onSwipeStart"
      @pointerup="onSwipeEnd"
      @pointercancel="onSwipeCancel"
    >
      <canvas
        ref="canvas"
        class="block size-full [mask-image:radial-gradient(circle_at_center,black_52%,transparent_71%)]"
        aria-hidden="true"
      />

      <div
        v-for="(stop, stopIndex) in stops"
        :key="stop.id"
        class="absolute size-0"
        :class="stopIndex === activeIndex ? 'z-10' : 'z-0'"
        :style="{
          left: `${(projectedStops[stopIndex]?.x ?? 0.5) * 100}%`,
          top: `${(projectedStops[stopIndex]?.y ?? 0.5) * 100}%`,
        }"
      >
        <div
          v-for="(photo, photoIndex) in stop.photos"
          :key="photo.src"
          class="absolute left-0 top-0 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
          :class="photoClass(stopIndex, stop.photos.length, photoIndex)"
          :aria-hidden="isStopShown(stopIndex) ? undefined : 'true'"
        >
          <BaseGlobePhoto
            :src="photo.src"
            :alt="photo.alt"
            :caption="String(photo.year)"
            :tooltip="photo.tooltip"
          />
        </div>
      </div>

      <BaseIconDisk
        v-for="arrow in arrows"
        :key="`edge-${arrow.direction}`"
        as="button"
        size="lg"
        interaction="button"
        variant="fab"
        class="absolute top-1/2 z-20 -translate-y-1/2 md:hidden"
        :class="[arrow.edgeClass, arrow.disabled && 'pointer-events-none opacity-35']"
        :aria-disabled="arrow.disabled"
        :aria-label="arrow.label"
        @click="arrow.go"
      >
        <BaseChevronIcon :direction="arrow.direction" />
      </BaseIconDisk>
    </div>

    <div class="flex w-full max-w-[560px] flex-col gap-4">
      <div class="hidden items-center justify-between md:flex">
        <BaseIconDisk
          v-for="arrow in arrows"
          :key="arrow.direction"
          as="button"
          size="lg"
          interaction="button"
          variant="fab"
          :class="arrow.disabled && 'pointer-events-none opacity-35'"
          :aria-disabled="arrow.disabled"
          :aria-label="arrow.label"
          @click="arrow.go"
        >
          <BaseChevronIcon :direction="arrow.direction" />
        </BaseIconDisk>
      </div>

      <div v-if="activeStop" aria-live="polite" class="flex flex-col gap-2">
        <p class="m-0 flex items-center gap-2 font-heading text-base font-semibold text-default">
          <span class="size-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
          {{ activeStop.place }}
        </p>
        <p class="m-0 font-body text-base leading-7 text-default">
          {{ activeStop.text }}
        </p>
      </div>
    </div>
  </div>
</template>
