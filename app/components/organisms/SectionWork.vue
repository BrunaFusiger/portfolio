<script setup lang="ts">
import { WORK_CARDS } from '~/constants/work-data'


const hoveredIndex = ref<number | null>(null)
</script>

<template>
  <SectionBase variant="wide">
    <div class="flex flex-col items-center gap-16">
      <BaseSectionTitle title="Work that explains itself.">
        <template #description>From human behavior to programming best practices, every decision has a reason. These are details that best show how I think.</template>
      </BaseSectionTitle>

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

      <BaseButton variant="solid-red" to="/work">
        <template #icon-left>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6.25 3.75h7.5c.69 0 1.25.56 1.25 1.25v12.5l-5-3.75-5 3.75V5c0-.69.56-1.25 1.25-1.25Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </template>
        See all projects
      </BaseButton>
    </div>
  </SectionBase>
</template>
