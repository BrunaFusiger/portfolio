<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="flex gap-4 items-center w-full">
    <div class="size-2 shrink-0 rounded-full bg-[var(--color-text-link)]" />
    <p class="flex-1 font-body text-muted text-lg md:text-2xl leading-7">
      {{ text }}
    </p>
  </div>
</template>
