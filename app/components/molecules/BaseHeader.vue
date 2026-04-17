<script setup lang="ts">

const route = useRoute()
const localePath = useLocalePath()

/** Locales that use a URL prefix (`prefix_except_default`; default locale has none). */
const PREFIX_LOCALES = new Set(['pt', 'it', 'de'])

type NavSection = 'work' | 'garden' | 'contact'

const activeNavSection = computed<NavSection | null>(() => {
  const segs = route.path.split('/').filter(Boolean)
  const first = segs[0]
  const section = first && PREFIX_LOCALES.has(first) ? segs[1] : first
  if (section === 'work' || section === 'garden' || section === 'contact') return section
  return null
})

const desktopNavItems = [
  { to: '/work', key: 'work' as const, labelKey: 'header.work' as const },
  { to: '/garden', key: 'garden' as const, labelKey: 'header.garden' as const },
  { to: '/contact', key: 'contact' as const, labelKey: 'header.contact' as const },
]

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
    class="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 xl:px-10 lg:py-4 py-6 transition-[transform,box-shadow,background-color] duration-300 ease-out motion-reduce:transition-none will-change-transform"
    :class="[
      isHeaderHidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0',
      !isScrolledPastTop && !isMenuOpen ? 'bg-transparent' : 'bg-surface-background',
      isScrolledPastTop
        ? 'shadow-[0_4px_14px_-6px_rgba(0,0,0,0.07)] dark:shadow-[0_6px_18px_-8px_rgba(0,0,0,0.32)]'
        : 'shadow-none',
    ]"
  >
    <!-- Logo -->
    <NuxtLink :to="localePath('/')" class="shrink-0 text-3xl">
      <BaseLogo />
    </NuxtLink>

    <!-- Desktop Navigation (≥1280px) -->
    <nav class="hidden lg:flex items-center gap-10 2xl:gap-16">
      <!-- Links -->
      <div class="flex items-center gap-2 p-2">
        <div
          v-for="item in desktopNavItems"
          :key="item.key"
          class="flex flex-col items-center"
        >
          <NuxtLink :to="localePath(item.to)" class="header-nav-link">{{ $t(item.labelKey) }}</NuxtLink>
          <span
            class="size-1.5 shrink-0 rounded-full bg-[var(--red-500)] transition-opacity duration-200 ease-out motion-reduce:transition-none"
            :class="activeNavSection === item.key ? 'opacity-100' : 'opacity-0'"
            aria-hidden="true"
          />
        </div>
      </div>
    </nav>

    <!-- Mobile menu (<1280px) -->
    <BaseIconDisk
      as="button"
      size="lg"
      interaction="button"
      class="lg:hidden"
      :aria-label="$t('header.toggleMenu')"
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
