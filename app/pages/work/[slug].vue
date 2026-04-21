<script setup lang="ts">
import { isCaseStudySlug } from '~/constants/case-studies-data'
import { groupCaseStudySections } from '~/utils/caseStudySectionGroups'
import { recordCaseStudyOpened } from '~/composables/useCaseStudyVisitState'
import type { CaseStudyBlock } from '~/types/case-study'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const slug = computed(() => route.params.slug as string)

const { data: caseStudy } = await useAsyncData(
  `case-study-${slug.value}-${locale.value}`,
  async () => {
    const primary = await queryCollection('caseStudies')
      .where('stem', '=', `${locale.value}/work/${slug.value}`)
      .first()
    if (primary) return primary
    if (locale.value !== 'en') {
      return queryCollection('caseStudies')
        .where('stem', '=', `en/work/${slug.value}`)
        .first()
    }
    return null
  },
  { watch: [locale, slug] },
)

onMounted(() => {
  const s = slug.value
  if (isCaseStudySlug(s)) recordCaseStudyOpened(s)
})

const sectionGroups = computed<CaseStudyBlock[][]>(() =>
  caseStudy.value?.sections?.length
    ? groupCaseStudySections(caseStudy.value.sections as CaseStudyBlock[])
    : [],
)
</script>

<template>
  <article v-if="caseStudy" class="section-outer pb-12 md:pb-16 xl:pb-24">
    <div class="section-grid">
      <div class="col-main flex flex-col">
        <!-- Hero -->
        <div class="pt-12 md:pt-16 xl:pt-24 flex flex-col gap-6">
          <div class="flex flex-col gap-4 md:gap-6 w-full">
            <h1 class="overflow-visible font-heading font-black text-default transition-colors duration-200 text-[48px] leading-[56px] md:text-[80px] md:leading-[88px]">
              <span class="wind-lift-root">
                <BaseWindLiftText :text="caseStudy.title" split-by="char" />
              </span>
            </h1>
            <p
              v-if="caseStudy.subtitle"
              class="case-study-prose"
            >
              {{ caseStudy.subtitle }}
            </p>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="tag in caseStudy.tags"
              :key="tag"
              class="bg-surface-subtle font-body text-muted text-sm md:text-base leading-6 px-2 py-1 rounded-full whitespace-nowrap"
            >
              {{ tag }}
            </span>
          </div>

          <p
            v-if="caseStudy.liveUrl"
            class="case-study-prose mt-2"
          >
            <span v-if="caseStudy.liveIntro">{{ caseStudy.liveIntro + ' ' }}</span>
            <a
              :href="caseStudy.liveUrl"
              class="font-body text-link underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >{{ caseStudy.liveLinkText ?? (caseStudy.liveIntro ? t('work.linkHere') : t('work.viewLiveSite')) }}</a>
          </p>
        </div>

        <!-- Sections: 64/88px between groups; 48/56px between blocks inside a group -->
        <div class="flex flex-col gap-[64px] md:gap-[88px] mt-[64px] md:mt-[88px]">
          <div
            v-for="(group, gi) in sectionGroups"
            :key="gi"
            class="flex flex-col gap-12 md:gap-14"
          >
            <BaseCaseStudySectionItem
              v-for="(block, bi) in group"
              :key="bi"
              :block="block"
              :previous-block-type="bi > 0 ? group[bi - 1]!.type : undefined"
              :scrollytelling="caseStudy.scrollytelling"
            />
          </div>
        </div>
      </div>
    </div>
  </article>

  <!-- Fallback: no content found -->
  <main v-else class="min-h-screen flex items-center justify-center p-8">
    <div class="flex flex-col items-center gap-6 text-center">
      <h1 class="font-heading font-black text-[48px] text-default">
        {{ slug }}
      </h1>
      <NuxtLink
        :to="localePath('/work')"
        class="font-heading font-bold text-link text-base underline"
      >
        &larr; {{ $t('work.cta') }}
      </NuxtLink>
    </div>
  </main>
</template>
