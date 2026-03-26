<script setup lang="ts">
defineProps<{
  to: string
  /** Accessible name when the visible label is absent or insufficient */
  label: string
  /** Visible text to the right of the icon (optional) */
  caption?: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    :aria-label="label"
    class="group inline-flex max-w-full items-center gap-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2"
    :class="caption ? 'w-full justify-start' : 'mx-auto justify-center'"
  >
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-full border border-surface-subtle bg-surface-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
    >
      <BaseArrowOutIcon class="size-4 text-muted transition-colors group-hover:text-default" />
    </span>
    <span
      v-if="caption"
      class="min-w-0 text-left font-body text-sm font-medium leading-5 text-default transition-colors group-hover:text-brand"
    >
      {{ caption }}
    </span>
  </NuxtLink>
</template>
