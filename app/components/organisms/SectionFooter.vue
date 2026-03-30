<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <SectionBase variant="wide" :space="false">
    <div class="flex flex-col items-center gap-6 py-24 md:gap-12 md:pt-16 xl:pt-24">
      <Quote class="relative z-10 w-full" :text="$t('footer.title')" />
      <div class="flex w-full max-w-[1120px] flex-col items-center">
        <FooterBenchSvg class="relative z-0 w-full shrink-0" />
        <p
          class="relative z-10 -mt-6 w-full shrink-0 pb-6 text-center font-body text-muted text-sm md:-mt-10 xl:-mt-16"
        >
          &copy; {{ year }}
        </p>
      </div>
    </div>
  </SectionBase>
</template>
