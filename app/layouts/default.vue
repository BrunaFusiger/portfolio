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

const settingsIconSpin = ref(false)

function playSettingsFabSpin() {
  settingsIconSpin.value = false
  nextTick(() => {
    settingsIconSpin.value = true
  })
}

/** Half-turn whenever open state changes (FAB, dialog X, or Escape). */
watch(isSettingsOpen, (open, wasOpen) => {
  if (open === wasOpen) return
  if (!isLg.value) return
  playSettingsFabSpin()
})

function onSettingsFabClick() {
  isSettingsOpen.value = !isSettingsOpen.value
}

function onSettingsIconSpinEnd(e: AnimationEvent) {
  if (e.target !== e.currentTarget) return
  settingsIconSpin.value = false
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
      variant="inverse"
      size="lg"
      interaction="button"
      class="fixed z-40 bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))] xl:bottom-8 xl:right-10"
      :aria-expanded="isSettingsOpen"
      :aria-label="$t('header.settings')"
      @click="onSettingsFabClick"
    >
      <span
        class="settings-fab-icon-wrap grid place-items-center size-[1.125rem] shrink-0"
        :class="{ 'settings-fab-icon-wrap--spin': settingsIconSpin }"
        aria-hidden="true"
        @animationend="onSettingsIconSpinEnd"
      >
        <span
          class="col-start-1 row-start-1 i-hugeicons-settings-01 size-[1.125rem] transition-opacity duration-150 motion-reduce:transition-none"
          :class="isSettingsOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'"
        />
        <span
          class="col-start-1 row-start-1 i-hugeicons-arrow-down-01 size-[1.125rem] transition-opacity duration-150 motion-reduce:transition-none"
          :class="isSettingsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        />
      </span>
    </BaseIconDisk>
    <BaseHeaderSettingsDialog :open="settingsDialogOpen" @close="closeSettings" />

    <!-- Bottom viewport vignette: soft blur + fade into page background (does not block clicks) -->
    <div class="site-bottom-vignette" aria-hidden="true">
      <div class="site-bottom-vignette__blur" />
      <div class="site-bottom-vignette__scrim" />
      <div class="site-bottom-vignette__shine" />
    </div>
  </div>
</template>

<style scoped>
.settings-fab-icon-wrap--spin {
  animation: settings-fab-spin 0.32s ease-in-out both;
}

@media (prefers-reduced-motion: reduce) {
  .settings-fab-icon-wrap--spin {
    animation: none;
  }
}

@keyframes settings-fab-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.site-bottom-vignette {
  pointer-events: none;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  height: min(32vh, 13.5rem);
}

.site-bottom-vignette__blur {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  mask-image: linear-gradient(to top, black 18%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, black 18%, transparent 100%);
}

.site-bottom-vignette__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--color-surface-background) 0%,
    color-mix(in srgb, var(--color-surface-background) 72%, transparent) 38%,
    transparent 100%
  );
}

/* Subtle highlight along the bottom edge (reads stronger in light mode) */
.site-bottom-vignette__shine {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 45%;
  background: linear-gradient(
    to top,
    transparent 0%,
    color-mix(in srgb, var(--shine-highlight-mid) 35%, transparent) 55%,
    transparent 100%
  );
  opacity: 0.55;
  mix-blend-mode: soft-light;
}

.dark .site-bottom-vignette__shine {
  opacity: 0.35;
}

@media (prefers-reduced-motion: reduce) {
  .site-bottom-vignette__blur {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
</style>
