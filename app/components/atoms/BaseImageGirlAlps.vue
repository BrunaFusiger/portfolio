<script setup lang="ts">
const props = defineProps<{
  /** Alt text for the illustration */
  alt?: string
}>()

const figureAttrs = computed(() =>
  props.alt
    ? { role: 'img' as const, 'aria-label': props.alt }
    : { 'aria-hidden': true as const },
)
</script>

<template>
  <figure class="relative w-full m-0" v-bind="figureAttrs">
    <BaseGirlAlps />
  </figure>
</template>
