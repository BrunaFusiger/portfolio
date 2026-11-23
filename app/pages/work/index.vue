<script setup lang="ts">
import { CASE_STUDIES } from '~/constants/case-studies-data'


useHead({
  title: 'Selected work',
  titleTemplate: '%s',
  meta: [
    {
      name: 'description',
      content: 'UX/UI Designer based in Switzerland. Case studies in SaaS, B2B, platform design, and full-stack delivery.',
    },
  ],
})

const featured = CASE_STUDIES[0]
const gridCards = CASE_STUDIES.slice(1)

const hoveredIndex = ref<number | null>(null)

/** Blur + fade for page regions that are not the hovered case-study card (md+ only) */
const workGridHoverPeerDim =
  'md:blur-[10px] md:opacity-45 md:motion-reduce:blur-none md:motion-reduce:opacity-100'

/** Bumps on mountain box hover so HeroMountainSvg remounts and CSS draw replays. */
const mountainDecorKey = ref(0)

function bumpMountainDecor() {
  mountainDecorKey.value += 1
}
</script>

<template>
  <main class="section-outer section-space min-h-[50vh]">
    <section class="relative isolate min-h-[50vh]">
      <BaseDotGridHover class="page-dot-bleed" />
      <div class="section-grid relative z-10">
      <div class="col-main flex flex-col gap-16">
        <div
          class="transition-[filter,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          :class="hoveredIndex !== null ? workGridHoverPeerDim : ''"
        >
          <BaseSectionTitle title="Selected work.">
            <template #description>Strategy, organization and beauty in every screen. Crafting products never built before.</template>
          </BaseSectionTitle>
        </div>

        <div class="flex flex-col gap-9">
          <div
            class="flex gap-8 transition-[filter,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            :class="hoveredIndex !== null ? workGridHoverPeerDim : ''"
          >
            <BaseProductHighlightCard
              :to="`/work/${featured.slug}`"
              :title="featured.title"
              :description="featured.description"
              :tags="featured.tags"
              :cover-image="featured.coverImage"
              :cover-alt="featured.title"
              logo-alt="Euvetia logo"
            />

            <div
              class="group relative hidden w-[160px] shrink-0 overflow-hidden rounded-[32px] border border-surface-subtle bg-background-default transition-colors duration-300 motion-reduce:transition-none hover:bg-surface-subtle md:block"
              @mouseenter="bumpMountainDecor"
            >
              <HeroMountainSvg
                :key="mountainDecorKey"
                class="absolute bottom-[-32px] left-[-14px] w-[188px] text-brand transition-colors duration-300"
                :started="true"
              />
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
                :title="item.title"
                :description="item.description"
                :tags="item.tags"
                :to="`/work/${item.slug}`"
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
                      :alt="item.title"
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
