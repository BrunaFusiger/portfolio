<script setup lang="ts">
const { isVisible } = useRouteLoading()
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      role="status"
      aria-live="polite"
      aria-label="Loading"
      class="fixed inset-x-0 bottom-8 md:bottom-10 flex justify-center pointer-events-none z-50"
    >
      <div class="flex items-center gap-1.5">
        <span class="size-1.5 rounded-full bg-text-muted animate-dot-orbit-a motion-reduce:animate-dot-pulse" />
        <span class="size-1.5 rounded-full bg-text-muted animate-dot-orbit-b motion-reduce:animate-dot-pulse motion-reduce:[animation-delay:200ms]" />
        <span class="size-1.5 rounded-full bg-text-muted animate-dot-orbit-c motion-reduce:animate-dot-pulse motion-reduce:[animation-delay:400ms]" />
      </div>
    </div>
  </Transition>
</template>
