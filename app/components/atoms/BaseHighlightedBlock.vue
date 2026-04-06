<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="bg-surface-subtle flex items-center justify-center p-6 md:p-8 rounded-[32px] w-full">
    <p class="font-body text-muted text-lg md:text-2xl leading-7">
      {{ text }}
    </p>
  </div>
</template>
