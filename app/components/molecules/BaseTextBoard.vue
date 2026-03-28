<script setup lang="ts">
withDefaults(
  defineProps<{
    showBoard?: boolean
  }>(),
  { showBoard: true },
)
</script>

<template>
  <div class="flex flex-col gap-8 md:gap-12 items-start w-full min-w-0">

    <p class="font-body text-muted w-full text-base leading-7 md:text-xl md:leading-8 xl:text-2xl xl:leading-9">
      <slot name="text" />
    </p>

    <template v-if="showBoard">
      <div
        class="board-frame relative w-full max-w-full min-w-0 rounded-2xl overflow-x-clip"
        aria-hidden="true"
      >
        <div class="board aspect-[736/265] w-full max-w-full rounded-2xl" />
        <div
          class="board-collage pointer-events-none absolute left-1/2 top-0 z-[1] h-[265px] w-[736px] max-w-none"
        >
          <div class="pointer-events-auto relative size-full">
            <slot name="photos" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.board-frame {
  container-type: inline-size;
  border: 1px solid color-mix(in srgb, var(--color-board-border) 50%, transparent);
  background-color: var(--color-surface-subtle);
}

.board-collage {
  transform-origin: top center;
  transform: translateX(-50%) scale(min(1, 100cqw / 736px));
}

.board {
  opacity: 0.5;
  background-image:
    linear-gradient(var(--color-board-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-board-grid) 1px, transparent 1px);
  background-size: 52px 52px;
}
</style>
