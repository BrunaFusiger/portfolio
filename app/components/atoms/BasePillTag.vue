<script setup lang="ts">
defineSlots<{
  default(): unknown
  icon?(): unknown
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full bg-surface-subtle px-3 py-1 font-body text-sm text-muted leading-6 whitespace-nowrap md:text-base"
  >
    <span
      v-if="$slots.icon"
      class="inline-flex shrink-0 items-center text-current [&>span]:block"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
    <span class="min-w-0">
      <slot />
    </span>
  </span>
</template>
