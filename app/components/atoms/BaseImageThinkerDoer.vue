<script setup lang="ts">
defineProps<{
  alt?: string
}>()
</script>

<template>
  <figure class="relative w-full m-0 overflow-hidden">
    <NuxtImg
      src="/media/illustrations/thinker-doer.png"
      :alt="alt ?? ''"
      v-bind="nuxtImgRasterDefaults"
      class="w-full h-auto block mix-blend-exclusion"
      sizes="(max-width: 768px) 100vw, 626px"
      loading="lazy"
    />
  </figure>
</template>
