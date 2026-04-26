<script setup lang="ts">
import type { BaseMarqueeSwiperSlide } from '~/types/marquee'
import { GARDEN_ITEMS } from '~/constants/garden-data'

const localePath = useLocalePath()

/** Slide width only; height follows `BaseGardenCard` `aspect-[7/8]` like the garden grid. */
const marqueeSlideClass = '!w-[220px] md:!w-[260px]'

const slides = computed<BaseMarqueeSwiperSlide[]>(() =>
  GARDEN_ITEMS.map((item) => ({
    key: item.slug,
    class: marqueeSlideClass,
  })),
)

const itemBySlug = computed(() =>
  Object.fromEntries(GARDEN_ITEMS.map((item) => [item.slug, item])),
)
</script>

<template>
  <SectionBase variant="full">
    <div
      class="flex w-full min-w-0 flex-col items-stretch gap-6 md:gap-8"
    >
      <!-- variant full skips SectionBase section-outer; add it here so title matches SectionWork gutters on mobile. -->
      <div class="section-outer section-grid w-full">
        <div class="col-main">
          <BaseSectionTitle :show-description="false" :title="$t('garden.title')" />
        </div>
      </div>

      <BaseMarqueeSwiper
        v-if="slides.length"
        :slides="slides"
        slide-height-class="!h-auto self-start"
        class="w-full max-w-none self-stretch"
      >
        <template #default="{ slide }">
          <BaseGardenCard
            v-if="itemBySlug[slide.key]"
            media-only
            class="block w-full"
            :to="localePath(`/garden/${slide.key}`)"
            :title="$t(`garden.items.${itemBySlug[slide.key]!.i18nKey}.title`)"
            :cover-image="itemBySlug[slide.key]!.coverImage"
            :cover-alt="itemBySlug[slide.key]!.coverAlt"
          />
        </template>
      </BaseMarqueeSwiper>

      <div class="section-outer section-grid w-full">
        <div class="col-main flex justify-center">
          <BaseButton
            variant="solid-red"
            icon="i-hugeicons-flower-pot text-5 shrink-0"
            :to="localePath('/garden')"
          >
            {{ $t('garden.cta') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </SectionBase>
</template>
