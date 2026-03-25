<script setup lang="ts">
defineOptions({ name: 'SiteHeader' })

const { gsap } = useGsap()

const isMenuOpen = ref(false)
const hamburgerRef = ref<HTMLSpanElement | null>(null)

// â”€â”€ Contact scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function scrollToContact() {
  const el = document.getElementById('contact')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// â”€â”€ Mobile menu â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function openMenu() {
  isMenuOpen.value = true
  if (hamburgerRef.value) {
    gsap.to(hamburgerRef.value, { rotation: 180, opacity: 0, duration: 0.25, ease: 'power2.in' })
  }
}

function onMenuClose() {
  isMenuOpen.value = false
  if (hamburgerRef.value) {
    gsap.fromTo(
      hamburgerRef.value,
      { rotation: -180, opacity: 0 },
      { rotation: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
    )
  }
}
</script>

<template>
  <!-- â”€â”€ Header Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
  <header
    class="sticky top-0 z-50 bg-surface-background flex items-center justify-between px-6 xl:px-10 py-6"
  >
    <!-- Logo -->
    <NuxtLink to="/" class="shrink-0 text-3xl">
      <BaseLogo />
    </NuxtLink>

    <!-- Desktop Navigation (â‰¥1280px) -->
    <nav class="hidden xl:flex items-center gap-16">
      <!-- Links -->
      <div class="flex items-center gap-6 p-2">
        <NuxtLink
          to="/work"
          class="font-heading font-black tracking-[0.02em] text-default hover:opacity-70 transition-opacity no-underline"
        >
          {{ $t('header.work') }}
        </NuxtLink>
        <NuxtLink
          to="/garden"
          class="font-heading font-black tracking-[0.02em] text-default hover:opacity-70 transition-opacity no-underline"
        >
          {{ $t('header.garden') }}
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-6">
        <BaseLanguageSelector />
        <BaseThemeSwitch />
      </div>

      <!-- CTA -->
      <BaseButton @click="scrollToContact">{{ $t('header.cta') }}</BaseButton>
    </nav>

    <!-- Mobile hamburger (<1280px) -->
    <button
      type="button"
      class="flex xl:hidden w-10 h-10 items-center justify-center cursor-pointer border-0 bg-transparent outline-none appearance-none p-0"
      aria-label="Toggle menu"
      @click="openMenu"
    >
      <span
        ref="hamburgerRef"
        class="i-hugeicons-menu-02 w-6 h-6 text-default"
        aria-hidden="true"
      />
    </button>
  </header>

  <!-- â”€â”€ Mobile Menu â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
  <BaseMobileMenu :open="isMenuOpen" @close="onMenuClose" />
</template>

