<script setup lang="ts">
/** Full-screen branded interstitial before bench “surprise” navigation. CSS-only motion. */
const props = withDefaults(
  defineProps<{
    /** Total CSS timeline (fade timings tuned to this). */
    durationMs?: number
  }>(),
  { durationMs: 1400 },
)

const reducedMotion = useReducedMotion()

const luckStyle = computed(() => {
  const total = props.durationMs
  return {
    '--bench-luck-total': `${total}ms`,
    '--bench-luck-icon': `${Math.round(total * 0.88)}ms`,
  } as Record<string, string>
})

/** Prevent page scroll / rubber-band while overlay is mounted. */
onMounted(() => {
  if (!import.meta.client) return
  const html = document.documentElement
  const body = document.body
  html.dataset.benchLuckPrevOverflow = html.style.overflow
  body.dataset.benchLuckPrevOverflow = body.style.overflow
  body.dataset.benchLuckPrevTouch = body.style.touchAction
  html.style.overflow = 'hidden'
  body.style.overflow = 'hidden'
  body.style.touchAction = 'none'
})
onBeforeUnmount(() => {
  if (!import.meta.client) return
  const html = document.documentElement
  const body = document.body
  html.style.overflow = html.dataset.benchLuckPrevOverflow ?? ''
  body.style.overflow = body.dataset.benchLuckPrevOverflow ?? ''
  body.style.touchAction = body.dataset.benchLuckPrevTouch ?? ''
  delete html.dataset.benchLuckPrevOverflow
  delete body.dataset.benchLuckPrevOverflow
  delete body.dataset.benchLuckPrevTouch
})
</script>

<template>
  <Teleport to="body">
    <div
      class="bench-luck-layer fixed inset-0 z-[70] h-dvh max-h-dvh w-full max-w-full cursor-wait overflow-x-hidden overflow-y-hidden"
      :style="luckStyle"
      role="presentation"
    >
      <div
        class="bench-luck-curtain absolute inset-0 bg-surface-brand"
        :class="reducedMotion ? 'bench-luck-curtain--rm' : 'bench-luck-curtain--motion'"
        aria-hidden="true"
      />
      <div class="relative flex h-full w-full items-center justify-center">
        <p class="sr-only" aria-live="polite">
          {{ $t('footer.luckRevealAria') }}
        </p>
        <span
          class="bench-luck-icon i-hugeicons-cinnamon-roll size-16 shrink-0 text-white md:size-20 dark:text-inverse"
          :class="reducedMotion ? '' : 'bench-luck-icon--motion'"
          aria-hidden="true"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.bench-luck-layer {
  touch-action: none;
  overscroll-behavior: none;
}

.bench-luck-curtain--motion {
  transform: translateZ(0);
  transform-origin: 50% 50%;
  backface-visibility: hidden;
  will-change: transform, opacity;
  /* Linear between keyframes: even fades (no filter — blur on full viewport reads as “1fps”). */
  animation: bench-luck-screen var(--bench-luck-total) linear forwards;
}

.bench-luck-icon--motion {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform;
  animation: bench-luck-candy var(--bench-luck-icon) cubic-bezier(0.45, 0.05, 0.55, 0.95) 100ms both;
}

.bench-luck-curtain--rm {
  opacity: 1;
}

.bench-luck-curtain--rm,
.bench-luck-curtain--rm ~ .relative .bench-luck-icon {
  animation: none;
}

/*
 * Curtain: opacity + scale only (compositor-friendly). Linear timing = steady ramp in/out, no strobe.
 */
@keyframes bench-luck-screen {
  0% {
    opacity: 0;
    transform: translateZ(0) scale(1.03);
  }
  14% {
    opacity: 1;
    transform: translateZ(0) scale(1);
  }
  68% {
    opacity: 1;
    transform: translateZ(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateZ(0) scale(1.02);
  }
}

/* Candy: single continuous arc — fewer stops so motion reads as one smooth path (all transform). */
@keyframes bench-luck-candy {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
  }
  28% {
    transform: translate3d(0.15%, -36%, 0) rotate(0.7deg) scale(1.05);
  }
  50% {
    transform: translate3d(-0.08%, -40%, 0) rotate(-0.35deg) scale(1.055);
  }
  72% {
    transform: translate3d(0.05%, -16%, 0) rotate(0.15deg) scale(1.02);
  }
  88% {
    transform: translate3d(0, -2%, 0) rotate(0deg) scale(1.004);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bench-luck-curtain--motion {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    opacity: 1;
    transform: none !important;
  }

  .bench-luck-icon--motion {
    animation: none !important;
    will-change: auto;
  }
}
</style>
