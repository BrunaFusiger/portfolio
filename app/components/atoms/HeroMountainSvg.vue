<script setup lang="ts">
/**
 * Path data lives in `assets/hero-mountain-paths.json`. Figma exports one compound path with
 * `fill-rule="evenodd"` (#E63022): subpath order must be main → mountain details → flower
 * outline → flower inner (see JSON split). We composite fill under strokes for the painted look.
 */
import { computed } from 'vue'
import heroPaths from '~/assets/hero-mountain-paths.json'

withDefaults(
  defineProps<{
    started?: boolean
  }>(),
  { started: false },
)

const { main, flowerOutline, mountainDetail, flowerInner } = heroPaths

const fullFillPath = computed(
  () => main + mountainDetail.join('') + flowerOutline + flowerInner.join(''),
)
</script>

<template>
  <svg
    class="hero-mountain-svg block h-auto w-full max-w-none"
    width="387"
    height="317"
    viewBox="0 0 387 317"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :data-started="started ? '' : undefined"
  >
    <defs>
      <clipPath id="hero-mountain-region" clipPathUnits="userSpaceOnUse">
        <rect x="0" y="122" width="387" height="195" />
        <rect x="200" y="0" width="187" height="317" />
      </clipPath>
      <clipPath id="hero-flower-region" clipPathUnits="userSpaceOnUse">
        <polygon points="0,0 0,208 236,208 252,0" />
      </clipPath>
    </defs>

    <!-- Figma evenodd fill (single compound `d`); sits under linework -->
    <path
      class="hero-fill-layer pointer-events-none"
      fill-rule="evenodd"
      clip-rule="evenodd"
      fill="currentColor"
      :d="fullFillPath"
    />

    <!-- Final art: linework on top of fill (mountain hatch → flower contour → inner marks) -->
    <g
      class="hero-final-art"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    >
      <path class="hero-main-perimeter" fill="none" stroke-width="1.42" :d="main" />
      <path
        v-for="(d, i) in mountainDetail"
        :key="'ms' + i"
        class="hero-mtn-line"
        fill="none"
        stroke-width="0.88"
        :d="d"
        :style="{ animationDelay: `${1.79 + i * 0.0049}s` }"
      />
      <path
        class="hero-flower-contour"
        fill="none"
        stroke-width="1.22"
        :d="flowerOutline"
      />
      <path
        v-for="(d, i) in flowerInner"
        :key="'fs' + i"
        class="hero-flw-line"
        fill="none"
        stroke-width="0.72"
        :d="d"
        :style="{ animationDelay: `${2.03 + i * 0.0099}s` }"
      />
    </g>

    <!-- Hand-draw preview: clipped stroke passes, then hidden -->
    <g
      class="hero-ink pointer-events-none"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    >
      <path
        class="hero-stroke-layer hero-main-stroke hero-main-stroke--mountain"
        stroke-width="1.35"
        :d="main"
        clip-path="url(#hero-mountain-region)"
        pathLength="1"
      />
      <path
        class="hero-stroke-layer hero-main-stroke hero-main-stroke--flower"
        stroke-width="1.35"
        :d="main"
        clip-path="url(#hero-flower-region)"
        pathLength="1"
      />
      <path
        class="hero-stroke-layer hero-flower-outline-stroke"
        stroke-width="1.15"
        :d="flowerOutline"
        pathLength="1"
      />
    </g>
  </svg>
</template>

<style scoped>
.hero-mountain-svg {
  overflow: visible;
}

.hero-fill-layer {
  opacity: 0;
}

.hero-final-art .hero-main-perimeter,
.hero-final-art .hero-mtn-line,
.hero-final-art .hero-flower-contour,
.hero-final-art .hero-flw-line {
  opacity: 0;
}

.hero-stroke-layer {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  stroke-opacity: 1;
}

.hero-mountain-svg[data-started] .hero-fill-layer {
  animation: hero-fill-reveal 0.32s cubic-bezier(0.33, 1, 0.65, 1) 1s forwards;
}

.hero-mountain-svg[data-started] .hero-main-perimeter {
  animation: hero-line-reveal 0.29s cubic-bezier(0.22, 1, 0.36, 1) 1.5s forwards;
}

.hero-mountain-svg[data-started] .hero-mtn-line {
  animation: hero-line-reveal 0.28s cubic-bezier(0.25, 0.9, 0.35, 1) both;
}

/* Flower contour after mountain hatch reads closer to Figma (bold outline, no fill) */
.hero-mountain-svg[data-started] .hero-flower-contour {
  animation: hero-line-reveal 0.32s cubic-bezier(0.33, 1, 0.68, 1) 1.98s forwards;
}

.hero-mountain-svg[data-started] .hero-flw-line {
  animation: hero-line-reveal 0.26s cubic-bezier(0.25, 0.9, 0.35, 1) both;
}

.hero-mountain-svg[data-started] .hero-main-stroke--mountain {
  animation:
    hero-hand-draw-mountain 1.09s cubic-bezier(0.33, 0.09, 0.2, 1) forwards,
    hero-stroke-vanish 0.2s ease 1.71s forwards;
}

.hero-mountain-svg[data-started] .hero-main-stroke--flower {
  animation:
    hero-hand-draw-flower-silhouette 0.8s cubic-bezier(0.33, 0.09, 0.2, 1) 0.88s forwards,
    hero-stroke-vanish 0.2s ease 1.74s forwards;
}

.hero-mountain-svg[data-started] .hero-flower-outline-stroke {
  animation:
    hero-hand-draw-flower-line 0.53s cubic-bezier(0.28, 0.1, 0.18, 1) 1.52s forwards,
    hero-stroke-vanish 0.19s ease 2s forwards;
}

@keyframes hero-hand-draw-mountain {
  0% {
    stroke-dashoffset: 1;
  }
  9% {
    stroke-dashoffset: 0.91;
  }
  14% {
    stroke-dashoffset: 0.84;
  }
  24% {
    stroke-dashoffset: 0.68;
  }
  31% {
    stroke-dashoffset: 0.55;
  }
  44% {
    stroke-dashoffset: 0.38;
  }
  52% {
    stroke-dashoffset: 0.3;
  }
  63% {
    stroke-dashoffset: 0.19;
  }
  71% {
    stroke-dashoffset: 0.13;
  }
  81% {
    stroke-dashoffset: 0.06;
  }
  90% {
    stroke-dashoffset: 0.025;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes hero-hand-draw-flower-silhouette {
  0% {
    stroke-dashoffset: 1;
  }
  12% {
    stroke-dashoffset: 0.86;
  }
  27% {
    stroke-dashoffset: 0.62;
  }
  41% {
    stroke-dashoffset: 0.41;
  }
  58% {
    stroke-dashoffset: 0.22;
  }
  76% {
    stroke-dashoffset: 0.09;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes hero-hand-draw-flower-line {
  0% {
    stroke-dashoffset: 1;
  }
  18% {
    stroke-dashoffset: 0.72;
  }
  38% {
    stroke-dashoffset: 0.48;
  }
  55% {
    stroke-dashoffset: 0.28;
  }
  72% {
    stroke-dashoffset: 0.12;
  }
  88% {
    stroke-dashoffset: 0.03;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes hero-stroke-vanish {
  to {
    stroke-opacity: 0;
  }
}

@keyframes hero-line-reveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes hero-fill-reveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-fill-layer {
    opacity: 1 !important;
    animation: none !important;
  }

  .hero-final-art .hero-main-perimeter,
  .hero-final-art .hero-mtn-line,
  .hero-final-art .hero-flower-contour,
  .hero-final-art .hero-flw-line {
    opacity: 1 !important;
    animation: none !important;
  }

  .hero-stroke-layer {
    stroke-dashoffset: 0 !important;
    stroke-opacity: 0 !important;
    animation: none !important;
  }
}
</style>
