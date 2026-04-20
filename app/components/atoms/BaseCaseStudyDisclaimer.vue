<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <aside
    role="note"
    class="flex items-start gap-3 md:gap-4 w-full bg-surface-subtle rounded-2xl md:rounded-3xl px-4 py-4 md:px-6 md:py-5"
  >
    <span
      class="i-hugeicons-information-circle size-5 md:size-6 shrink-0 text-muted mt-[2px] md:mt-[3px]"
      aria-hidden="true"
    />
    <p class="font-heading font-normal text-muted text-sm leading-[1.5] md:text-base md:leading-[1.55]">
      {{ text }}
    </p>
  </aside>
</template>
