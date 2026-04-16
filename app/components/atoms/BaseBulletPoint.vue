<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="flex gap-4 items-center w-full">
    <div class="size-1 shrink-0 rounded-full bg-[var(--color-text-link)]" />
    <p class="flex-1 case-study-prose">
      {{ text }}
    </p>
  </div>
</template>
