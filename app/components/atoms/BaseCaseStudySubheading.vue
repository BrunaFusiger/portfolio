<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <h3
    class="font-heading font-semibold text-default w-full text-xl leading-[26px] md:text-[22px] md:leading-[30px] lg:text-[26px] lg:leading-[34px] xl:text-[30px] xl:leading-[38px]"
  >
    {{ text }}
  </h3>
</template>
