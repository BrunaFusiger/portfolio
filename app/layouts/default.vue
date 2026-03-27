<script setup lang="ts">
const isSettingsOpen = ref(false)
const isLg = ref(false)
let media: MediaQueryList | null = null

function syncLgMq() {
  if (media) isLg.value = media.matches
}

onMounted(() => {
  media = window.matchMedia('(min-width: 1024px)')
  syncLgMq()
  media.addEventListener('change', syncLgMq)
})

onUnmounted(() => {
  media?.removeEventListener('change', syncLgMq)
})

watch(isLg, (lg) => {
  if (!lg) isSettingsOpen.value = false
})

const settingsDialogOpen = computed(() => isSettingsOpen.value && isLg.value)

function closeSettings() {
  isSettingsOpen.value = false
}
</script>

<template>
  <div class="site-shell">
    <BaseHeader />
    <main class="site-main [padding-top:var(--site-header-h,5.5rem)]">
      <slot />
    </main>
    <BaseFooter />

    <!-- Settings: lg+ only (below lg: BaseMobileMenu) -->
    <BaseIconDisk
      v-if="isLg"
      as="button"
      size="lg"
      interaction="button"
      class="fixed z-40 bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))] xl:bottom-8 xl:right-10 shadow-lg"
      :aria-expanded="isSettingsOpen"
      :aria-label="$t('header.settings')"
      @click="isSettingsOpen = !isSettingsOpen"
    >
      <span class="i-hugeicons-settings-01 w-[1.125rem] h-[1.125rem] shrink-0" aria-hidden="true" />
    </BaseIconDisk>
    <BaseHeaderSettingsDialog :open="settingsDialogOpen" @close="closeSettings" />
  </div>
</template>
