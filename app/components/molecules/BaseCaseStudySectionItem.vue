<script setup lang="ts">
/** One entry from case study `sections` (excluding `sectionBreak`, handled upstream). */
const props = defineProps<{
  block: Record<string, unknown> & { type: string }
  scrollytelling?: Array<{
    title: string
    label: string
    image: string
  }>
}>()
</script>

<template>
  <!-- Heading -->
  <h2
    v-if="block.type === 'heading'"
    class="wind-lift-root font-heading font-extrabold text-default w-full text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] xl:text-[56px] xl:leading-[72px]"
  >
    <BaseWindLiftText :text="(block.text as string)!" split-by="char" />
  </h2>

  <!-- Subheading -->
  <BaseCaseStudySubheading
    v-else-if="block.type === 'subheading' && block.text"
    :text="block.text as string"
  />

  <!-- Scrollytelling -->
  <BaseScrollytelling
    v-else-if="block.type === 'scrollytelling' && scrollytelling?.length"
    :items="scrollytelling"
  />

  <!-- Inline tag chips (prose font size, wrapping row) -->
  <BaseCaseStudyInlineTags
    v-else-if="block.type === 'inlineTags' && (block.items as string[])?.length"
    :items="block.items as string[]"
  />

  <!-- Prose -->
  <div
    v-else-if="block.type === 'prose' && (block.paragraphs as string[])?.length"
    class="flex flex-col gap-5"
  >
    <BaseCaseStudyProseParagraph
      v-for="(paragraph, j) in (block.paragraphs as string[])"
      :key="j"
      :text="paragraph"
    />
  </div>

  <!-- Bracket emphasis (prose + stats, decorative bracket) -->
  <BaseCaseStudyBracketBlock
    v-else-if="block.type === 'bracketBlock' && (block.stats as { value: string; description: string }[])?.length"
    :paragraphs="(block.paragraphs as string[] | undefined)"
    :stats="block.stats as { value: string; description: string }[]"
  />

  <!-- Stat / Relevant Data -->
  <BaseRelevantData
    v-else-if="block.type === 'stat'"
    :value="block.value as string"
    :description="block.description as string"
  />

  <!-- Bullet Points -->
  <div
    v-else-if="block.type === 'bullets' && (block.items as string[])?.length"
    class="flex flex-col gap-6 md:gap-10"
  >
    <BaseBulletPoint
      v-for="(item, j) in (block.items as string[])"
      :key="j"
      :text="item"
    />
  </div>

  <!-- Highlighted Block -->
  <BaseHighlightedBlock
    v-else-if="block.type === 'highlighted'"
    :text="block.text as string"
  />

  <!-- Case study media -->
  <BaseCaseStudyMedia
    v-else-if="block.type === 'media'"
    :src="block.src as string | undefined"
    :alt="block.alt as string | undefined"
    :caption="block.caption as string | undefined"
    :placeholder-label="block.placeholderLabel as string | undefined"
    :aspect="block.aspect as '16/9' | '4/3' | 'square' | '9/16' | 'auto' | undefined"
    :variant="block.variant as 'default' | 'device' | 'bare' | undefined"
    :rounded="block.rounded as boolean | undefined"
    :max-width="block.maxWidth as 'xs' | 'sm' | 'md' | undefined"
  />

  <BaseCaseStudyBeforeAfter
    v-else-if="block.type === 'beforeAfter'"
    :before-src="block.beforeSrc as string"
    :after-src="block.afterSrc as string"
    :before-alt="block.beforeAlt as string | undefined"
    :after-alt="block.afterAlt as string | undefined"
    :before-label="block.beforeLabel as string | undefined"
    :after-label="block.afterLabel as string | undefined"
    :caption="block.caption as string | undefined"
    :aspect="block.aspect as '16/9' | '4/3' | 'square' | '9/16' | 'auto' | undefined"
    :variant="block.variant as 'default' | 'device' | 'bare' | undefined"
    :max-height="block.maxHeight as 'xs' | 'sm' | 'md' | 'xl' | undefined"
  />

  <BaseComputerMockup
    v-else-if="block.type === 'computerMockup'"
    :mockup-src="block.mockupSrc as string | undefined"
    :screen-image-src="block.screenImageSrc as string | undefined"
    :screen-video-src="block.screenVideoSrc as string | undefined"
    :alt="block.alt as string | undefined"
    :caption="block.caption as string | undefined"
    :screen-inset="block.screenInset as { top?: number; left?: number; right?: number; bottom?: number } | undefined"
  />

  <!-- Process steps -->
  <BaseCaseStudyProcess
    v-else-if="block.type === 'process' && (block.steps as unknown[])?.length"
    :steps="block.steps as { title: string; text?: string; items?: string[] }[]"
  />

  <!-- Lottie Animation -->
  <div
    v-else-if="block.type === 'lottie'"
    class="relative w-full overflow-clip rounded-[32px] bg-surface-card aspect-[358/262]"
  >
    <BaseJitterLottie
      :src="block.src as string"
      class="absolute inset-0"
    />
  </div>

  <!-- Case study video -->
  <BaseCaseStudyVideo
    v-else-if="block.type === 'video'"
    :src="block.src as string | undefined"
    :alt="block.alt as string | undefined"
    :caption="block.caption as string | undefined"
    :placeholder-label="block.placeholderLabel as string | undefined"
    :aspect="block.aspect as '16/9' | '4/3' | 'square' | '9/16' | 'auto' | undefined"
    :variant="block.variant as 'default' | 'device' | 'bare' | undefined"
  />
</template>
