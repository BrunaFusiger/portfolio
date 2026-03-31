<script setup lang="ts">
const year = new Date().getFullYear()
const prefersReducedMotion = useReducedMotion()

function scrollFooterToTop() {
  if (import.meta.server) return
  window.scrollTo({ top: 0, behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
}
</script>

<template>
  <SectionBase variant="wide" :space="false" class="relative isolate">
    <div
        class="pointer-events-none absolute z-0 hidden h-80 w-80 -left-50 top-60 xl:block"
        aria-hidden="true"
      >
        <TornPaperDecor side="left" />
      </div>
    <div class="flex flex-col items-center gap-6 py-24 md:gap-12 md:pt-16 xl:pt-24">
      <BaseQuote class="relative z-10 w-full" :text="$t('footer.title')" />
      <div class="flex w-full max-w-[1120px] flex-col items-center">
        <FooterBenchSvg class="relative z-0 w-full shrink-0" />
        <BaseButton
          variant="text-link"
          icon="i-hugeicons-arrow-up-01 text-5 shrink-0"
          class="relative z-10 mx-auto max-md:-mt-5 max-md:mb-10 max-w-[min(100%,22rem)] shrink-0 md:hidden"
          @click="scrollFooterToTop"
        >
          <span class="underline-offset-4 hover:underline">{{ $t('footer.backToTopTooltip') }}</span>
        </BaseButton>
        <p
          class="relative z-10 w-full shrink-0 pb-6 text-center font-body text-muted text-sm md:-mt-10 xl:-mt-16"
        >
          &copy; {{ year }}
        </p>
      </div>
    </div>
  </SectionBase>
</template>
