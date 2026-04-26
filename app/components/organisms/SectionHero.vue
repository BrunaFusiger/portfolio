<script setup lang="ts">
const heroMountainStarted = ref(false)
const prefersReducedMotion = useReducedMotion()

const heroRoot = ref<HTMLElement | null>(null)
const heroTitleShine = ref<HTMLElement | null>(null)

function onHeroTitleShineEnter() {
  if (typeof window === 'undefined') return
  if (prefersReducedMotion.value) return
  const el = heroTitleShine.value
  if (!el || !el.classList.contains('shine-effect--played')) return
  el.classList.add('shine-effect--hover-shine')
}

function onHeroTitleShineEnd(e: AnimationEvent) {
  const name = e.animationName
  if (name === 'diagonal-shine') {
    const el = heroTitleShine.value
    el?.classList.add('shine-effect--played')
    if (el?.matches(':hover')) {
      el.classList.add('shine-effect--hover-shine')
    }
    return
  }
  if (name === 'diagonal-shine-hover' || name.endsWith('diagonal-shine-hover')) {
    heroTitleShine.value?.classList.remove('shine-effect--hover-shine')
  }
}

onMounted(() => {
  if (prefersReducedMotion.value) {
    heroTitleShine.value?.classList.add('shine-effect--played')
    heroMountainStarted.value = true
  }

  const root = heroRoot.value
  if (!root) return

  if (prefersReducedMotion.value) return

  const start = () => {
    heroMountainStarted.value = true
  }

  const rect = root.getBoundingClientRect()
  const inView =
    rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0 && rect.height > 0

  if (inView) {
    requestAnimationFrame(() => {
      requestAnimationFrame(start)
    })
    return
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        start()
        io.disconnect()
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px 10% 0px' },
  )
  io.observe(root)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <section class="relative py-12 isolate">
    <div
      class="pointer-events-none absolute z-1 hidden size-80 -left-50 top-30 lg:block"
      aria-hidden="true"
    >
      <TornPaperDecor side="left" />
    </div>
    <BaseDotGridHover
      class="inset-x-0 bottom-0 top-[calc(-1*var(--site-header-h,5.5rem))]"
    />
    <div ref="heroRoot" class="relative z-1 mx-auto w-full max-w-[736px] px-4 md:px-0">
      <div class="flex flex-col gap-4 md:gap-4">
        <p
          class="font-body text-sm text-muted transition-colors duration-200 md:text-lg md:leading-6"
          v-text="$t('hero.eyebrow')"
        />
        <h1
          class="overflow-visible font-heading font-black text-default transition-colors duration-200 text-[48px] leading-[56px] md:text-[80px] md:leading-[88px]"
        >
          <span
            ref="heroTitleShine"
            class="shine-effect wind-lift-root"
            @mouseenter="onHeroTitleShineEnter"
            @animationend="onHeroTitleShineEnd"
          >
            <BaseWindLiftText
              :text="$t('hero.title')"
              split-by="char"
            />
          </span>
        </h1>
      </div>

      <div
        class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8"
      >
        <p
          class="order-1 max-w-full font-body text-sm text-muted transition-colors duration-200 md:order-none md:max-w-[282px] md:text-lg md:leading-8 md:mb-4"
          v-text="$t('hero.description')"
        />

        <div
          class="relative order-2 mx-auto aspect-[324/347] w-full max-w-[294px] shrink-0 self-center overflow-visible md:mx-0 md:aspect-auto md:h-[347px] md:max-w-none md:w-[324px] md:self-end"
        >
          <div
            class="pointer-events-none absolute top-0 z-[1] w-[78%] max-w-[230px] left-auto right-[-2.25rem] translate-x-[40%] transition-colors duration-200 text-brand md:right-auto md:w-[313px] md:max-w-none md:translate-x-0 md:top-auto md:bottom-[153px] md:left-[158px] md:h-[260px]"
            aria-hidden="true"
          >
            <HeroMountainSvg
              :started="heroMountainStarted"
              class="object-contain object-right-top md:h-full md:object-bottom"
            />
          </div>

          <div
            class="relative z-10 w-full md:absolute md:inset-0 md:overflow-visible"
          >
            <div
              class="pointer-events-none overflow-visible md:absolute md:inset-0 md:overflow-hidden"
            >
              <div
                class="relative w-full md:absolute md:size-full md:max-w-full md:top-0 md:left-0 md:translate-0"
              >
                <NuxtImg
                  class="h-auto max-w-full w-full md:size-full md:object-contain"
                  src="/media/profile-picture.png"
                  :alt="$t('hero.imageAlt')"
                  v-bind="nuxtImgRasterDefaults"
                  sizes="324px"
                  fetchpriority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
