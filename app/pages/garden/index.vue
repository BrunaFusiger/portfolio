<script setup lang="ts">
import { GARDEN_ITEMS, type GardenI18nKey } from '~/constants/garden-data'

const localePath = useLocalePath()
const { t } = useI18n()

useHead({
  title: () => t('seo.gardenTitle'),
  titleTemplate: '%s',
  meta: [
    {
      name: 'description',
      content: () => t('seo.gardenDescription'),
    },
  ],
})

/** i18n `tags` is one string with middle dots; `tm([...])` would yield compiled message nodes, not plain strings. */
const GARDEN_TAG_LINE_SEP = /\s*·\s*/u

function gardenItemTags(i18nKey: GardenI18nKey) {
  const key = `garden.items.${i18nKey}.tags` as const
  const s = t(key)
  if (s === key || !s) return []
  return s
    .split(GARDEN_TAG_LINE_SEP)
    .map((part) => part.trim())
    .filter(Boolean)
}

const REPLAY_DELAY_MS = 6000

const visible = ref(false)
let atTop = true
let scrollRaf = 0
let replayTimer: ReturnType<typeof setTimeout> | null = null

function scheduleReplay() {
  if (replayTimer || visible.value || !atTop) return
  replayTimer = setTimeout(() => {
    replayTimer = null
    visible.value = true
  }, REPLAY_DELAY_MS)
}

function cancelReplay() {
  if (replayTimer) {
    clearTimeout(replayTimer)
    replayTimer = null
  }
}

function onAnimationComplete() {
  visible.value = false
  scheduleReplay()
}

function processScroll() {
  scrollRaf = 0
  const nowAtTop = window.scrollY <= 0
  if (nowAtTop === atTop) return
  atTop = nowAtTop
  if (atTop) scheduleReplay()
  else cancelReplay()
}

function onWindowScroll() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(processScroll)
}

onMounted(() => {
  atTop = window.scrollY <= 0
  if (atTop) visible.value = true
  window.addEventListener('scroll', onWindowScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  cancelReplay()
})
</script>

<template>
  <main class="section-outer section-space min-h-[50vh]">
    <section class="relative isolate min-h-[50vh]">
      <div
        class="pointer-events-none absolute z-1 hidden size-80 -left-60 top-30 lg:block"
        aria-hidden="true"
      >
        <TornPaperDecor side="left" />
      </div>
      <BaseDotGridHover class="page-dot-bleed" />
      <div class="section-grid relative z-10">
        <div class="col-main flex flex-col gap-16">
          <BaseSectionTitle :title="$t('garden.indexTitle')">
            <template #description>{{ $t('garden.indexDescription') }}</template>
          </BaseSectionTitle>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
            <BaseGardenCard
              v-for="item in GARDEN_ITEMS"
              :key="item.slug"
              :to="localePath(`/garden/${item.slug}`)"
              :title="$t(`garden.items.${item.i18nKey}.title`)"
              :tags="gardenItemTags(item.i18nKey)"
              :cover-image="item.coverImage"
              :cover-alt="item.coverAlt"
            />
          </div>
        </div>
      </div>
    </section>

    <div
      class="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] left-[max(1.25rem,env(safe-area-inset-left,0px))] z-30 hidden size-32 lg:block xl:bottom-0 xl:left-10 xl:size-40"
      aria-hidden="true"
    >
      <Transition
        appear
        enter-active-class="transition-opacity duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-500"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <LazyBaseJitterLottie
          v-if="visible"
          src="/animations/watering-can.json"
          fit="meet"
          :loop="false"
          :lazy="false"
          class="absolute inset-0 dark:saturate-0"
          @complete="onAnimationComplete"
        />
      </Transition>
    </div>
  </main>
</template>
