<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="flex w-full items-center justify-center px-4 md:px-0">
    <blockquote class="m-0 w-full max-w-[736px] border-none p-0">
      <p
        class="font-body font-normal text-[24px] leading-[32px] text-neutral-800 md:text-[32px] md:leading-[40px] dark:text-neutral-200"
      >
        {{ text }}
      </p>
    </blockquote>
  </div>
</template>
