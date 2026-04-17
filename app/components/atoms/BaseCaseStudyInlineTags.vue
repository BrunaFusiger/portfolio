<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>

<template>
  <div
    class="case-study-prose flex flex-wrap items-center gap-x-.5 gap-y-2"
    role="list"
  >
    <template
      v-for="(item, index) in items"
      :key="item"
    >
      <span
        role="listitem"
        class="inline-flex max-w-full items-center whitespace-nowrap rounded-full bg-surface-subtle px-3 py-.5 font-body text-muted "
      >
        {{ item }}
      </span>
      <span
        v-if="index < items.length - 1"
        class="font-body text-muted select-none"
        aria-hidden="true"
      >,</span>
    </template>
  </div>
</template>
