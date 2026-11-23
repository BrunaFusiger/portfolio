<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    /** Extra space when this subheading sits under a figure-based block (video, screenshot, etc.). */
    liftAfterVisual?: boolean
  }>(),
  { liftAfterVisual: false },
)
</script>

<template>
  <h3
    class="font-heading font-semibold text-default mb-0 block w-full text-base leading-6 md:text-lg md:leading-7 -mb-6 md:-mb-8"
    :class="liftAfterVisual ? 'mt-6 md:mt-8' : ''"
  >
    {{ text }}
  </h3>
</template>
