<script setup lang="ts">
import { caseStudyMediaStripeStyle } from '~/utils/caseStudyAspect'

withDefaults(defineProps<{ label?: string }>(), { label: 'Media' })
</script>

<template>
  <div
    class="flex items-center justify-center"
    :style="caseStudyMediaStripeStyle"
  >
    <span
      class="font-heading text-[10px] md:text-xs font-medium uppercase tracking-widest text-muted/70 px-4 text-center"
    >
      {{ label }}
    </span>
  </div>
</template>
