<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <h3
    class="font-heading font-semibold text-xl md:text-2xl text-default max-w-prose"
  >
    {{ text }}
  </h3>
</template>
