<script setup lang="ts">
const year = new Date().getFullYear()

const footerRootRef = ref<HTMLElement | null>(null)
const isMdUp = useMediaQuery('(min-width: 768px)', { defaultValue: false })
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', {
  defaultValue: false,
})

const footerIntersecting = ref(false)
const arrowPlayed = ref(false)
const arrowActive = ref(false)

let arrowDelayTimer: ReturnType<typeof setTimeout> | null = null

function scheduleGiftArrow() {
  if (import.meta.server || !isMdUp.value || prefersReducedMotion.value || arrowPlayed.value) return
  arrowPlayed.value = true
  arrowDelayTimer = setTimeout(() => {
    arrowDelayTimer = null
    if (!footerIntersecting.value || !isMdUp.value || prefersReducedMotion.value) {
      arrowPlayed.value = false
      return
    }
    arrowActive.value = true
  }, 500)
}

useIntersectionObserver(
  footerRootRef,
  ([entry]) => {
    footerIntersecting.value = entry?.isIntersecting ?? false
    if (footerIntersecting.value) scheduleGiftArrow()
  },
  { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
)

watch([isMdUp, prefersReducedMotion], () => {
  if (footerIntersecting.value) scheduleGiftArrow()
})

onBeforeUnmount(() => {
  if (arrowDelayTimer) {
    clearTimeout(arrowDelayTimer)
    arrowDelayTimer = null
  }
})
</script>

<template>
  <SectionBase variant="wide" :space="false" class="relative">
    <div
        class="pointer-events-none absolute z-0 hidden size-80 -left-50 top-60 lg:block"
        aria-hidden="true"
      >
        <TornPaperDecor side="left" />
      </div>
    <div ref="footerRootRef" >
      <div class="flex flex-col items-center gap-6 py-24 md:gap-12 md:pt-16 xl:pt-24">
        <BaseQuote class="relative z-10 w-full" :text="$t('footer.title')" />
        <div class="flex w-full max-w-[1120px] flex-col items-center">
          <div class="relative w-full shrink-0">
            <FooterBenchSvg class="relative z-0 w-full" />
            <!-- md+: hand-drawn arrow — public/media/utils/arrow-red.png -->
            <div
              v-if="isMdUp && !prefersReducedMotion"
              class="pointer-events-none absolute inset-0 z-[12]"
              aria-hidden="true"
            >
              <div
                class="footer-gift-arrow-wrap"
                :class="{ 'footer-gift-arrow-wrap--active': arrowActive }"
              >
                <NuxtImg
                  src="/media/utils/arrow-red.png"
                  alt=""
                  v-bind="nuxtImgRasterDefaults"
                  class="footer-gift-arrow-img dark:saturate-0"
                  sizes="(max-width: 1023px) 96px, 168px"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            </div>
          </div>
          <p
            class="relative z-10 w-full shrink-0 pb-6 pt-4 text-center font-body text-muted text-sm md:pt-2"
          >
            {{ $t('footer.copyright', { year }) }}
          </p>
        </div>
      </div>
    </div>
  </SectionBase>
</template>

<style scoped>
/* Placement vs 1120×503 bench: below seat, aimed at gift (right). arrow-red.png is BL→TR diagonal. */
.footer-gift-arrow-wrap {
  position: absolute;
  left: 50%;
  bottom: 5%;
  /* md (768–1023px): smaller; lg+ matches previous scale */
  width: min(17%, 6rem);
  transform: translateX(-28%) rotate(-6deg);
  transform-origin: 18% 92%;
}

@media (min-width: 1024px) {
  .footer-gift-arrow-wrap {
    width: min(26%, 10.5rem);
  }
}

.footer-gift-arrow-img {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transform: translateY(1.75rem);
  transform-origin: 50% 100%;
}

.footer-gift-arrow-wrap--active .footer-gift-arrow-img {
  animation: footer-gift-arrow-png 2.6s cubic-bezier(0.33, 1, 0.68, 1) forwards;
}

@keyframes footer-gift-arrow-png {
  0% {
    opacity: 0;
    transform: translateY(2.25rem);
  }
  10% {
    opacity: 1;
  }
  42% {
    opacity: 1;
    transform: translateY(0);
  }
  68% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-0.35rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-gift-arrow-wrap--active .footer-gift-arrow-img {
    animation: none;
  }
}
</style>
