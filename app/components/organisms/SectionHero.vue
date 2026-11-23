<script setup lang="ts">
import { LINKEDIN_URL, X_URL } from '~/constants/social'

const socialLinks = [
  { platform: 'LinkedIn', labelKey: 'hero.social.linkedin', href: LINKEDIN_URL, icon: 'i-hugeicons-linkedin-01' },
  { platform: 'X', labelKey: 'hero.social.x', href: X_URL, icon: 'i-hugeicons-new-twitter' },
]
</script>

<template>
  <section class="section-outer relative isolate py-10 md:py-14" aria-labelledby="hero-title">
    <div class="section-grid relative">
      <div class="col-wide grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 text-left sm:gap-7 md:gap-9">
        <div class="size-16 overflow-hidden rounded-full sm:size-26">
          <NuxtImg
            class="size-full origin-[50%_30%] scale-[1.6] object-cover"
            src="/media/profile-picture.webp"
            alt=""
            v-bind="nuxtImgRasterDefaults"
            sizes="104px sm:168px"
          />
        </div>

        <div class="grid min-w-0 max-w-[30rem] gap-4">
          <div class="grid gap-1.5">
            <h1
              id="hero-title"
              class="font-heading text-[32px] font-extrabold leading-tight text-default md:text-4xl"
              v-text="$t('hero.title')"
            />
            <p
              class="text-balance font-heading text-base font-medium text-default sm:text-xl"
              v-text="$t('hero.role')"
            />
            <p class="font-heading text-sm text-muted" v-text="$t('hero.location')" />
          </div>

          <p
            class="font-body text-base leading-relaxed text-muted md:text-lg"
            v-text="$t('hero.description')"
          />

          <ul class="flex flex-wrap gap-x-5 gap-y-1">
            <li v-for="social in socialLinks" :key="social.labelKey">
              <a
                :href="social.href"
                :aria-label="social.platform + ' ' + $t(social.labelKey)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-8 items-center gap-2 rounded-sm font-heading text-sm font-medium text-muted underline underline-offset-4 hover:text-default focus-visible:outline-2 focus-visible:outline-offset-3"
              >
                <span :class="social.icon" class="size-4 shrink-0" aria-hidden="true" />
                {{ $t(social.labelKey) }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
