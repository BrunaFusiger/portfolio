<script setup lang="ts">
const { t } = useI18n()
const isOpen = ref(false)
const sectionEl = ref<HTMLElement | null>(null)

function toggle() {
  const wasOpen = isOpen.value
  isOpen.value = !isOpen.value
  if (wasOpen && sectionEl.value) {
    nextTick(() => {
      sectionEl.value!.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

/** Tailwind `md` — desktop keeps original Figma offsets; below uses tighter collage */
const MD_MIN = '(min-width: 768px)'

const isBoardMdUp = ref(true)

function syncBoardBreakpoint() {
  if (import.meta.server) return
  isBoardMdUp.value = window.matchMedia(MD_MIN).matches
}

let boardBpMql: MediaQueryList | null = null

onMounted(() => {
  syncBoardBreakpoint()
  boardBpMql = window.matchMedia(MD_MIN)
  boardBpMql.addEventListener('change', syncBoardBreakpoint)
})

onUnmounted(() => {
  boardBpMql?.removeEventListener('change', syncBoardBreakpoint)
  boardBpMql = null
})

const STORY_BRAZIL_MD = [
  {
    src: '/images/about/brazil-1.jpeg',
    altKey: 'about.photos.brazil1Alt',
    tooltipKey: 'about.tooltips.brazil1',
    left: 'calc(50% - 161.5px)',
    top: 'calc(50% + 41.4px)',
    rotation: '-rotate-3',
    scratched: false,
  },
  {
    src: '/images/about/brazil-2.jpg',
    altKey: 'about.photos.brazil2Alt',
    tooltipKey: 'about.tooltips.brazil2',
    left: 'calc(50% + 9.1px)',
    top: 'calc(50% - 20.71px)',
    rotation: 'rotate-7',
    scratched: false,
  },
  {
    src: '/images/about/brazil-3.jpg',
    altKey: 'about.photos.brazil3Alt',
    tooltipKey: 'about.tooltips.brazil3',
    left: 'calc(50% + 162.57px)',
    top: 'calc(50% + 37.69px)',
    rotation: '-rotate-5',
    scratched: true,
  },
] as const

const STORY_BRAZIL_SM = [
  {
    src: '/images/about/brazil-1.jpeg',
    altKey: 'about.photos.brazil1Alt',
    tooltipKey: 'about.tooltips.brazil1',
    left: 'calc(50% - 118px)',
    top: 'calc(50% + 34px)',
    rotation: '-rotate-3',
    scratched: false,
  },
  {
    src: '/images/about/brazil-2.jpg',
    altKey: 'about.photos.brazil2Alt',
    tooltipKey: 'about.tooltips.brazil2',
    left: 'calc(50% + 4px)',
    top: 'calc(50% - 30px)',
    rotation: 'rotate-7',
    scratched: false,
  },
  {
    src: '/images/about/brazil-3.jpg',
    altKey: 'about.photos.brazil3Alt',
    tooltipKey: 'about.tooltips.brazil3',
    left: 'calc(50% + 120px)',
    top: 'calc(50% + 32px)',
    rotation: '-rotate-5',
    scratched: true,
  },
] as const

const STORY_SCHOOL_MD = [
  {
    src: '/images/about/school-1.jpeg',
    altKey: 'about.photos.school1Alt',
    tooltipKey: 'about.tooltips.school1',
    left: 'calc(50% - 155.5px)',
    top: 'calc(50% + 33.98px)',
    rotation: '-rotate-3',
    scratched: false,
  },
  {
    src: '/images/about/school-2.jpg',
    altKey: 'about.photos.school2Alt',
    tooltipKey: 'about.tooltips.school2',
    left: 'calc(50% + 15.1px)',
    top: 'calc(50% - 28.13px)',
    rotation: 'rotate-7',
    scratched: false,
  },
  {
    src: '/images/about/school-3.jpeg',
    altKey: 'about.photos.school3Alt',
    tooltipKey: 'about.tooltips.school3',
    left: 'calc(50% + 168.57px)',
    top: 'calc(50% + 30.28px)',
    rotation: '-rotate-5',
    scratched: true,
  },
] as const

const STORY_SCHOOL_SM = [
  {
    src: '/images/about/school-1.jpeg',
    altKey: 'about.photos.school1Alt',
    tooltipKey: 'about.tooltips.school1',
    left: 'calc(50% - 114px)',
    top: 'calc(50% + 30px)',
    rotation: '-rotate-3',
    scratched: false,
  },
  {
    src: '/images/about/school-2.jpg',
    altKey: 'about.photos.school2Alt',
    tooltipKey: 'about.tooltips.school2',
    left: 'calc(50% + 6px)',
    top: 'calc(50% - 32px)',
    rotation: 'rotate-7',
    scratched: false,
  },
  {
    src: '/images/about/school-3.jpeg',
    altKey: 'about.photos.school3Alt',
    tooltipKey: 'about.tooltips.school3',
    left: 'calc(50% + 116px)',
    top: 'calc(50% + 28px)',
    rotation: '-rotate-5',
    scratched: true,
  },
] as const

const STORY_ALPS_MD = [
  {
    src: '/images/about/alps-1.jpg',
    altKey: 'about.photos.alps1Alt',
    tooltipKey: 'about.tooltips.alps1',
    left: 'calc(50% - 266.97px)',
    top: 'calc(50% - 9.24px)',
    rotation: 'rotate-[-9.05deg]',
    scratched: false,
  },
  {
    src: '/images/about/alps-2.jpg',
    altKey: 'about.photos.alps2Alt',
    tooltipKey: 'about.tooltips.alps2',
    left: 'calc(50% + 88.27px)',
    top: 'calc(50% + 0.86px)',
    rotation: 'rotate-[5.03deg]',
    scratched: false,
  },
  {
    src: '/images/about/alps-3.jpg',
    altKey: 'about.photos.alps3Alt',
    tooltipKey: 'about.tooltips.alps3',
    left: 'calc(50% - 84.5px)',
    top: 'calc(50% + 18.8px)',
    rotation: 'rotate-0',
    scratched: true,
  },
  {
    src: '/images/about/alps-4.jpg',
    altKey: 'about.photos.alps4Alt',
    tooltipKey: 'about.tooltips.alps4',
    left: 'calc(50% + 270.09px)',
    top: 'calc(50% + 2.8px)',
    rotation: 'rotate-[-3.02deg]',
    scratched: true,
  },
] as const

const STORY_ALPS_SM = [
  {
    src: '/images/about/alps-1.jpg',
    altKey: 'about.photos.alps1Alt',
    tooltipKey: 'about.tooltips.alps1',
    left: 'calc(50% - 204px)',
    top: 'calc(50% - 4px)',
    rotation: 'rotate-[-9.05deg]',
    scratched: false,
  },
  {
    src: '/images/about/alps-2.jpg',
    altKey: 'about.photos.alps2Alt',
    tooltipKey: 'about.tooltips.alps2',
    left: 'calc(50% - 66px)',
    top: 'calc(50% + 6px)',
    rotation: 'rotate-[5.03deg]',
    scratched: false,
  },
  {
    src: '/images/about/alps-3.jpg',
    altKey: 'about.photos.alps3Alt',
    tooltipKey: 'about.tooltips.alps3',
    left: 'calc(50% + 66px)',
    top: 'calc(50% + 20px)',
    rotation: 'rotate-0',
    scratched: true,
  },
  {
    src: '/images/about/alps-4.jpg',
    altKey: 'about.photos.alps4Alt',
    tooltipKey: 'about.tooltips.alps4',
    left: 'calc(50% + 204px)',
    top: 'calc(50% + 4px)',
    rotation: 'rotate-[-3.02deg]',
    scratched: true,
  },
] as const

const TAPE_SCHOOL_MD = [
  { left: 'calc(50% - 44px)', top: 'calc(50% - 126px)', rotation: '-rotate-50' },
] as const

const TAPE_SCHOOL_SM = [
  { left: 'calc(50% - 44px)', top: 'calc(50% - 118px)', rotation: '-rotate-50' },
] as const

const TAPE_ALPS_MD = [
  { left: 'calc(50% - 289.96px)', top: 'calc(50% - 102.74px)', rotation: '-rotate-90' },
  { left: 'calc(50% - 89.96px)', top: 'calc(50% - 78.74px)', rotation: '-rotate-90' },
  { left: 'calc(50% + 94.04px)', top: 'calc(50% - 94.74px)', rotation: '-rotate-90' },
  { left: 'calc(50% + 262.04px)', top: 'calc(50% - 94.74px)', rotation: '-rotate-90' },
] as const

const TAPE_ALPS_SM = [
  { left: 'calc(50% - 204px)', top: 'calc(50% - 80px)', rotation: '-rotate-90' },
  { left: 'calc(50% - 66px)', top: 'calc(50% - 80px)', rotation: '-rotate-90' },
  { left: 'calc(50% + 66px)', top: 'calc(50% - 60px)', rotation: '-rotate-90' },
  { left: 'calc(50% + 204px)', top: 'calc(50% - 80px)', rotation: '-rotate-90' },
] as const

const storyBrazil = computed(() => (isBoardMdUp.value ? STORY_BRAZIL_MD : STORY_BRAZIL_SM))
const storySchool = computed(() => (isBoardMdUp.value ? STORY_SCHOOL_MD : STORY_SCHOOL_SM))
const storyAlps = computed(() => (isBoardMdUp.value ? STORY_ALPS_MD : STORY_ALPS_SM))
const tapeSchool = computed(() => (isBoardMdUp.value ? TAPE_SCHOOL_MD : TAPE_SCHOOL_SM))
const tapeAlps = computed(() => (isBoardMdUp.value ? TAPE_ALPS_MD : TAPE_ALPS_SM))

const brazilPinStyle = computed(() =>
  isBoardMdUp.value
    ? { left: 'calc(50% - 244.13px)', top: 'calc(50% - 32px)' }
    : { left: 'calc(50% - 190px)', top: 'calc(50% - 34px)' },
)

const brazilPinShiftClass = computed(() =>
  isBoardMdUp.value ? '-translate-x-1/2 -translate-y-8' : '-translate-x-1/2 -translate-y-7',
)
</script>

<template>
  <section ref="sectionEl" class="relative isolate bg-surface-subtle section-space section-outer" aria-labelledby="about-title">
    <!-- Dot-grid background -->
    <div class="dot-grid pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

    <div
      class="pointer-events-none absolute z-[1] hidden h-60 w-60 -left-40 top-40 lg:block"
      aria-hidden="true"
    >
      <TornPaperDecor side="left" />
    </div>
    <div
      class="pointer-events-none absolute z-[1] hidden -scale-x-100 h-60 w-60 -right-40 top-120 lg:block"
      aria-hidden="true"
    >
      <TornPaperDecor side="right" />
    </div>

    <div class="section-grid relative z-10">
      <div class="col-main flex min-w-0 flex-col gap-16 md:gap-12">

        <!-- ── Section title (always visible) ─────────────────────── -->
        <BaseSectionTitle>
          <template #title>
            <span id="about-title" v-text="$t('about.title')" />
          </template>
          <template #description>
            {{ $t('about.description') }}
          </template>
        </BaseSectionTitle>

        <!-- ── Collapsed state ─────────────────────────────────────── -->
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
              <!-- Plus icon -->
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </template>
            {{ $t('about.openCta') }}
          </BaseButton>
        </template>

        <!-- ── Expanded state ──────────────────────────────────────── -->
        <Transition name="about-expand">
          <div
            v-if="isOpen"
            id="about-expanded"
            class="flex flex-col gap-16 md:gap-20"
          >

            <!-- Story 1: Brazil -->
            <BaseTextBoard>
              <template #text>{{ $t('about.stories.brazil') }}</template>

              <!-- Desktop photos -->
              <template #photos>
                <!-- Pin decoration on left photo -->
                <div
                  class="-scale-x-100 absolute pointer-events-none z-10"
                  :class="brazilPinShiftClass"
                  :style="brazilPinStyle"
                >
                  <BasePin />
                </div>
                <div
                  v-for="photo in storyBrazil"
                  :key="photo.src"
                  class="-translate-x-1/2 -translate-y-1/2 absolute"
                  :style="{ left: photo.left, top: photo.top }"
                >
                  <BaseImageBorder
                    collage
                    :class="photo.rotation"
                    :src="photo.src"
                    :alt="t(photo.altKey)"
                    :tooltip="t(photo.tooltipKey)"
                    :scratched="photo.scratched"
                  />
                </div>
              </template>
            </BaseTextBoard>

            <!-- Story 2: Military school -->
            <BaseTextBoard>
              <template #text>{{ $t('about.stories.school') }}</template>

              <template #photos>
                <!-- Tape decoration -->
                <div
                  v-for="(tape, i) in tapeSchool"
                  :key="i"
                  class="-translate-x-1/2 -translate-y-1/2 absolute pointer-events-none z-10 flex items-center justify-center"
                  :style="{ left: tape.left, top: tape.top }"
                >
                  <div :class="tape.rotation">
                    <BaseTape width="64" height="43" />
                  </div>
                </div>
                <div
                  v-for="photo in storySchool"
                  :key="photo.src"
                  class="-translate-x-1/2 -translate-y-1/2 absolute"
                  :style="{ left: photo.left, top: photo.top }"
                >
                  <BaseImageBorder
                    collage
                    :class="photo.rotation"
                    :src="photo.src"
                    :alt="t(photo.altKey)"
                    :tooltip="t(photo.tooltipKey)"
                    :scratched="photo.scratched"
                  />
                </div>
              </template>
            </BaseTextBoard>

            <!-- Story 3: Swiss Alps -->
            <BaseTextBoard>
              <template #text>{{ $t('about.stories.alps') }}</template>

              <template #photos>
                <!-- Tape decorations -->
                <div
                  v-for="(tape, i) in tapeAlps"
                  :key="i"
                  class="-translate-x-1/2 -translate-y-1/2 absolute pointer-events-none z-10 flex items-center justify-center"
                  :style="{ left: tape.left, top: tape.top }"
                >
                  <div :class="tape.rotation">
                    <BaseTape width="64" height="43" />
                  </div>
                </div>
                <div
                  v-for="photo in storyAlps"
                  :key="photo.src"
                  class="-translate-x-1/2 -translate-y-1/2 absolute"
                  :style="{ left: photo.left, top: photo.top }"
                >
                  <BaseImageBorder
                    collage
                    :class="photo.rotation"
                    :src="photo.src"
                    :alt="t(photo.altKey)"
                    :tooltip="t(photo.tooltipKey)"
                    :scratched="photo.scratched"
                  />
                </div>
              </template>
            </BaseTextBoard>

            <!-- Philosophy: text only, no board -->
            <BaseTextBoard :show-board="false">
              <template #text>{{ $t('about.stories.philosophy') }}</template>
            </BaseTextBoard>

            <!-- Thinker & Doer illustration -->
            <BaseImageThinkerDoer :alt="$t('about.thinkerDoerAlt')" />

            <!-- Collapse button -->
            <BaseButton
              variant="dotted"
              full
              :aria-expanded="true"
              aria-controls="about-expanded"
              @click="toggle"
            >
              <template #icon-left>
                <!-- Minus icon -->
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
