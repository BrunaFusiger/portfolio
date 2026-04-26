<script setup lang="ts">
import {
  STORY_BRAZIL_MD, STORY_BRAZIL_SM,
  STORY_SCHOOL_MD, STORY_SCHOOL_SM,
  STORY_ALPS_MD, STORY_ALPS_SM,
  TAPE_SCHOOL_MD, TAPE_SCHOOL_SM,
  TAPE_ALPS_MD, TAPE_ALPS_SM,
} from '~/constants/about-stories'
import type { AboutCollageStory } from '~/types/about-collage'

const isOpen = ref(false)
const sectionEl = ref<HTMLElement | null>(null)

function toggle() {
  isOpen.value = !isOpen.value
  if (sectionEl.value) {
    nextTick(() => {
      sectionEl.value!.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

const isBoardMdUp = useMediaQuery('(min-width: 768px)', { defaultValue: true })

const storyBrazil = computed(() => (isBoardMdUp.value ? STORY_BRAZIL_MD : STORY_BRAZIL_SM))
const storySchool = computed(() => (isBoardMdUp.value ? STORY_SCHOOL_MD : STORY_SCHOOL_SM))
const storyAlps = computed(() => (isBoardMdUp.value ? STORY_ALPS_MD : STORY_ALPS_SM))
const tapeSchool = computed(() => (isBoardMdUp.value ? TAPE_SCHOOL_MD : TAPE_SCHOOL_SM))
const tapeAlps = computed(() => (isBoardMdUp.value ? TAPE_ALPS_MD : TAPE_ALPS_SM))

const brazilPinStyle = computed(() =>
  isBoardMdUp.value
    ? { left: 'calc(50% - 244.13px)', top: 'calc(50% - 32px)' }
    : { left: 'calc(50% - 190px)', top: 'calc(50% - 43px)' },
)

const brazilPinShiftClass = computed(() =>
  isBoardMdUp.value ? '-translate-x-1/2 -translate-y-8' : '-translate-x-1/2 -translate-y-7',
)

const collageStories = computed<AboutCollageStory[]>(() => [
  {
    kind: 'pin',
    textKey: 'about.stories.brazil',
    photos: storyBrazil.value,
    pinStyle: brazilPinStyle.value,
    pinShiftClass: brazilPinShiftClass.value,
  },
  {
    kind: 'tapes',
    textKey: 'about.stories.school',
    photos: storySchool.value,
    tapes: tapeSchool.value,
  },
  {
    kind: 'tapes',
    textKey: 'about.stories.alps',
    photos: storyAlps.value,
    tapes: tapeAlps.value,
  },
])
</script>

<template>
  <section ref="sectionEl" class="relative isolate bg-surface-subtle section-space section-outer" aria-labelledby="about-title">
    <BaseDotGridHover class="inset-0" />

    <div
      class="pointer-events-none absolute z-[1] hidden size-60 -left-40 top-40 lg:block"
      aria-hidden="true"
    >
      <TornPaperDecor side="left" />
    </div>
    <div
      class="pointer-events-none absolute z-[1] hidden -scale-x-100 size-60 -right-40 top-120 lg:block"
      aria-hidden="true"
    >
      <TornPaperDecor side="right" />
    </div>

    <div class="section-grid relative z-10">
      <div class="col-main flex min-w-0 flex-col gap-16 md:gap-12">

        <BaseSectionTitle
          :title="$t('about.title')"
          title-id="about-title"
        >
          <template #description>
            {{ $t('about.description') }}
          </template>
        </BaseSectionTitle>

        <template v-if="!isOpen">
          <BaseImageGirlAlps :alt="$t('about.girlAlpsAlt')" />

          <BaseButton
            variant="dotted"
            full
            :aria-expanded="false"
            aria-controls="about-expanded"
            @click="toggle"
          >
            <template #icon-left>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </template>
            {{ $t('about.openCta') }}
          </BaseButton>
        </template>

        <Transition name="about-expand">
          <div
            v-if="isOpen"
            id="about-expanded"
            class="flex flex-col gap-16 md:gap-20"
          >

            <LazyAboutCollageStory v-for="s in collageStories" :key="s.textKey" :story="s" />

            <LazyBaseTextBoard :show-board="false">
              <template #text>{{ $t('about.stories.philosophy') }}</template>
            </LazyBaseTextBoard>

            <LazyBaseImageThinkerDoer :alt="$t('about.thinkerDoerAlt')" />

            <BaseButton
              variant="dotted"
              full
              :aria-expanded="true"
              aria-controls="about-expanded"
              @click="toggle"
            >
              <template #icon-left>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </template>
              {{ $t('about.collapseCta') }}
            </BaseButton>
          </div>
        </Transition>

      </div>
    </div>
  </section>
</template>

<style scoped>
.about-expand-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.about-expand-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.about-expand-enter-from,
.about-expand-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.about-expand-enter-to,
.about-expand-leave-from {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .about-expand-enter-active,
  .about-expand-leave-active {
    transition-duration: 0.01ms !important;
  }
}
</style>
