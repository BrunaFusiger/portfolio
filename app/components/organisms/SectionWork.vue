<script setup lang="ts">
import { WORK_CARDS } from '~/constants/work-data'


const hoveredIndex = ref<number | null>(null)
</script>

<template>
  <SectionBase variant="wide">
    <div class="flex flex-col items-center gap-6 md:gap-8">
      <BaseSectionTitle
        title="Work that explains itself."
        :link="{ to: '/work', label: 'See all', ariaLabel: 'See all projects' }"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
        <BasePrincipleCard
          v-for="(card, i) in WORK_CARDS"
          :key="card.slug"
          :title="card.title"
          :description="card.description"
          :tags="card.tags"
          :to="`/work/${card.slug}`"
          :paused="hoveredIndex !== null && hoveredIndex !== i"
          @hover-in="hoveredIndex = i"
          @hover-out="hoveredIndex = null"
        >
          <template #media="{ paused }">
            <LazyBaseJitterLottie
              class="absolute inset-0 size-full"
              :src="card.animation"
              :paused="paused"
            />
          </template>
        </BasePrincipleCard>
      </div>
    </div>
  </SectionBase>
</template>
