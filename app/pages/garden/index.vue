<script setup lang="ts">
import { GARDEN_ITEMS } from '~/constants/garden-data'


useHead({
  title: 'Digital garden',
  titleTemplate: '%s',
  meta: [
    {
      name: 'description',
      content: "articles, experiments, projects, adventures and things worth sharing. A designer's mind.",
    },
  ],
})

definePageMeta({
  paperBackground: true,
})

const GARDEN_TAG_LINE_SEP = /\s*·\s*/u

function gardenItemTags(tags: string) {
  return tags
    .split(GARDEN_TAG_LINE_SEP)
    .map((part) => part.trim())
    .filter(Boolean)
}
</script>

<template>
  <main class="section-outer section-space min-h-[50vh]">
    <section class="relative isolate min-h-[50vh]">
      <div class="section-grid relative z-10">
        <div class="col-main flex flex-col gap-16">
          <BaseSectionTitle title="Digital garden" size="large">
            <template #description>Short notes, references, projects and small experiments. Ideas I water so they can grow into something bigger.</template>
          </BaseSectionTitle>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
            <BaseGardenCard
              v-for="item in GARDEN_ITEMS"
              :key="item.slug"
              :to="`/garden/${item.slug}`"
              :title="item.title"
              :tags="gardenItemTags(item.tags)"
              :cover-image="item.coverImage"
              :cover-alt="item.coverAlt"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
