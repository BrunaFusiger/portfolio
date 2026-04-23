<script setup lang="ts">
import { GARDEN_ITEMS } from '~/constants/garden-data'

const localePath = useLocalePath()
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
      <BaseDotGridHover
        class="inset-x-0 top-[calc(-1*(var(--site-header-h,5.5rem)+3rem))] bottom-[calc(-1*3rem)] md:top-[calc(-1*(var(--site-header-h,5.5rem)+4rem))] md:bottom-[calc(-1*4rem)] xl:top-[calc(-1*(var(--site-header-h,5.5rem)+6rem))] xl:bottom-[calc(-1*6rem)]"
      />
      <div class="section-grid relative z-10">
        <div class="col-main flex flex-col gap-16">
          <BaseSectionTitle :title="$t('garden.indexTitle')">
            <template #description>{{ $t('garden.indexDescription') }}</template>
          </BaseSectionTitle>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
            <BaseGardenCard
              v-for="item in GARDEN_ITEMS"
              :key="item.slug"
              :to="localePath(`/garden/${item.slug}`)"
              :title="$t(`garden.items.${item.i18nKey}.title`)"
              :cover-image="item.coverImage"
              :cover-alt="item.coverAlt"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
