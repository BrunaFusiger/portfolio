<script setup lang="ts">
import { nuxtImgRasterDefaults } from '~/utils/nuxtImgRasterDefaults'

withDefaults(
  defineProps<{
    /** Public path to the tape image. */
    src?: string
    alt?: string
    /** Hint for layout / `sizes` (optional). */
    width?: string | number
    height?: string | number
    sizes?: string
  }>(),
  {
    src: '/media/utils/piece-red-paper-tape-blank-background.png',
    alt: 'A torn piece of red paper tape',
  },
)
</script>

<template>
  <span class="inline-block select-none leading-none">
    <NuxtImg
      :src="src"
      :alt="alt"
      v-bind="nuxtImgRasterDefaults"
      :width="width"
      :height="height"
      :sizes="sizes"
      class="block h-auto max-w-full pointer-events-none dark:saturate-0"
      loading="lazy"
    />
  </span>
</template>
