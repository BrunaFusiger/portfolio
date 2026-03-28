<script setup lang="ts">

const { gsap } = useGsap()

const isMenuOpen = ref(false)
const hamburgerRef = ref<HTMLSpanElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)

/** Near top of page: header always visible */
const SCROLL_TOP_THRESHOLD_PX = 48
/** Min upward movement per animation frame to reveal (fast scroll); smaller nudges keep it hidden */
const UP_REVEAL_MIN_DELTA_PX = 20

const isHeaderHidden = ref(false)
/** Past the top region: show a light shadow under the bar */
const isScrolledPastTop = ref(false)

let lastScrollY = 0
let scrollRaf = 0
let headerResizeObserver: ResizeObserver | null = null

function applyHeaderHeightVar() {
  const el = headerRef.value
  if (!el || typeof document === 'undefined') return
  document.documentElement.style.setProperty('--site-header-h', `${el.offsetHeight}px`)
}

function processScroll() {
  scrollRaf = 0
  const y = window.scrollY
  isScrolledPastTop.value = y > SCROLL_TOP_THRESHOLD_PX

  if (y <= SCROLL_TOP_THRESHOLD_PX) {
    isHeaderHidden.value = false
    lastScrollY = y
    return
  }

  if (isMenuOpen.value) {
    lastScrollY = y
    return
  }

  const delta = y - lastScrollY
  lastScrollY = y

  if (delta > 0) {
    isHeaderHidden.value = true
  } else if (delta < 0 && -delta >= UP_REVEAL_MIN_DELTA_PX) {
    isHeaderHidden.value = false
  }
}

function onWindowScroll() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(processScroll)
}

onMounted(() => {
  lastScrollY = window.scrollY
  isScrolledPastTop.value = window.scrollY > SCROLL_TOP_THRESHOLD_PX
  applyHeaderHeightVar()
  window.addEventListener('scroll', onWindowScroll, { passive: true })

  const el = headerRef.value
  if (el && typeof ResizeObserver !== 'undefined') {
    headerResizeObserver = new ResizeObserver(() => applyHeaderHeightVar())
    headerResizeObserver.observe(el)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onWindowScroll)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  headerResizeObserver?.disconnect()
  headerResizeObserver = null
})

// ── Mobile menu ──────────────────────────────────────────────────────────────

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
  <!-- ── Header Bar ─────────────────────────────────────────────────────────── -->
  <header
    ref="headerRef"
    class="fixed inset-x-0 top-0 z-50 bg-surface-background flex items-center justify-between px-6 xl:px-10 lg:py-4 py-6 transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none will-change-transform"
    :class="[
      isHeaderHidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0',
      isScrolledPastTop
        ? 'shadow-[0_4px_14px_-6px_rgba(0,0,0,0.07)] dark:shadow-[0_6px_18px_-8px_rgba(0,0,0,0.32)]'
        : 'shadow-none',
    ]"
  >
    <!-- Logo -->
    <NuxtLink to="/" class="shrink-0 text-3xl">
      <BaseLogo />
    </NuxtLink>

    <!-- Desktop Navigation (≥1280px) -->
    <nav class="hidden lg:flex items-center gap-10 2xl:gap-16">
      <!-- Links -->
      <div class="flex items-center gap-2 p-2">
        <NuxtLink to="/work" class="header-nav-link">{{ $t('header.work') }}</NuxtLink>
        <NuxtLink to="/garden" class="header-nav-link">{{ $t('header.garden') }}</NuxtLink>
        <NuxtLink to="/contact" class="header-nav-link">{{ $t('header.contact') }}</NuxtLink>
      </div>
    </nav>

    <!-- Mobile menu (<1280px) -->
    <BaseIconDisk
      as="button"
      size="lg"
      interaction="button"
      class="lg:hidden"
      aria-label="Toggle menu"
      @click="openMenu"
    >
      <span
        ref="hamburgerRef"
        class="i-hugeicons-menu-02 w-4 h-4 shrink-0"
        aria-hidden="true"
      />
    </BaseIconDisk>
  </header>

  <!-- ── Mobile Menu ──────────────────────────────────────────────────────────── -->
  <BaseMobileMenu :open="isMenuOpen" @close="onMenuClose" />
</template>
