<script setup lang="ts">
import BaseContactOutreach from '~/components/molecules/BaseContactOutreach.vue'

definePageMeta({
  hideFooter: true,
})
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
        <div class="col-main flex w-full min-w-0 flex-col gap-10 md:gap-16">
          <BaseSectionTitle :title="$t('contact.title')">
            <template #description>{{ $t('contact.description') }}</template>
          </BaseSectionTitle>

          <div class="flex flex-wrap gap-2">
            <BasePillTag>
              <template #icon>
                <span class="i-hugeicons-location-01 size-4" />
              </template>
              {{ $t('contact.locale') }}
            </BasePillTag>
            <BasePillTag>
              <template #icon>
                <span class="i-hugeicons-passport size-4" />
              </template>
              {{ $t('contact.workAuthorization') }}
            </BasePillTag>
            <BasePillTag>
              <template #icon>
                <span class="i-hugeicons-briefcase-01 size-4" />
              </template>
              {{ $t('contact.availableForWork') }}
            </BasePillTag>
          </div>

          <BaseRulesRulerFrame>
            <BaseContactOutreach />
          </BaseRulesRulerFrame>

          <BaseContactCreativeLine />
        </div>
      </div>
    </section>
  </main>
</template>
