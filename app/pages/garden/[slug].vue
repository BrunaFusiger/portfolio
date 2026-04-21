<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()
const slug = computed(() => route.params.slug as string)

const { data: post } = await useAsyncData(
  `garden-${slug.value}-${locale.value}`,
  async () => {
    const primary = await queryCollection('garden')
      .where('stem', '=', `${locale.value}/garden/${slug.value}`)
      .first()
    if (primary) return primary
    if (locale.value !== 'en') {
      return queryCollection('garden')
        .where('stem', '=', `en/garden/${slug.value}`)
        .first()
    }
    return null
  },
  { watch: [locale, slug] },
)

const aspectClassMap: Record<string, string> = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  'square': 'aspect-square',
  '9/16': 'aspect-[9/16]',
  'auto': '',
}
function aspectClass(a?: string) {
  return a ? aspectClassMap[a] ?? 'aspect-[16/9]' : 'aspect-[16/9]'
}
</script>

<template>
  <article v-if="post" class="section-outer pb-12 md:pb-16 xl:pb-24">
    <div class="section-grid">
      <div class="col-main flex flex-col">
        <!-- 1. Picture first -->
        <div class="pt-12 md:pt-16 xl:pt-24">
          <div
            class="relative w-full aspect-[16/10] overflow-hidden rounded-[24px] md:rounded-[32px] border border-surface-subtle bg-surface-subtle"
          >
            <NuxtImg
              :src="post.heroImage"
              :alt="post.heroAlt"
              class="absolute inset-0 size-full object-cover"
              sizes="(max-width: 767px) 100vw, 720px"
              loading="eager"
              format="webp"
              decoding="async"
            />
          </div>
        </div>

        <!-- 2. Title -->
        <h1
          class="mt-10 md:mt-14 overflow-visible font-heading font-black text-default text-[40px] leading-[48px] md:text-[64px] md:leading-[72px]"
        >
          <span class="wind-lift-root">
            <BaseWindLiftText :text="post.title" split-by="char" />
          </span>
        </h1>

        <!-- 3. Tags -->
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mt-6">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="bg-surface-subtle font-body text-muted text-sm md:text-base leading-6 px-2 py-1 rounded-full whitespace-nowrap"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 4. Body -->
        <div class="flex flex-col gap-10 md:gap-14 mt-10 md:mt-14">
          <template v-for="(block, i) in post.body" :key="i">
            <div v-if="block.type === 'prose'" class="flex flex-col gap-6">
              <p
                v-for="(p, j) in block.paragraphs"
                :key="j"
                class="case-study-prose"
              >
                {{ p }}
              </p>
            </div>
            <figure v-else-if="block.type === 'media'" class="flex flex-col gap-3">
              <div
                class="relative w-full overflow-hidden rounded-[24px] border border-surface-subtle bg-surface-subtle"
                :class="aspectClass(block.aspect)"
              >
                <NuxtImg
                  :src="block.src"
                  :alt="block.alt"
                  class="absolute inset-0 size-full object-cover"
                  sizes="(max-width: 767px) 100vw, 720px"
                  loading="lazy"
                  format="webp"
                  decoding="async"
                />
              </div>
              <figcaption
                v-if="block.caption"
                class="font-body text-muted text-sm md:text-base leading-6"
              >
                {{ block.caption }}
              </figcaption>
            </figure>
            <BaseCaseStudyBeforeAfter
              v-else-if="block.type === 'beforeAfter'"
              :before-src="block.beforeSrc"
              :after-src="block.afterSrc"
              :before-alt="block.beforeAlt"
              :after-alt="block.afterAlt"
              :before-label="block.beforeLabel"
              :after-label="block.afterLabel"
              :caption="block.caption"
              :aspect="block.aspect"
              :variant="block.variant"
              :max-height="block.maxHeight"
            />
          </template>
        </div>
      </div>
    </div>
  </article>

  <main v-else class="min-h-screen flex items-center justify-center p-8">
    <div class="flex flex-col items-center gap-6 text-center">
      <h1 class="font-heading font-black text-[48px] text-default">
        {{ slug }}
      </h1>
      <NuxtLink
        :to="localePath('/garden')"
        class="font-heading font-bold text-link text-base underline"
      >
        &larr; {{ $t('garden.cta') }}
      </NuxtLink>
    </div>
  </main>
</template>
