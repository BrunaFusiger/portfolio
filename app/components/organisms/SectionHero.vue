<script setup lang="ts">
const heroMountainStarted = ref(false)

const heroRoot = ref<HTMLElement | null>(null)
const heroTitleShine = ref<HTMLElement | null>(null)

function onHeroTitleShineEnter() {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (mq.matches) {
    heroTitleShine.value?.classList.add('shine-effect--played')
  }

  const root = heroRoot.value
  if (!root) return

  if (mq.matches) return

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
  <SectionBase variant="wide">
    <div ref="heroRoot" class="mx-auto w-full max-w-[736px]">
      <div class="flex flex-col gap-4 md:gap-10">
        <p
          class="font-body text-sm text-muted transition-colors duration-200 md:text-[16px] md:leading-6"
        >
          {{ $t('hero.eyebrow') }}
        </p>
        <h1
          class="overflow-hidden font-heading font-black text-default transition-colors duration-200 text-[48px] leading-[56px] md:text-[80px] md:leading-[88px]"
        >
          <span
            ref="heroTitleShine"
            class="shine-effect"
            @mouseenter="onHeroTitleShineEnter"
            @animationend="onHeroTitleShineEnd"
          >
            {{ $t('hero.title') }}
          </span>
        </h1>
      </div>

      <div
        class="mt-8 flex flex-col gap-4 md:mt-10 md:flex-row md:items-end md:justify-between md:gap-8"
      >
        <p
          class="order-1 max-w-full font-body text-sm text-muted transition-colors duration-200 md:order-none md:max-w-[282px] md:text-[16px] md:leading-6"
        >
          {{ $t('hero.description') }}
        </p>

        <div
          class="relative order-2 w-full max-w-[294px] shrink-0 self-center overflow-visible pb-[110.54%] md:mx-0 md:h-[429px] md:max-w-none md:w-[400px] md:self-end md:pb-0"
        >
          <div class="absolute inset-0 overflow-visible">
            <div
              class="pointer-events-none absolute top-0 z-[1] w-[78%] max-w-[230px] left-auto right-[-2.25rem] translate-x-[40%] transition-colors duration-200 text-brand md:right-auto md:w-[387px] md:max-w-none md:translate-x-0 md:top-auto md:bottom-[189px] md:left-[196px] md:h-[321px]"
              aria-hidden="true"
            >
              <div class="hero-mountain-draw" :data-started="heroMountainStarted ? '' : undefined">
                <HeroMountainSvg
                  class="block h-auto w-full max-w-none object-contain object-right object-top md:h-full md:object-bottom"
                />
              </div>
            </div>

            <div
              class="absolute top-1/2 left-1/2 z-10 h-[96.923%] w-full max-w-full -translate-x-1/2 -translate-y-1/2 md:top-0 md:left-0 md:h-full md:translate-x-0 md:translate-y-0"
            >
              <div class="pointer-events-none absolute inset-0 overflow-visible md:overflow-hidden">
                <NuxtImg
                  src="/images/profile-picture.png"
                  :alt="$t('hero.imageAlt')"
                  sizes="(max-width: 768px) min(100vw, 294px), 400px"
                  format="webp"
                  :quality="100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SectionBase>
</template>

<style scoped>
/* Soft diagonal mask reveal (bottom-right → top-left), marker-like edge */
@property --hero-mountain-reveal {
  syntax: '<number>';
  initial-value: 1;
  inherits: false;
}

.hero-mountain-draw {
  --hero-mountain-reveal: 1;
  -webkit-mask-image: linear-gradient(
    to top left,
    #000 0,
    #000 max(0%, calc(var(--hero-mountain-reveal) * 100% - 16%)),
    transparent min(100%, calc(var(--hero-mountain-reveal) * 100% + 1%))
  );
  mask-image: linear-gradient(
    to top left,
    #000 0,
    #000 max(0%, calc(var(--hero-mountain-reveal) * 100% - 16%)),
    transparent min(100%, calc(var(--hero-mountain-reveal) * 100% + 1%))
  );
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
}

.hero-mountain-draw[data-started] {
  animation: hero-mountain-draw 0.78s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes hero-mountain-draw {
  from {
    --hero-mountain-reveal: 0;
  }
  to {
    --hero-mountain-reveal: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-mountain-draw {
    animation: none !important;
    --hero-mountain-reveal: 1;
  }
}
</style>
