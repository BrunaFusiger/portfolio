<script setup lang="ts">
import { CASE_STUDIES } from '~/constants/case-studies-data'

const localePath = useLocalePath()
const { t } = useI18n()

useHead({
  title: () => t('seo.workTitle'),
  titleTemplate: '%s',
  meta: [
    {
      name: 'description',
      content: () => t('seo.workDescription'),
    },
  ],
})

const featured = CASE_STUDIES[0]
const gridCards = CASE_STUDIES.slice(1)

const hoveredIndex = ref<number | null>(null)

/** Blur + fade for page regions that are not the hovered case-study card */
const workGridHoverPeerDim =
  'blur-[10px] opacity-45 motion-reduce:blur-none motion-reduce:opacity-100'

/** Bumps on mountain box hover so HeroMountainSvg remounts and CSS draw replays. */
const mountainDecorKey = ref(0)

function bumpMountainDecor() {
  mountainDecorKey.value += 1
}

const brandBlockHovered = ref(false)
const brandPaperKey = ref(0)

function onBrandBlockEnter() {
  brandPaperKey.value += 1
  brandBlockHovered.value = true
}
</script>

<template>
  <main class="section-outer section-space min-h-[50vh]">
    <section class="relative isolate min-h-[50vh]">
      <div
        class="pointer-events-none absolute z-1 hidden h-80 w-80 -left-60 top-30 lg:block"
        aria-hidden="true"
      >
        <TornPaperDecor side="left" />
      </div>
      <BaseDotGridHover class="page-dot-bleed" />
      <div class="section-grid relative z-10">
      <div class="col-main flex flex-col gap-16">
        <div
          class="transition-[filter,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          :class="hoveredIndex !== null ? workGridHoverPeerDim : ''"
        >
          <BaseSectionTitle :title="$t('work.indexTitle')">
            <template #description>{{ $t('work.indexDescription') }}</template>
          </BaseSectionTitle>
        </div>

        <div class="flex flex-col gap-9">
          <!-- Featured Euvetia + Decorative boxes (blurred when a grid card is hovered) -->
          <div
            class="flex gap-8 transition-[filter,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            :class="hoveredIndex !== null ? workGridHoverPeerDim : ''"
          >
            <BaseProductHighlightCard
              :to="localePath(`/work/${featured.slug}`)"
              :title="$t(`work.caseStudies.${featured.i18nKey}.title`)"
              :description="$t(`work.caseStudies.${featured.i18nKey}.description`)"
              :tags="$t(`work.caseStudies.${featured.i18nKey}.tags`)"
              :cover-image="featured.coverImage"
              :cover-alt="$t(`work.caseStudies.${featured.i18nKey}.title`)"
              logo-alt="Euvetia logo"
            />

            <!-- Decorative boxes (desktop only) -->
            <div class="hidden md:flex flex-col gap-4 shrink-0 w-[160px]">
              <div
                class="relative size-[160px] overflow-hidden rounded-[32px] border border-surface-subtle bg-background-default transition-colors duration-300 motion-reduce:transition-none hover:bg-surface-subtle"
                @mouseenter="onBrandBlockEnter"
                @mouseleave="brandBlockHovered = false"
              >
                <Transition name="work-brand-torn">
                  <div
                    v-if="brandBlockHovered"
                    class="pointer-events-none absolute -right-10 -top-10 z-[1] h-[100px] w-[86px] origin-top-right"
                  >
                    <TornPaperDecor
                      :key="brandPaperKey"
                      side="right"
                      instant-reveal
                      class="h-full w-full"
                    />
                  </div>
                </Transition>
              </div>
              <div
                class="group relative flex-1 overflow-hidden rounded-[32px] border border-surface-subtle bg-background-default transition-colors duration-300 motion-reduce:transition-none hover:bg-surface-subtle"
                @mouseenter="bumpMountainDecor"
              >
                <HeroMountainSvg
                  :key="mountainDecorKey"
                  class="absolute bottom-[-32px] left-[-14px] w-[188px] text-brand transition-colors duration-300"
                  :started="true"
                />
              </div>
            </div>
          </div>

          <!-- Grid of remaining cards -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-9 overflow-visible"
          >
            <div
              v-for="(item, i) in gridCards"
              :key="item.slug"
              class="min-h-0 transition-[filter,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              :class="[
                hoveredIndex !== null && hoveredIndex !== i ? workGridHoverPeerDim : '',
                hoveredIndex === i ? 'relative z-[1] scale-[1.02] motion-reduce:scale-100' : '',
              ]"
            >
              <BasePrincipleCard
                :title="$t(`work.caseStudies.${item.i18nKey}.title`)"
                :description="$t(`work.caseStudies.${item.i18nKey}.description`)"
                :tags="$t(`work.caseStudies.${item.i18nKey}.tags`)"
                :to="localePath(`/work/${item.slug}`)"
                :media-background-color="'mediaBackgroundColor' in item ? item.mediaBackgroundColor : undefined"
                :paused="hoveredIndex !== null && hoveredIndex !== i"
                @hover-in="hoveredIndex = i"
                @hover-out="hoveredIndex = null"
              >
                <template #media>
                  <div
                    :class="[
                      'absolute inset-0 overflow-hidden',
                      !('mediaBackgroundColor' in item && item.mediaBackgroundColor) && item.coverBg,
                    ]"
                  >
                    <NuxtImg
                      :src="item.coverImage"
                      :alt="$t(`work.caseStudies.${item.i18nKey}.title`)"
                      v-bind="nuxtImgRasterDefaults"
                      class="absolute inset-0 size-full object-cover scale-100 transform-gpu [backface-visibility:hidden] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:group-hover:scale-100 group-hover:scale-[1.045]"
                      sizes="(max-width: 767px) 100vw, 352px"
                      loading="lazy"
                    />
                  </div>
                </template>
              </BasePrincipleCard>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  </main>
</template>

<style scoped>
.work-brand-torn-enter-active,
.work-brand-torn-leave-active {
  transition:
    transform 0.48s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.38s ease;
}

.work-brand-torn-enter-from,
.work-brand-torn-leave-to {
  transform: translate(72%, -58%) scale(0.94);
  opacity: 0;
}

.work-brand-torn-enter-to,
.work-brand-torn-leave-from {
  transform: translate(0, 0) scale(1);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .work-brand-torn-enter-active,
  .work-brand-torn-leave-active {
    transition: none;
  }

  .work-brand-torn-enter-from,
  .work-brand-torn-leave-to {
    transform: none;
    opacity: 1;
  }
}
</style>
