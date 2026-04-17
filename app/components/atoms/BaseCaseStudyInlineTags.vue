<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>

<template>
  <div
    class="font-body text-muted text-base leading-tight md:text-lg xl:text-2xl flex flex-wrap items-center gap-x-.5 gap-y-2"
    role="list"
  >
    <span
      v-for="(item, index) in items"
      :key="item"
      role="listitem"
      class="inline-flex shrink-0 items-center gap-x-.5"
    >
      <span
        class="inline-flex items-center whitespace-nowrap rounded-full bg-surface-subtle px-3 p-t-.2 p-b-1.2 font-body text-muted"
      >
        {{ item }}
      </span>
      <span
        v-if="index < items.length - 1"
        class="font-body text-muted select-none"
        aria-hidden="true"
      >,</span>
    </span>
  </div>
</template>
