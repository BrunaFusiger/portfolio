<script setup lang="ts">
defineProps<{
  paragraphs?: string[]
  stats: { value: string; description: string }[]
}>()

const BRACKET_SRC = '/media/utils/curly-bracket.png'
</script>

<template>
  <div class="flex w-full items-stretch gap-4 md:gap-6">
    <!-- `object-fill` = CSS `object-fit: fill`: image stretches to the full column box
         (same footprint as `contain` layout-wise, but fills height/width without letterboxing). -->
    <div
      class="relative w-6 shrink-0 self-stretch md:w-8"
      aria-hidden="true"
    >
      <img
        :src="BRACKET_SRC"
        alt=""
        class="absolute inset-0 h-full w-full object-fill object-left select-none"
      >
    </div>
    <div class="flex min-w-0 flex-1 flex-col gap-8">
      <div
        v-if="paragraphs?.length"
        class="flex flex-col gap-5"
      >
        <BaseCaseStudyProseParagraph
          v-for="(text, i) in paragraphs"
          :key="i"
          :text="text"
        />
      </div>
      <div class="flex flex-col gap-6">
        <BaseRelevantData
          v-for="(row, i) in stats"
          :key="i"
          :value="row.value"
          :description="row.description"
        />
      </div>
    </div>
  </div>
</template>
