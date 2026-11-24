<script setup lang="ts">
withDefaults(
  defineProps<{
    direction?: 'left' | 'right'
  }>(),
  { direction: 'right' },
)
</script>

<template>
  <svg
    class="size-[11px] shrink-0 text-default"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      :d="direction === 'left' ? 'M15 18 9 12l6-6' : 'm9 18 6-6-6-6'"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
