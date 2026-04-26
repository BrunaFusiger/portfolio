<template>
  <div
    ref="rootEl"
    class="torn-paper relative size-full select-none"
    :class="[
      side === 'left' ? 'torn-paper--left' : 'torn-paper--right',
      { 'torn-paper--revealed': isRevealed, 'torn-paper--loop': loop },
    ]"
  >
    <div class="torn-paper__scene">
      <!-- Motion runs in viewport-aligned space; tilt lives inside so translateX is truly horizontal. -->
      <div class="torn-paper__motion">
        <div
          class="torn-paper__tilt size-full origin-center rotate-80 lg:-rotate-80"
        >
          <div class="absolute inset-[1.49%_0.64%_0.64%_1.49%] flex items-center justify-center">
            <div class="size-full -scale-y-100">
              <div class="torn-paper__media relative size-full">
                <NuxtImg
                  :src="src"
                  alt=""
                  class="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                  decoding="async"
                />
                <div class="torn-paper__highlight" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Horizontal edge the sheet hugs; drives transform-origin and motion direction. */
    side?: 'left' | 'right'
    /** Texture path; swap without changing layout wrappers. */
    src?: string
    /** Intersection ratio (0–1) before firing. */
    threshold?: number
    /** E.g. positive bottom margin starts the animation before the piece is fully in view. */
    rootMargin?: string
    /** Skip viewport observer; reveal as soon as mounted (e.g. hover-mounted UI). */
    instantReveal?: boolean
    /** Oscillate between hidden and settled using the same keyframes (`infinite alternate`). */
    loop?: boolean
  }>(),
  {
    side: 'right',
    src: '/textures/scratched-white.png',
    threshold: 0.18,
    rootMargin: '0px 0px 18% 0px',
    instantReveal: false,
    loop: false,
  },
)

const rootEl = useTemplateRef('rootEl')
const isRevealed = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!import.meta.client) return

  if (props.instantReveal) {
    isRevealed.value = true
    return
  }

  const el = rootEl.value
  if (!el) return

  observer = new IntersectionObserver(
    (entries) => {
      const hit = entries.some((e) => e.isIntersecting)
      if (!hit) return
      isRevealed.value = true
      observer?.disconnect()
      observer = null
    },
    {
      root: null,
      rootMargin: props.rootMargin,
      threshold: props.threshold,
    },
  )

  observer.observe(el)
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.torn-paper__scene {
  width: 100%;
  height: 100%;
  perspective: 1400px;
}

.torn-paper__motion {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform, opacity, clip-path;
}

/* Outer edge = horizontal hinge so motion reads left↔right, not from top */
.torn-paper--right .torn-paper__motion {
  transform-origin: center right;
}

.torn-paper--left .torn-paper__motion {
  transform-origin: center left;
}

/* Pre-reveal: off past the outer edge; clip sweeps across horizontally */
.torn-paper--right:not(.torn-paper--revealed) .torn-paper__motion {
  opacity: 0;
  clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%);
  transform: rotateY(-5deg) rotateZ(0.6deg) translate3d(7%, 0, 0) scale(0.99);
}

.torn-paper--left:not(.torn-paper--revealed) .torn-paper__motion {
  opacity: 0;
  clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
  transform: rotateY(5deg) rotateZ(-0.6deg) translate3d(-7%, 0, 0) scale(0.99);
}

.torn-paper--revealed .torn-paper__motion {
  animation: paper-settle 1.85s cubic-bezier(0.33, 0.04, 0.22, 1) forwards;
}

.torn-paper--right.torn-paper--revealed .torn-paper__motion {
  animation-name: paper-settle-right;
}

.torn-paper--left.torn-paper--revealed .torn-paper__motion {
  animation-name: paper-settle-left;
}

/*
 * Loop: small transform sway only (full clip + opacity 1) so nothing strobes;
 * fast `alternate` reads as constant motion without full peel in/out.
 */
.torn-paper--loop.torn-paper--right.torn-paper--revealed .torn-paper__motion {
  animation: paper-loop-nudge-right 0.48s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate
    both;
}

.torn-paper--loop.torn-paper--left.torn-paper--revealed .torn-paper__motion {
  animation: paper-loop-nudge-left 0.48s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate
    both;
}

.torn-paper--loop.torn-paper--revealed .torn-paper__highlight {
  animation: none;
  opacity: 0.52;
}

.torn-paper__media {
  border-radius: 1px;
}

.torn-paper__highlight {
  pointer-events: none;
  position: absolute;
  inset: 0;
  mix-blend-mode: soft-light;
  opacity: 0;
}

.torn-paper--revealed .torn-paper__highlight {
  animation: paper-highlight 2s cubic-bezier(0.35, 0, 0.25, 1) 0.35s forwards;
}

/* Right: soft drift in from the right, light flutter then rest */
@keyframes paper-settle-right {
  0% {
    opacity: 0;
    clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%);
    transform: rotateY(-5deg) rotateZ(0.6deg) translate3d(7%, 0, 0) scale(0.99);
  }
  38% {
    opacity: 0.55;
    clip-path: polygon(22% 0%, 100% 0%, 100% 100%, 22% 100%);
    transform: rotateY(-2.2deg) rotateZ(0.35deg) translate3d(2.2%, 0, 0) scale(0.995);
  }
  62% {
    opacity: 1;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transform: rotateY(0.9deg) rotateZ(-0.25deg) translate3d(-0.35%, 0, 0) scale(1.004);
  }
  82% {
    transform: rotateY(-0.35deg) rotateZ(0.12deg) translate3d(0.15%, 0, 0) scale(1.001);
  }
  100% {
    opacity: 1;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transform: rotateY(0deg) rotateZ(0deg) translate3d(0, 0, 0) scale(1);
  }
}

/* Left: mirror drift */
@keyframes paper-settle-left {
  0% {
    opacity: 0;
    clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
    transform: rotateY(5deg) rotateZ(-0.6deg) translate3d(-7%, 0, 0) scale(0.99);
  }
  38% {
    opacity: 0.55;
    clip-path: polygon(0% 0%, 78% 0%, 78% 100%, 0% 100%);
    transform: rotateY(2.2deg) rotateZ(-0.35deg) translate3d(-2.2%, 0, 0) scale(0.995);
  }
  62% {
    opacity: 1;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transform: rotateY(-0.9deg) rotateZ(0.25deg) translate3d(0.35%, 0, 0) scale(1.004);
  }
  82% {
    transform: rotateY(0.35deg) rotateZ(-0.12deg) translate3d(-0.15%, 0, 0) scale(1.001);
  }
  100% {
    opacity: 1;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transform: rotateY(0deg) rotateZ(0deg) translate3d(0, 0, 0) scale(1);
  }
}

@keyframes paper-highlight {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.72;
  }
}

@keyframes paper-loop-nudge-right {
  0% {
    opacity: 1;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transform: rotateY(-1.35deg) rotateZ(0.18deg) translate3d(2.8%, 0, 0) scale(1.003);
  }
  100% {
    opacity: 1;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transform: rotateY(0.55deg) rotateZ(-0.1deg) translate3d(-0.9%, 0, 0) scale(0.997);
  }
}

@keyframes paper-loop-nudge-left {
  0% {
    opacity: 1;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transform: rotateY(1.35deg) rotateZ(-0.18deg) translate3d(-2.8%, 0, 0) scale(1.003);
  }
  100% {
    opacity: 1;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transform: rotateY(-0.55deg) rotateZ(0.1deg) translate3d(0.9%, 0, 0) scale(0.997);
  }
}

@media (prefers-reduced-motion: reduce) {
  .torn-paper__motion {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }

  .torn-paper--loop.torn-paper--revealed .torn-paper__motion {
    animation: none !important;
  }

  .torn-paper--loop.torn-paper--revealed .torn-paper__highlight {
    animation: none !important;
    opacity: 0.65;
  }

  .torn-paper--revealed .torn-paper__motion {
    opacity: 1;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    transform: none;
  }

  .torn-paper--revealed .torn-paper__highlight {
    animation: none;
    opacity: 0.65;
  }
}
</style>
