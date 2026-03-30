<script setup lang="ts">
import type { BaseMarqueeSwiperSlide } from '~/components/molecules/BaseMarqueeSwiper.vue'

const localePath = useLocalePath()

const slides: BaseMarqueeSwiperSlide[] = [
  { key: 'item-1', class: '!w-[154px] md:!w-[154px]' },
  { key: 'item-2', class: '!w-[280px] md:!w-[382px]' },
  { key: 'item-3', class: '!w-[154px] md:!w-[154px]' },
  { key: 'item-4', class: '!w-[180px] md:!w-[222px]' },
  { key: 'item-5', class: '!w-[320px] md:!w-[559px]' },
]
</script>

<template>
  <SectionBase variant="full">
    <div class="flex flex-col items-center gap-10 md:gap-16 section-outer">
      <BaseSectionTitle :show-description="false" :title="$t('garden.title')" />
    </div>

    <BaseMarqueeSwiper
      :slides="slides"
      slide-height-class="!h-[280px] md:!h-[382px]"
      class="mt-10 md:mt-16 w-full"
    >
      <template #default="{ slide }">
        <div class="size-full rounded-4 bg-surface-card overflow-hidden">
          <slot :name="slide.key" />
        </div>
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
