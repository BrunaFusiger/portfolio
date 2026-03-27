<script setup lang="ts">
defineProps<{
  alt?: string
}>()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <figure class="relative w-full m-0 overflow-hidden">
    <NuxtImg
      :src="isDark ? '/images/illustrations/thinker-doer-light.png' : '/images/illustrations/thinker-doer.png'"
      :alt="alt ?? ''"
      class="w-full h-auto block mix-blend-exclusion"
      sizes="(max-width: 768px) 100vw, 626px"
      loading="lazy"
      format="webp"
      decoding="async"
    />
  </figure>
</template>
