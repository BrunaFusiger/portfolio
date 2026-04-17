<script setup lang="ts">
defineProps<{
  paragraphs?: string[]
  stats: { value: string; description: string }[]
}>()
</script>

<template>
  <div class="flex w-full items-stretch gap-4 md:gap-6">
    <div
      class="w-6 shrink-0 self-stretch text-brand md:w-8"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 100"
        preserveAspectRatio="none"
        class="h-full w-full select-none"
      >
        <path
          d="M 20 0 Q 10 0 10 20 Q 10 40 2 50 Q 10 60 10 80 Q 10 100 20 100"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>
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
