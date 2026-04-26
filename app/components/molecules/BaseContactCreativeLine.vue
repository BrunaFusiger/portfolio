<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex w-full flex-col items-center gap-3 md:gap-4">
    <div class="flex w-full min-w-0 items-center gap-0">
      <div
        class="min-h-0 min-w-0 flex-1 border-t border-dashed border-surface-brand"
        aria-hidden="true"
      />
      <div
        class="relative z-1 flex shrink-0 items-center justify-center bg-surface-background px-2.5 py-px md:px-3"
      >
        <NuxtImg
          src="/media/illustrations/edelweiss.png"
          :alt="t('contact.edelweissAlt')"
          v-bind="nuxtImgRasterDefaults"
          class="size-11 object-contain md:size-12 dark:saturate-0"
          sizes="48px"
          loading="lazy"
        />
      </div>
      <div
        class="min-h-0 min-w-0 flex-1 border-t border-dashed border-surface-brand"
        aria-hidden="true"
      />
    </div>
    <p
      class="max-w-lg px-2 text-center font-body text-sm leading-snug text-muted md:text-base md:leading-snug"
    >
      {{ t('contact.creativeCopy') }}
    </p>
  </div>
</template>
