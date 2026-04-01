<script setup lang="ts">
import { CASE_STUDIES } from '~/constants/case-studies-data'

const localePath = useLocalePath()
</script>

<template>
  <main class="section-outer section-space min-h-[50vh]">
    <div class="section-grid">
      <div class="col-main flex flex-col gap-8 md:gap-10">
        <header class="flex flex-col gap-3">
          <h1 class="font-heading font-black text-page-title text-default" v-text="$t('work.indexTitle')" />
          <p class="max-w-2xl font-body text-muted text-lg" v-text="$t('work.indexDescription')" />
        </header>
        <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          <li v-for="item in CASE_STUDIES" :key="item.slug">
            <NuxtLink
              :to="localePath(`/work/${item.slug}`)"
              class="flex items-center rounded-lg border border-neutral-200 bg-surface-background px-4 py-4 font-body text-default transition-[border-color,box-shadow] duration-200 hover:border-brand/35 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] dark:border-neutral-700 dark:hover:border-brand/40"
            >
              <span class="text-base font-medium" v-text="$t(`work.caseStudies.${item.i18nKey}.title`)" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>
