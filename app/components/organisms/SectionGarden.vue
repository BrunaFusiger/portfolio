<script setup lang="ts">
import type { BaseMarqueeSwiperSlide } from '~/types/marquee'
import { GARDEN_ITEMS } from '~/constants/garden-data'

const localePath = useLocalePath()

const marqueeWidths = [
  '!w-[154px] md:!w-[154px]',
  '!w-[280px] md:!w-[382px]',
  '!w-[154px] md:!w-[154px]',
  '!w-[180px] md:!w-[222px]',
  '!w-[320px] md:!w-[559px]',
]

const featuredItems = computed(() => GARDEN_ITEMS.slice(0, marqueeWidths.length))

const slides = computed<BaseMarqueeSwiperSlide[]>(() =>
  featuredItems.value.map((item, i) => ({
    key: item.slug,
    class: marqueeWidths[i] ?? marqueeWidths[marqueeWidths.length - 1]!,
  })),
)

const itemBySlug = computed(() =>
  Object.fromEntries(featuredItems.value.map((item) => [item.slug, item])),
)
</script>

<template>
  <SectionBase variant="full">
    <div class="flex flex-col items-center gap-10 md:gap-16 section-outer">
      <BaseSectionTitle :show-description="false" :title="$t('garden.title')" />
    </div>

    <BaseMarqueeSwiper
      v-if="slides.length"
      :slides="slides"
      slide-height-class="!h-[280px] md:!h-[382px]"
      class="mt-10 md:mt-16 w-full"
    >
      <template #default="{ slide }">
        <NuxtLink
          v-if="itemBySlug[slide.key]"
          :to="localePath(`/garden/${slide.key}`)"
          class="block size-full rounded-4 bg-surface-card overflow-hidden group"
          :aria-label="$t(`garden.items.${itemBySlug[slide.key]!.i18nKey}.title`)"
        >
          <NuxtImg
            :src="itemBySlug[slide.key]!.coverImage"
            :alt="itemBySlug[slide.key]!.coverAlt"
            class="size-full object-cover transform-gpu [backface-visibility:hidden] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
            sizes="(max-width: 767px) 320px, 559px"
            loading="lazy"
            format="webp"
            decoding="async"
          />
        </NuxtLink>
      </template>
    </BaseMarqueeSwiper>

    <div class="flex justify-center mt-10 md:mt-16 section-outer">
      <BaseButton
        variant="solid-red"
        icon="i-hugeicons-flower-pot text-5 shrink-0"
        @click="navigateTo(localePath('/garden'))"
      >
        {{ $t('garden.cta') }}
      </BaseButton>
    </div>
  </SectionBase>
</template>
