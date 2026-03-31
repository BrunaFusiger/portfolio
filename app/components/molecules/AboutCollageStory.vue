<script setup lang="ts">
import type { AboutCollageStory } from '~/types/about-collage'

defineProps<{
  story: AboutCollageStory
}>()

const { t } = useI18n()
</script>

<template>
  <BaseTextBoard>
    <template #text>{{ $t(story.textKey) }}</template>

    <template #photos>
      <template v-if="story.kind === 'pin'">
        <div
          class="-scale-x-100 absolute pointer-events-none z-10"
          :class="story.pinShiftClass"
          :style="story.pinStyle"
        >
          <BasePin />
        </div>
        <div
          v-for="photo in story.photos"
          :key="photo.src"
          class="-translate-x-1/2 -translate-y-1/2 absolute"
          :style="{ left: photo.left, top: photo.top }"
        >
          <BaseImageBorder
            collage
            :class="photo.rotation"
            :src="photo.src"
            :alt="t(photo.altKey)"
            :tooltip="t(photo.tooltipKey)"
            :scratched="photo.scratched"
          />
        </div>
      </template>

      <template v-else>
        <div
          v-for="(tape, i) in story.tapes"
          :key="i"
          class="-translate-x-1/2 -translate-y-1/2 absolute pointer-events-none z-10 flex items-center justify-center"
          :style="{ left: tape.left, top: tape.top }"
        >
          <div :class="tape.rotation">
            <BaseTape width="64" height="43" />
          </div>
        </div>
        <div
          v-for="photo in story.photos"
          :key="photo.src"
          class="-translate-x-1/2 -translate-y-1/2 absolute"
          :style="{ left: photo.left, top: photo.top }"
        >
          <BaseImageBorder
            collage
            :class="photo.rotation"
            :src="photo.src"
            :alt="t(photo.altKey)"
            :tooltip="t(photo.tooltipKey)"
            :scratched="photo.scratched"
          />
        </div>
      </template>
    </template>
  </BaseTextBoard>
</template>
