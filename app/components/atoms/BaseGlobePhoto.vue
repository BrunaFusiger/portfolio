<script setup lang="ts">
import { nuxtImgRasterDefaults } from '~/utils/nuxtImgRasterDefaults'

const props = defineProps<{
  src: string
  alt: string
  caption: string
  tooltip?: string
}>()

const isLgUp = useMediaQuery('(min-width: 1024px)', { defaultValue: false })

const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)
const tooltipId = useId()

const hasTooltip = computed(() => isLgUp.value && !!props.tooltip)

watch(isLgUp, (lg) => {
  if (!lg) isHovering.value = false
})

function onMove(e: MouseEvent) {
  if (!hasTooltip.value) return
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

function onMouseEnter() {
  if (!hasTooltip.value) return
  isHovering.value = true
}

function onMouseLeave() {
  isHovering.value = false
}
</script>

<template>
  <figure
    class="m-0 flex w-[76px] flex-col gap-1 bg-white p-1 pb-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] md:w-[104px] md:gap-1.5 md:p-1.5 md:pb-2"
    role="img"
    :aria-label="alt"
    :aria-describedby="hasTooltip ? tooltipId : undefined"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousemove="onMove"
  >
    <NuxtImg
      :src="src"
      :alt="alt"
      v-bind="nuxtImgRasterDefaults"
      class="aspect-square w-full bg-neutral-100 object-cover pointer-events-none select-none"
      sizes="(max-width:767px) 76px, 104px"
      loading="lazy"
    />
    <figcaption
      class="truncate text-center font-heading text-[9px] font-medium leading-3 text-neutral-700 md:text-[11px] md:leading-4"
      aria-hidden="true"
    >
      {{ caption }}
    </figcaption>

    <BaseCursorTooltip
      v-if="hasTooltip && tooltip"
      :id="tooltipId"
      :visible="isHovering"
      :x="mouseX"
      :y="mouseY"
      :label="tooltip"
    />
  </figure>
</template>
