<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  title: string
  description: string
  tags: string
  to: string
  paused?: boolean
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
    <!-- Media area -->
    <div
      ref="mediaRef"
      class="relative bg-surface-card flex-1 min-h-[200px] w-full rounded-[24px] overflow-hidden"
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
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          class="text-default"
          aria-hidden="true"
        >
          <path
            d="M4.667 11.333L11.333 4.667M11.333 4.667H6M11.333 4.667V10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>

    <Teleport to="body">
      <div
        v-show="isHovered && isArrowHovered"
        class="pointer-events-none fixed z-[200]"
        :style="{
          left: `${tipPos.x}px`,
          top: `${tipPos.y}px`,
          transform: 'translate(14px, calc(-100% - 10px))',
        }"
      >
        <div
          :id="tooltipId"
          role="tooltip"
          class="relative max-w-[min(240px,calc(100vw-24px))] rounded-lg border border-surface-subtle bg-surface-card px-2.5 py-1.5 font-body text-xs font-medium leading-4 tracking-[-0.01em] text-default shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-opacity duration-150 motion-reduce:transition-none dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
        >
          <span class="whitespace-nowrap">{{ t('work.readCaseStudy') }}</span>
          <span
            aria-hidden="true"
            class="absolute left-3 top-full h-0 w-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[var(--color-surface-card)]"
          />
        </div>
      </div>
    </Teleport>

    <!-- Copy block -->
    <div class="flex flex-col gap-6 items-start w-full shrink-0">
      <div class="flex flex-col gap-4 items-start w-full">
        <h3
          class="font-heading font-semibold text-default w-full text-xl leading-7 md:text-2xl md:leading-8"
        >
          {{ title }}
        </h3>
        <p
          class="font-body text-base leading-6 w-full transition-colors duration-300"
          :class="isHovered ? 'text-default' : 'text-muted'"
        >
          {{ description }}
        </p>
      </div>
      <p
        class="font-body text-xs leading-5 w-full transition-colors duration-300"
        :class="isHovered ? 'text-default' : 'text-muted'"
      >
        {{ tags }}
      </p>
    </div>
  </NuxtLink>
</template>
