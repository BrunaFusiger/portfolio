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
    <p
      class="font-body text-muted text-base leading-6 md:text-lg md:leading-7 xl:text-2xl xl:leading-7 w-full"
    >
      {{ description }}
    </p>
  </div>
</template>
