<script setup lang="ts">
import { nuxtImgRasterDefaults } from '~/utils/nuxtImgRasterDefaults'
import type { CaseStudyBlock } from '~/types/case-study'
import { gardenItemBySlug } from '~/constants/garden-data'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: post, pending, status } = useContentEntry(
  'garden',
  'garden',
  slug,
  'garden',
)

const bodyGroups = computed<CaseStudyBlock[][]>(() =>
  post.value?.body?.length
    ? groupCaseStudySections(post.value.body as CaseStudyBlock[])
    : [],
)

const gardenSeoDescription = computed(() => gardenItemBySlug(slug.value)?.seoDescription)

useHead({
  title: () => post.value?.title ?? 'Garden post not found',
  meta: [
    {
      name: 'description',
      content: () => (post.value ? gardenSeoDescription.value : undefined),
    },
  ],
})
</script>

<template>
  <GardenSkeleton v-if="pending || (status === 'idle' && !post)" />
  <article v-else-if="post" class="section-outer pb-12 md:pb-16 xl:pb-24">
    <div class="section-grid">
      <div class="col-main flex flex-col">
        <!-- 1. Picture first -->
        <div class="pt-12 md:pt-16 xl:pt-24">
          <div
            class="relative w-full aspect-[16/10] overflow-hidden rounded-[24px] md:rounded-[32px] border border-surface-subtle bg-surface-subtle"
          >
            <NuxtImg
              :src="post.heroImage"
              :alt="post.heroAlt"
              v-bind="nuxtImgRasterDefaults"
              class="absolute inset-0 size-full object-cover"
              sizes="(max-width: 767px) 100vw, 720px"
              loading="eager"
              fetchpriority="high"
              :preload="{ fetchPriority: 'high' }"
            />
          </div>
        </div>

        <BaseSectionTitle as="h1" :title="post.title" class="mt-10 md:mt-14" />

        <!-- 3. Tags -->
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mt-6">
          <BasePillTag v-for="tag in post.tags" :key="tag">
            {{ tag }}
          </BasePillTag>
        </div>

        <!-- 4. Body (same block set as work case studies) -->
        <div class="flex flex-col gap-[64px] md:gap-[88px] mt-[64px] md:mt-[88px]">
          <div
            v-for="(group, gi) in bodyGroups"
            :key="gi"
            class="flex flex-col gap-12 md:gap-14"
          >
            <BaseContentBodyBlock
              v-for="(block, bi) in group"
              :key="bi"
              :block="block"
              :previous-block-type="bi > 0 ? group[bi - 1]!.type : undefined"
              :scrollytelling="post.scrollytelling"
            />
          </div>
        </div>
      </div>
    </div>
  </article>

  <main v-else class="min-h-screen flex items-center justify-center p-8">
    <div class="flex flex-col items-center gap-6 text-center">
      <h1 class="font-heading font-black text-[48px] text-default">
        {{ slug }}
      </h1>
      <NuxtLink
        to="/garden"
        class="font-heading font-bold text-link text-base underline"
      >
        &larr; See all
      </NuxtLink>
    </div>
  </main>
</template>
