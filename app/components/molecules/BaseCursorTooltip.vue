<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    visible: boolean
    x: number
    y: number
    label: string
    /** Optional stable id for `aria-describedby` on the hover target. */
    id?: string
    /** Horizontal offset from cursor (px). */
    offsetX?: number
    /** Extra lift above cursor: transform uses calc(-100% - gapPx). */
    gapPx?: number
  }>(),
  {
    offsetX: 14,
    gapPx: 10,
  },
)

const autoId = useId()
const tooltipId = computed(() => props.id ?? autoId)
</script>

<template>
  <Teleport to="body">
    <div
      v-show="visible"
      class="pointer-events-none fixed z-[200]"
      :style="{
        left: `${props.x}px`,
        top: `${props.y}px`,
        transform: `translate(${props.offsetX}px, calc(-100% - ${props.gapPx}px))`,
      }"
    >
      <div
        :id="tooltipId"
        role="tooltip"
        class="relative max-w-[min(240px,calc(100vw-24px))] break-words rounded-lg border border-surface-subtle bg-surface-card px-2.5 py-1.5 font-body text-xs font-medium leading-4 tracking-[-0.01em] text-default shadow-[0_4px_16px_rgba(0,0,0,0.08)] motion-reduce:transition-none dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
      >
        <span class="block" v-text="label" />
        <span
          aria-hidden="true"
          class="absolute left-3 top-full h-0 w-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[var(--color-surface-card)]"
        />
      </div>
    </div>
  </Teleport>
</template>
