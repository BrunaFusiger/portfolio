<script setup lang="ts">
import type { CaseStudyBlock, CaseStudyScrollytellingItem } from '~/types/case-study'

defineProps<{
  block: CaseStudyBlock
  scrollytelling?: CaseStudyScrollytellingItem[]
}>()
</script>

<template>
  <!-- Heading -->
  <h2
    v-if="block.type === 'heading'"
    class="wind-lift-root font-heading font-extrabold text-default w-full text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] xl:text-[56px] xl:leading-[72px]"
  >
    <BaseWindLiftText :text="block.text" split-by="char" />
  </h2>

  <!-- Subheading -->
  <BaseCaseStudySubheading
    v-else-if="block.type === 'subheading' && block.text"
    :text="block.text"
  />

  <!-- Scrollytelling -->
  <BaseScrollytelling
    v-else-if="block.type === 'scrollytelling' && scrollytelling?.length"
    :items="scrollytelling"
  />

  <!-- Inline tag chips (prose font size, wrapping row) -->
  <BaseCaseStudyInlineTags
    v-else-if="block.type === 'inlineTags' && block.items?.length"
    :items="block.items"
  />

  <!-- Prose -->
  <div
    v-else-if="block.type === 'prose' && block.paragraphs?.length"
    class="flex flex-col gap-5"
  >
    <BaseCaseStudyProseParagraph
      v-for="(paragraph, j) in block.paragraphs"
      :key="j"
      :text="paragraph"
    />
  </div>

  <!-- Bracket emphasis (prose + stats, decorative bracket) -->
  <BaseCaseStudyBracketBlock
    v-else-if="block.type === 'bracketBlock' && block.stats?.length"
    :paragraphs="block.paragraphs"
    :stats="block.stats"
  />

  <!-- Stat / Relevant Data -->
  <BaseRelevantData
    v-else-if="block.type === 'stat'"
    :value="block.value"
    :description="block.description"
  />

  <!-- Bullet Points -->
  <div
    v-else-if="block.type === 'bullets' && block.items?.length"
    class="flex flex-col gap-6 md:gap-10"
  >
    <BaseBulletPoint
      v-for="(item, j) in block.items"
      :key="j"
      :text="item"
    />
  </div>

  <!-- Highlighted Block -->
  <BaseHighlightedBlock
    v-else-if="block.type === 'highlighted'"
    :text="block.text"
  />

  <!-- Case study media -->
  <BaseCaseStudyMedia
    v-else-if="block.type === 'media'"
    :src="block.src"
    :alt="block.alt"
    :caption="block.caption"
    :placeholder-label="block.placeholderLabel"
    :aspect="block.aspect"
    :variant="block.variant"
    :rounded="block.rounded"
    :max-width="block.maxWidth"
  />

  <BaseCaseStudyBeforeAfter
    v-else-if="block.type === 'beforeAfter'"
    :before-src="block.beforeSrc"
    :after-src="block.afterSrc"
    :before-alt="block.beforeAlt"
    :after-alt="block.afterAlt"
    :before-label="block.beforeLabel"
    :after-label="block.afterLabel"
    :caption="block.caption"
    :aspect="block.aspect"
    :variant="block.variant"
    :max-height="block.maxHeight"
  />

  <BaseComputerMockup
    v-else-if="block.type === 'computerMockup'"
    :mockup-src="block.mockupSrc"
    :screen-image-src="block.screenImageSrc"
    :screen-video-src="block.screenVideoSrc"
    :alt="block.alt"
    :caption="block.caption"
    :screen-inset="block.screenInset"
  />

  <!-- Process steps -->
  <BaseCaseStudyProcess
    v-else-if="block.type === 'process' && block.steps?.length"
    :steps="block.steps"
  />

  <!-- Lottie Animation -->
  <div
    v-else-if="block.type === 'lottie'"
    class="relative w-full overflow-clip rounded-[32px] bg-surface-card aspect-[358/262]"
  >
    <BaseJitterLottie
      :src="block.src"
      class="absolute inset-0"
    />
  </div>

  <!-- Case study video -->
  <BaseCaseStudyVideo
    v-else-if="block.type === 'video'"
    :src="block.src"
    :alt="block.alt"
    :caption="block.caption"
    :placeholder-label="block.placeholderLabel"
    :aspect="block.aspect"
    :variant="block.variant"
  />
</template>
