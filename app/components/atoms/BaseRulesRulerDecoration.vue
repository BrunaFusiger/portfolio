<script setup lang="ts">
/**
 * Horizontal tick lengths repeat every 6 marks (matches original SVG rhythm).
 */
const TICK_LENGTHS = [24, 24, 32, 24, 24, 40] as const
const TICK_SPACING = 16
const START_Y = 7.5
/** SVG user units; tall enough to slice-scale on long sections without gaps. */
const VIEW_HEIGHT = 2400
const VIEW_WIDTH = 40

defineProps<{
  side: 'left' | 'right'
}>()

const ticks = (() => {
  const out: { y: number; x2: number }[] = []
  let y = START_Y
  let i = 0
  while (y <= VIEW_HEIGHT - 8) {
    out.push({ y, x2: TICK_LENGTHS[i % TICK_LENGTHS.length]! })
    y += TICK_SPACING
    i += 1
  }
  return out
})()
</script>

<template>
  <svg
    :viewBox="`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMin slice"
    aria-hidden="true"
    class="pointer-events-none absolute inset-y-0 z-0 hidden h-full w-[clamp(12px,3.5vw,40px)] text-surface-subtle select-none md:block"
    :class="side === 'left' ? 'left-0' : 'right-0 -scale-x-100'"
  >
    <g stroke="currentColor" stroke-width="1">
      <line v-for="(t, idx) in ticks" :key="idx" :x1="0" :y1="t.y" :x2="t.x2" :y2="t.y" />
    </g>
  </svg>
</template>
