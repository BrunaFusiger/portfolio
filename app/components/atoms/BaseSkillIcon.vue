<script setup lang="ts">
import type { SkillIconName } from '~/constants/skills-data'

defineProps<{
  name: SkillIconName
}>()
</script>

<template>
  <svg
    v-if="name === 'user-star'"
    class="size-3 text-muted"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M10.67 14v-1.33A2.67 2.67 0 0 0 8 10H4.67A2.67 2.67 0 0 0 2 12.67V14" />
    <circle cx="6.33" cy="5.33" r="2.67" />
    <path d="M12 5.33l.67 1.34L14 7.33l-1.33.67-.67 1.33-.67-1.33L10 7.33l1.33-.66z" />
  </svg>
  <svg
    v-else-if="name === 'search'"
    class="size-3 text-muted"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M14 14l-3.2-3.2" />
  </svg>
  <svg
    v-else-if="name === 'computer'"
    class="size-3 text-muted"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="1.5" y="2.5" width="13" height="8.5" rx="1" />
    <path d="M5.5 14h5M8 11v3" />
  </svg>
  <svg
    v-else-if="name === 'rocket'"
    class="size-3 text-muted"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M8 12.67s-2-1.34-3.33-4C3.33 6 4 2.67 8 1.33c4 1.34 4.67 4.67 3.33 7.34-1.33 2.66-3.33 4-3.33 4z" />
    <circle cx="8" cy="6" r="1.33" />
    <path d="M5.33 10.67L3.33 14l2.67-.67M10.67 10.67L12.67 14l-2.67-.67" />
  </svg>
  <svg
    v-else-if="name === 'ai'"
    class="size-3 text-muted"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="8" cy="8" r="2" />
    <path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.76 3.76l1.41 1.41M10.83 10.83l1.41 1.41M3.76 12.24l1.41-1.41M10.83 5.17l1.41-1.41" />
  </svg>
  <svg v-else-if="name === 'grid'" class="size-3 text-muted" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="4" cy="4" r="1.2" />
    <circle cx="8" cy="4" r="1.2" />
    <circle cx="12" cy="4" r="1.2" />
    <circle cx="4" cy="8" r="1.2" />
    <circle cx="8" cy="8" r="1.2" />
    <circle cx="12" cy="8" r="1.2" />
    <circle cx="4" cy="12" r="1.2" />
    <circle cx="8" cy="12" r="1.2" />
    <circle cx="12" cy="12" r="1.2" />
  </svg>
</template>
