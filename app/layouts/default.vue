<script setup lang="ts">
const footerRef = ref<HTMLElement | null>(null)
const footerInView = ref(false)
const isLg = useMediaQuery('(min-width: 1024px)')

const route = useRoute()
const showFooter = computed(() => route.meta.hideFooter !== true)

useIntersectionObserver(
  () => unwrapElement(footerRef.value),
  ([entry]) => {
    footerInView.value = entry?.isIntersecting ?? false
  },
  { root: null, threshold: 0 },
)
</script>

<template>
  <div class="site-shell">
    <BaseHeader />
    <main class="site-main [padding-top:var(--site-header-h,5.5rem)]">
      <slot />
    </main>
    <footer v-if="showFooter" ref="footerRef">
      <SectionFooter />
    </footer>

    <BaseThemeToggleFab
      v-if="isLg"
      class="fixed z-40 bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))] xl:bottom-8 xl:right-10"
    />

    <!-- Bottom viewport vignette: soft blur + fade into page background (does not block clicks) -->
    <div
      class="site-bottom-vignette"
      :class="{ 'site-bottom-vignette--footer-in-view': footerInView }"
      aria-hidden="true"
    >
      <div class="site-bottom-vignette__blur" />
      <div class="site-bottom-vignette__scrim" />
      <div class="site-bottom-vignette__shine" />
    </div>
  </div>
</template>

<style scoped>
.site-bottom-vignette {
  pointer-events: none;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  height: min(12vh, 8.5rem);
  transition: opacity 0.35s ease;
}

.site-bottom-vignette--footer-in-view {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .site-bottom-vignette {
    transition: none;
  }
}

.site-bottom-vignette__blur {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  mask-image: linear-gradient(to top, black 18%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, black 18%, transparent 100%);
}

.site-bottom-vignette__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--color-surface-background) 0%,
    color-mix(in srgb, var(--color-surface-background) 72%, transparent) 38%,
    transparent 100%
  );
}

/* Subtle highlight along the bottom edge (reads stronger in light mode) */
.site-bottom-vignette__shine {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 45%;
  background: linear-gradient(
    to top,
    transparent 0%,
    color-mix(in srgb, var(--shine-highlight-mid) 35%, transparent) 55%,
    transparent 100%
  );
  opacity: 0.55;
  mix-blend-mode: soft-light;
}

.dark .site-bottom-vignette__shine {
  opacity: 0.35;
}

@media (prefers-reduced-motion: reduce) {
  .site-bottom-vignette__blur {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
</style>
