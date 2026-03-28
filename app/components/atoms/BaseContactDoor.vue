<script setup lang="ts">
defineProps<{
  open: boolean
}>()
</script>

<template>
  <div class="relative w-full h-full min-h-0 flex flex-col base-contact-door-perspective">
    <div class="relative flex-1 min-h-0 overflow-hidden rounded-sm">
      <div
        class="absolute inset-0 bg-surface-brand dark:bg-transparent"
        aria-hidden="true"
      />

      <div
        class="absolute inset-0 z-[1] flex items-center justify-center base-contact-door-icon-wrap"
        :class="{ 'base-contact-door-icon-wrap--open': open }"
      >
        <slot />
      </div>

      <div
        class="absolute inset-0 z-[2] pointer-events-none base-contact-door-stage"
        aria-hidden="true"
      >
        <div
          class="base-contact-door-swing h-full w-full"
          :class="{ 'base-contact-door-swing--open': open }"
        >
          <BaseDoorClosed class="h-full w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-contact-door-perspective {
  perspective: 720px;
}

.base-contact-door-stage {
  transform-style: preserve-3d;
}

.base-contact-door-swing {
  transform-origin: right center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Hinge on the right; slab swings outward to the right */
.base-contact-door-swing--open {
  transform: rotateY(78deg);
}

.base-contact-door-icon-wrap {
  opacity: 0;
  transform: scale(0.86) translateY(10px);
  filter: blur(3px);
  transition:
    opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.52s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: 0s;
}

.base-contact-door-icon-wrap--open {
  opacity: 1;
  transform: scale(1) translateY(0);
  filter: blur(0);
  transition-delay: 0.1s, 0.08s, 0.1s;
}

@media (prefers-reduced-motion: reduce) {
  .base-contact-door-swing {
    transition-duration: 0.01ms !important;
  }

  .base-contact-door-icon-wrap,
  .base-contact-door-icon-wrap--open {
    transition-duration: 0.01ms !important;
    transition-delay: 0s !important;
    filter: none;
  }

  .base-contact-door-icon-wrap--open {
    opacity: 1;
    transform: none;
  }
}
</style>
