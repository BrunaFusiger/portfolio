<script setup lang="ts">
defineProps<{
  value: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-col gap-2 items-start text-muted w-full">
    <p class="font-heading font-medium text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] w-full text-default">
      {{ value }}
    </p>
    <p class="case-study-prose w-full">
      {{ description }}
    </p>
  </div>
</template>
