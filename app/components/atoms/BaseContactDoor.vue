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

      <div class="absolute inset-0 z-[1] flex items-center justify-center">
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

@media (prefers-reduced-motion: reduce) {
  .base-contact-door-swing {
    transition-duration: 0.01ms !important;
  }
}
</style>
