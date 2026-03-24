<script setup lang="ts"></script>

<template>
  <BaseSection variant="wide">
    <div class="mx-auto w-full max-w-[736px] overflow-x-visible">
      <div class="flex flex-col gap-4 md:gap-10">
        <p
          class="font-body text-sm text-muted transition-colors duration-200 md:text-[16px] md:leading-6"
        >
          {{ $t('hero.eyebrow') }}
        </p>
        <h1
          class="font-heading font-black text-default transition-colors duration-200 text-[48px] leading-[56px] md:text-[80px] md:leading-[88px]"
        >
          {{ $t('hero.title') }}
        </h1>
      </div>

      <div
        class="mt-8 flex flex-col gap-4 overflow-x-visible md:mt-10 md:flex-row md:items-end md:justify-between md:gap-8"
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
              <HeroMountainSvg
                class="block h-auto w-full max-w-none object-contain object-right object-top md:h-full md:object-bottom"
              />
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
  </BaseSection>
</template>
