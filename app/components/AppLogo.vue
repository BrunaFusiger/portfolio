<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const dotRef = ref<HTMLSpanElement | null>(null)
let bounceTimer: ReturnType<typeof setTimeout> | null = null

function playDotBounce() {
  if (!dotRef.value) return
  const h = 8 + Math.random() * 7 // 8–15 px, varies each trigger

  gsap.timeline()
    // Launch: compress horizontally, stretch vertically (classic squash-and-stretch)
    .to(dotRef.value, {
      y: -h,
      scaleX: 0.8,
      scaleY: 1.25,
      duration: 0.17,
      ease: 'power2.out',
    })
    // Land: bounce.out supplies the diminishing-gravity bounces
    .to(dotRef.value, {
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 0.58,
      ease: 'bounce.out',
    })
}

function scheduleBounce() {
  bounceTimer = setTimeout(() => {
    playDotBounce()
    scheduleBounce()
  }, 3000 + Math.random() * 2000) // 3–5 s
}

onMounted(scheduleBounce)

onBeforeUnmount(() => {
  if (bounceTimer) clearTimeout(bounceTimer)
})
</script>

<template>
  <!--
    Figma node 152:1970 — "BFusiger." logotype
    Font-size is controlled by the parent; colour auto-switches via CSS var.
  -->
  <span
    class="logo inline-flex items-baseline select-none leading-none"
    aria-label="BFusiger."
    role="img"
  >
    <span>BFusiger</span>
    <span ref="dotRef" class="inline-block" style="transform-origin: center bottom;">.</span>
  </span>
</template>

<style scoped>
.logo {
  font-family: var(--typography-font-family-headings, 'Geist', ui-sans-serif, system-ui, sans-serif);
  font-weight: 900;
  color: var(--color-text-default);
}
</style>
