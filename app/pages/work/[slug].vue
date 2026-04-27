<script setup lang="ts">
import { toRaw } from 'vue'
import { caseStudyBySlug, isCaseStudySlug } from '~/constants/case-studies-data'
import type { CaseStudyBlock } from '~/types/case-study'
import { contentEntryMatchesSlug, useLocalizedContentEntry } from '~/composables/useLocalizedContentEntry'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const slug = computed(() => route.params.slug as string)

const { data: caseStudy, pending, status } = useLocalizedContentEntry(
  'caseStudies',
  'work',
  slug,
  'case-study',
)

const benchLuckTarget = useBenchLuckRevealTargetSlug()

const slugMatchesData = computed(() =>
  contentEntryMatchesSlug(caseStudy.value, 'work', slug.value),
)

const showSkeleton = computed(
  () =>
    pending.value
    || (status.value === 'idle' && !caseStudy.value)
    || (!!caseStudy.value && !slugMatchesData.value),
)

watchEffect(() => {
  if (import.meta.server) return
  const tSlug = benchLuckTarget.value
  if (!tSlug) return
  if (slug.value !== tSlug) return
  if (pending.value) return
  if (caseStudy.value && contentEntryMatchesSlug(caseStudy.value, 'work', slug.value)) {
    benchLuckTarget.value = null
    return
  }
  if (!caseStudy.value) benchLuckTarget.value = null
})

watch(
  slug,
  (s) => {
    if (isCaseStudySlug(s)) recordCaseStudyOpened(s)
  },
  { immediate: true },
)

const sectionGroups = computed<CaseStudyBlock[][]>(() =>
  caseStudy.value?.sections?.length
    ? groupCaseStudySections(
        caseStudy.value.sections.map((s) =>
          normalizeCaseStudySectionBlock(toRaw(s) as CaseStudyBlock),
        ),
      )
    : [],
)

const caseStudySeoKey = computed(() => caseStudyBySlug(slug.value)?.i18nKey)

useHead({
  title: () =>
    caseStudy.value?.title ?? t('seo.pageTitle.workNotFound'),
  meta: [
    {
      name: 'description',
      content: () => {
        const key = caseStudySeoKey.value
        if (!key || !caseStudy.value)
          return undefined
        return t(`seo.caseStudyDescriptions.${key}`)
      },
    },
  ],
})
</script>

<template>
  <CaseStudySkeleton v-if="showSkeleton" />
  <article v-else-if="caseStudy && slugMatchesData" class="section-outer pb-12 md:pb-16 xl:pb-24">
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
            <BasePillTag v-for="tag in caseStudy.tags" :key="tag">
              {{ tag }}
            </BasePillTag>
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
            <BaseContentBodyBlock
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
