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
  border: 1px solid rgba(0, 0, 0, 0.055);
}

/* Scale Figma-sized collage (736×265) to board width; no horizontal overflow */
.board-collage {
  transform-origin: top center;
  transform: translateX(-50%) scale(min(1, 100cqw / 736px));
}
:global(.dark) .board-frame {
  border-color: rgba(255, 255, 255, 0.07);
}

.board {
  position: relative;
  overflow: hidden;
  background-color: var(--color-surface-subtle);
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.055) 1px, transparent 1px);
  background-size: 52px 52px;
}

.board::before,
.board::after {
  content: '';
  position: absolute;
  pointer-events: none;
  background-color: var(--color-surface-subtle);
  border-radius: inherit;
}
.board::before {
  top: 0;
  bottom: 0;
  left: round(down, calc(100% - 1px), 52px);
  width: 1px;
}
.board::after {
  left: 0;
  right: 0;
  top: round(down, calc(100% - 1px), 52px);
  height: 1px;
}

:global(.dark) .board {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
}
</style>
