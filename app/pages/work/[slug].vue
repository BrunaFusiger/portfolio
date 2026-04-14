<script setup lang="ts">
import { isCaseStudySlug } from '~/constants/case-studies-data'
import { recordCaseStudyOpened } from '~/composables/useCaseStudyVisitState'

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
    // Fallback to English when current locale has no content
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
              class="font-body text-muted w-full text-base leading-6 md:text-xl md:leading-7 xl:text-2xl xl:leading-7"
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
            class="font-body text-muted text-base leading-6 md:text-lg md:leading-7 mt-2"
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

        <!-- Sections -->
        <div class="flex flex-col gap-[64px] md:gap-[88px] mt-[64px] md:mt-[88px]">
          <template v-for="(section, i) in caseStudy.sections" :key="i">
            <!-- Heading -->
            <h2
              v-if="section.type === 'heading'"
              class="wind-lift-root font-heading font-extrabold text-default w-full text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] xl:text-[56px] xl:leading-[72px]"
            >
              <BaseWindLiftText :text="section.text!" split-by="char" />
            </h2>

            <!-- Subheading -->
            <BaseCaseStudySubheading
              v-else-if="section.type === 'subheading' && section.text"
              :text="section.text"
            />

            <!-- Scrollytelling -->
            <BaseScrollytelling
              v-else-if="section.type === 'scrollytelling' && caseStudy.scrollytelling?.length"
              :items="caseStudy.scrollytelling"
            />

            <!-- Prose -->
            <div
              v-else-if="section.type === 'prose' && section.paragraphs?.length"
              class="flex flex-col gap-5"
            >
              <BaseCaseStudyProseParagraph
                v-for="(paragraph, j) in section.paragraphs"
                :key="j"
                :text="paragraph"
              />
            </div>

            <!-- Stat / Relevant Data -->
            <BaseRelevantData
              v-else-if="section.type === 'stat'"
              :value="section.value!"
              :description="section.description!"
            />

            <!-- Bullet Points -->
            <div
              v-else-if="section.type === 'bullets' && section.items?.length"
              class="flex flex-col gap-6 md:gap-10"
            >
              <BaseBulletPoint
                v-for="(item, j) in section.items"
                :key="j"
                :text="item"
              />
            </div>

            <!-- Highlighted Block -->
            <BaseHighlightedBlock
              v-else-if="section.type === 'highlighted'"
              :text="section.text!"
            />

            <!-- Case study media -->
            <BaseCaseStudyMedia
              v-else-if="section.type === 'media'"
              :src="section.src"
              :alt="section.alt"
              :caption="section.caption"
              :placeholder-label="section.placeholderLabel"
              :aspect="section.aspect"
              :variant="section.variant"
              :rounded="section.rounded"
              :max-width="section.maxWidth"
            />

            <BaseCaseStudyBeforeAfter
              v-else-if="section.type === 'beforeAfter'"
              :before-src="section.beforeSrc!"
              :after-src="section.afterSrc!"
              :before-alt="section.beforeAlt"
              :after-alt="section.afterAlt"
              :before-label="section.beforeLabel"
              :after-label="section.afterLabel"
              :caption="section.caption"
              :aspect="section.aspect"
              :variant="section.variant"
              :max-height="section.maxHeight"
            />

            <BaseComputerMockup
              v-else-if="section.type === 'computerMockup'"
              :mockup-src="section.mockupSrc"
              :screen-image-src="section.screenImageSrc"
              :screen-video-src="section.screenVideoSrc"
              :alt="section.alt"
              :caption="section.caption"
              :screen-inset="section.screenInset"
            />

            <!-- Process steps -->
            <BaseCaseStudyProcess
              v-else-if="section.type === 'process' && section.steps?.length"
              :steps="section.steps"
            />

            <!-- Lottie Animation -->
            <div
              v-else-if="section.type === 'lottie'"
              class="relative w-full overflow-clip rounded-[32px] bg-surface-card aspect-[358/262]"
            >
              <BaseJitterLottie
                :src="section.src!"
                class="absolute inset-0"
              />
            </div>

            <!-- Case study video -->
            <BaseCaseStudyVideo
              v-else-if="section.type === 'video'"
              :src="section.src"
              :alt="section.alt"
              :caption="section.caption"
              :placeholder-label="section.placeholderLabel"
              :aspect="section.aspect"
              :variant="section.variant"
            />
          </template>
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
