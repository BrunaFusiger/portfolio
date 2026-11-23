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
    text: 'I grew up in a small town in southern Brazil, raised by my grandparents and surrounded by nature, creative activities and music.',
    photos: storyBrazil.value,
    pinStyle: brazilPinStyle.value,
    pinShiftClass: brazilPinShiftClass.value,
  },
  {
    kind: 'tapes',
    text: 'At 15, I joined a military high school. I woke up at 5am, marched in the cold... It was hard, but it taught me strong values and I met the love of my life there. At school we built a mental health app together and got recognised by Google. Since then, we are always creating new things together.',
    photos: storySchool.value,
    tapes: tapeSchool.value,
  },
  {
    kind: 'tapes',
    text: "After living in Ticino, I now call Zurich home. Life in Switzerland keeps me active and curious: running, calisthenics, lake swims, mushroom hunting, mountain hikes, piano and acoustic guitar. In Ticino, I volunteered every month at a local retirement home. I'm convinced that a full life makes a better designer.",
    photos: storyAlps.value,
    tapes: tapeAlps.value,
  },
])
</script>

<template>
  <section ref="sectionEl" class="relative isolate bg-surface-subtle section-space section-outer" aria-labelledby="about-title">
    <BaseDotGridHover class="inset-0" />

    <div class="section-grid relative z-10">
      <div class="col-main flex min-w-0 flex-col gap-16 md:gap-12">

        <BaseSectionTitle
          title="Behind the pixels..."
          title-id="about-title"
        >
          <template #description>
            A designer with too many hobbies and a curious soul.
          </template>
        </BaseSectionTitle>

        <template v-if="!isOpen">
          <BaseImageGirlAlps alt="Girl swimming in an Alpine lake with mountains in the background" />

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
            Open to discover more about Bruna
          </BaseButton>
        </template>

        <Transition name="about-expand">
          <div
            v-if="isOpen"
            id="about-expanded"
            class="flex flex-col gap-16 md:gap-20"
          >

            <LazyAboutCollageStory v-for="s in collageStories" :key="s.text" :story="s" />

            <LazyBaseTextBoard :show-board="false">
              <template #text>I believe Aristotle was right — the purpose of knowledge is action, not knowledge itself. I've been self-taught since the beginning, learning by doing, breaking things, and building them back better. I started in code. Then design took over, but the code never left. That combination is my biggest asset.</template>
            </LazyBaseTextBoard>

            <LazyBaseImageThinkerDoer alt="The Thinker and The Doer — two statues representing thought and action" />

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
              Collapse
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
