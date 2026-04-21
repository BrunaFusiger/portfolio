<script setup lang="ts">
import { GARDEN_ITEMS } from '~/constants/garden-data'

const localePath = useLocalePath()
</script>

<template>
  <main class="section-outer section-space min-h-[50vh]">
    <div class="section-grid">
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
  </main>
</template>
