<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    variant?: 'static' | 'pulse'
  }>(),
  { label: 'Media', variant: 'static' },
)
</script>

<template>
  <div
    class="flex items-center justify-center"
    :class="variant === 'pulse' ? 'media-placeholder-pulse' : ''"
    :style="caseStudyMediaStripeStyle"
  >
    <span
      class="font-heading text-[10px] md:text-xs font-medium uppercase tracking-widest text-muted/70 px-4 text-center"
    >
      {{ label }}
    </span>
  </div>
</template>
