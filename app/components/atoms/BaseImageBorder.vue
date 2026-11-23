<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    tooltip: string
    sizes?: string
    collage?: boolean
  }>(),
  { sizes: '175px', collage: false },
)

const sizeClass = computed(() =>
  props.collage
    ? 'w-[168px] h-[192px] md:w-[175px] md:h-[201px]'
    : 'w-[140px] h-[160px] md:w-[175px] md:h-[201px]',
)

const polaroidBorderClass = computed(() =>
  props.collage ? 'border-[7px] md:border-8' : 'border-[6px] md:border-8',
)

const imgSizes = computed(() =>
  props.collage ? '(max-width:767px) 216px, 175px' : props.sizes,
)

const isLgUp = useMediaQuery('(min-width: 1024px)', { defaultValue: false })

const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)
const tooltipId = useId()

watch(isLgUp, (lg) => {
  if (!lg) isHovering.value = false
})

function onMove(e: MouseEvent) {
  if (!isLgUp.value) return
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

function onMouseEnter() {
  if (!isLgUp.value) return
  isHovering.value = true
}

function onMouseLeave() {
  isHovering.value = false
}
</script>

<template>
  <div
    class="relative cursor-default overflow-hidden rounded-2xl shadow-xl"
    :class="sizeClass"
    role="img"
    :aria-label="alt"
    :aria-describedby="isLgUp ? tooltipId : undefined"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousemove="onMove"
  >
    <div
      class="size-full rounded-2xl border-white bg-neutral-200 shadow-[3px_4px_20px_0px_rgba(0,0,0,0.25)] overflow-hidden"
      :class="polaroidBorderClass"
    >
      <NuxtImg
        :src="src"
        :alt="alt"
        v-bind="nuxtImgRasterDefaults"
        class="size-full object-cover pointer-events-none select-none"
        :sizes="imgSizes"
        loading="lazy"
      />
    </div>

    <BaseCursorTooltip
      v-if="isLgUp"
      :id="tooltipId"
      :visible="isHovering"
      :x="mouseX"
      :y="mouseY"
      :label="tooltip"
    />
  </div>
</template>
