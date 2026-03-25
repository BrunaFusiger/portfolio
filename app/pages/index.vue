
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const isLg = ref(false)
let media: MediaQueryList | null = null

function syncPaperMq() {
  if (media) isLg.value = media.matches
}

onMounted(() => {
  media = window.matchMedia('(min-width: 1024px)')
  syncPaperMq()
  media.addEventListener('change', syncPaperMq)
})

onUnmounted(() => {
  media?.removeEventListener('change', syncPaperMq)
})

/** Matches layout: sheet on the right below lg, on the left at lg+. */
const paperSide = computed(() => (isLg.value ? 'left' : 'right'))
</script>

<template>
  <div class="relative isolate w-full">
    <div
      class="pointer-events-none absolute top-180 md:top-210 h-60 w-60 -right-35 lg:-left-50 z-0 lg:top-30 lg:h-80 lg:w-80"
      aria-hidden="true"
    >
      <TornPaperDecor :side="paperSide" />
    </div>
    <SectionHero class="relative z-1" />
  </div>
</template>

