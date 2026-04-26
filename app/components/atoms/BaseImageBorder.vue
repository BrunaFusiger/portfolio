<script setup lang="ts">
import { nuxtImgRasterDefaults } from '~/utils/nuxtImgRasterDefaults'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    tooltip: string
    scratched?: boolean
    sizes?: string
    collage?: boolean
  }>(),
  { scratched: false, sizes: '175px', collage: false },
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

const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)
const tooltipId = useId()

function onMove(e: MouseEvent) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}
</script>

<template>
  <div
    class="relative cursor-default overflow-hidden rounded-2xl shadow-xl"
    :class="sizeClass"
    role="img"
    :aria-label="alt"
    :aria-describedby="tooltipId"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @mousemove="onMove"
  >
    <div
      class="h-full w-full rounded-2xl border-white bg-neutral-200 shadow-[3px_4px_20px_0px_rgba(0,0,0,0.25)] overflow-hidden dark:border-neutral-200 dark:bg-neutral-700 dark:shadow-[3px_4px_20px_0px_rgba(0,0,0,0.5)]"
      :class="polaroidBorderClass"
    >
      <NuxtImg
        :src="src"
        :alt="alt"
        v-bind="nuxtImgRasterDefaults"
        class="h-full w-full object-cover pointer-events-none select-none"
        :sizes="imgSizes"
        loading="lazy"
      />
    </div>

    <div
      v-if="scratched"
      class="absolute top-[-50px] right-[-52px] w-[111px] h-[111px] flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <div class="rotate-[28.7deg]">
        <NuxtImg
          src="/media/utils/scratched.png"
          alt=""
          v-bind="nuxtImgRasterDefaults"
          class="w-[82px] h-[82px] object-contain -scale-y-100"
          loading="lazy"
          sizes="82px"
        />
      </div>
    </div>

    <BaseCursorTooltip
      :id="tooltipId"
      :visible="isHovering"
      :x="mouseX"
      :y="mouseY"
      :label="tooltip"
    />
  </div>
</template>
