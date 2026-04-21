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
    class="font-heading font-semibold text-default mb-0 block w-full text-xl leading-[26px] md:text-[22px] md:leading-[30px] lg:text-[26px] lg:leading-[34px] xl:text-[30px] xl:leading-[38px] -mb-6 md:-mb-8"
    :class="liftAfterVisual ? 'mt-6 md:mt-8' : ''"
  >
    {{ text }}
  </h3>
</template>
