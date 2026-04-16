<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>

<template>
  <div
    class="case-study-prose flex flex-wrap gap-x-2 gap-y-2"
    role="list"
  >
    <span
      v-for="item in items"
      :key="item"
      role="listitem"
      class="inline-flex max-w-full items-center whitespace-nowrap rounded-full bg-surface-subtle px-2 py-1 font-body text-muted md:px-2.5"
    >
      {{ item }}
    </span>
  </div>
</template>
