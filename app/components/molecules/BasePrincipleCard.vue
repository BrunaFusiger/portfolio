<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  title: string
  description: string
  tags: string
  to: string
  paused?: boolean
  /** Solid fill behind media (e.g. Figma hex). When unset, parent slot should set `coverBg` classes. */
  mediaBackgroundColor?: string
}>()

const emit = defineEmits<{
  'hover-in': []
  'hover-out': []
}>()

const isHovered = ref(false)
const isArrowHovered = ref(false)
const tipPos = ref({ x: 0, y: 0 })
const mediaRef = ref<HTMLElement | null>(null)
const tooltipId = useId()

function onEnter() {
  isHovered.value = true
  emit('hover-in')
}

function onLeave() {
  isHovered.value = false
  isArrowHovered.value = false
  emit('hover-out')
}

function onArrowEnter(e: MouseEvent) {
  isArrowHovered.value = true
  tipPos.value = { x: e.clientX, y: e.clientY }
}

function onArrowMove(e: MouseEvent) {
  if (!isArrowHovered.value) return
  tipPos.value = { x: e.clientX, y: e.clientY }
}

function onArrowLeave() {
  isArrowHovered.value = false
}

watch(isHovered, (v) => {
  if (!v) isArrowHovered.value = false
})

watch(
  () => props.paused,
  (shouldPause) => {
    const video = mediaRef.value?.querySelector('video')
    if (!video) return
    if (shouldPause) video.pause()
    else video.play().catch(() => {})
  },
)
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative flex h-full flex-col gap-6 items-start rounded-[32px] pt-4 pb-8 px-4 w-full border border-surface-subtle transition-colors duration-300 cursor-pointer"
    :class="[isHovered ? 'bg-surface-card' : 'bg-surface-background']"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!-- Media area: fixed aspect so layout does not depend on image/Lottie decode -->
    <div
      ref="mediaRef"
      class="relative w-full shrink-0 overflow-hidden rounded-[24px] bg-transparent aspect-[8/5]"
      :style="mediaBackgroundColor ? { backgroundColor: mediaBackgroundColor } : undefined"
    >
      <slot name="media" :paused="paused ?? false" />
    </div>

    <!-- Expand control + Figma-style pointer tooltip -->
    <div
      class="absolute top-4 right-4 z-20 flex flex-col items-end gap-0 transition-opacity duration-300"
      :class="isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      @mouseenter="onArrowEnter"
      @mousemove="onArrowMove"
      @mouseleave="onArrowLeave"
    >
      <span
        class="size-10 rounded-full bg-surface-background flex items-center justify-center border border-surface-subtle shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        :aria-describedby="isArrowHovered ? tooltipId : undefined"
      >
        <BaseArrowOutIcon class="size-4 text-default" />
      </span>
    </div>

    <BaseCursorTooltip
      :id="tooltipId"
      :visible="isHovered && isArrowHovered"
      :x="tipPos.x"
      :y="tipPos.y"
      :label="t('work.readCaseStudy')"
    />

    <!-- Copy block: mt-auto keeps copy at bottom when the grid stretches card height -->
    <div class="mt-auto flex w-full shrink-0 flex-col items-start gap-6">
      <div class="flex flex-col gap-4 items-start w-full">
        <h3
          class="font-heading font-semibold text-default w-full text-xl leading-7 md:text-2xl md:leading-8"
          v-text="title"
        />
        <p
          class="font-body text-base leading-6 w-full transition-colors duration-300"
          :class="isHovered ? 'text-default' : 'text-muted'"
          v-text="description"
        />
      </div>
      <p
        class="font-body text-xs leading-5 w-full transition-colors duration-300"
        :class="isHovered ? 'text-default' : 'text-muted'"
        v-text="tags"
      />
    </div>
  </NuxtLink>
</template>
