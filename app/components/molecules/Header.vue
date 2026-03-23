<script setup lang="ts">
const { gsap } = useGsap()
const colorMode = useColorMode()
const { locale, setLocale } = useI18n()

const isDark = computed(() => colorMode.value === 'dark')

const languages = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'de', label: 'Deutsch' },
] as const

type LocaleCode = (typeof languages)[number]['code']

const currentLabel = computed(
  () => languages.find((l) => l.code === locale.value)?.label ?? locale.value,
)

// ── Mobile menu ──────────────────────────────────────────────────────────────

const isMenuOpen = ref(false)
const menuRef = ref<HTMLDivElement | null>(null)
const menuItemRefs = ref<(HTMLElement | null)[]>([])
const hamburgerRef = ref<HTMLSpanElement | null>(null)

let menuTl: gsap.core.Timeline | null = null

function setMenuItemRef(i: number) {
  return (el: any) => {
    menuItemRefs.value[i] = el?.$el ?? el
  }
}

function openMenu() {
  isMenuOpen.value = true

  nextTick(() => {
    if (!menuRef.value) return
    document.body.style.overflow = 'hidden'

    const items = menuItemRefs.value.filter(Boolean) as HTMLElement[]

    menuTl = gsap.timeline()

    // Hamburger rotates out
    if (hamburgerRef.value) {
      menuTl.to(
        hamburgerRef.value,
        { rotation: 180, opacity: 0, duration: 0.25, ease: 'power2.in' },
        0,
      )
    }

    // Phase 1 — Panel snaps down with jitter-style spring
    menuTl.fromTo(
      menuRef.value,
      { y: '-100%', rotation: -0.3 },
      { y: '0%', rotation: 0, duration: 0.5, ease: 'back.out(1.4)' },
      0,
    )

    // Phase 2 — Items stagger in from below with bouncy spring
    menuTl.fromTo(
      items,
      { y: 40, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(2.5)' },
      0.2,
    )
  })
}

function closeMenu() {
  if (!menuRef.value) return

  menuTl?.kill()

  const items = menuItemRefs.value.filter(Boolean) as HTMLElement[]

  menuTl = gsap.timeline({
    onComplete: () => {
      isMenuOpen.value = false
      document.body.style.overflow = ''
    },
  })

  // Items fade up and out
  menuTl.to(items, {
    y: -20,
    opacity: 0,
    duration: 0.2,
    stagger: 0.03,
    ease: 'power2.in',
  })

  // Panel slides up
  menuTl.to(menuRef.value, { y: '-100%', duration: 0.35, ease: 'power3.in' }, 0.1)

  // Hamburger rotates back in
  if (hamburgerRef.value) {
    menuTl.fromTo(
      hamburgerRef.value,
      { rotation: -180, opacity: 0 },
      { rotation: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
      0.3,
    )
  }
}

function toggleMenu() {
  isMenuOpen.value ? closeMenu() : openMenu()
}

// ── Contact scroll ───────────────────────────────────────────────────────────

function scrollToContact() {
  if (isMenuOpen.value) closeMenu()
  nextTick(() => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}

// ── Mobile menu actions ──────────────────────────────────────────────────────

const mobileLanguageOpen = ref(false)

async function selectLanguage(code: LocaleCode) {
  mobileLanguageOpen.value = false
  if (code !== locale.value) await setLocale(code)
}

function toggleMobileTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// ── Cleanup ──────────────────────────────────────────────────────────────────

onBeforeUnmount(() => {
  menuTl?.kill()
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- ── Header Bar ─────────────────────────────────────────────────────────── -->
  <header
    class="sticky top-0 z-50 bg-surface-background flex items-center justify-between px-6 xl:px-10 py-6"
  >
    <!-- Logo -->
    <NuxtLink to="/" class="shrink-0">
      <Logo />
    </NuxtLink>

    <!-- Desktop Navigation (≥1280px) -->
    <nav class="hidden xl:flex items-center gap-16">
      <!-- Links -->
      <div class="flex items-center gap-6 p-2">
        <NuxtLink
          to="/work"
          class="font-heading font-black text-body tracking-[0.02em] text-surface-brand hover:opacity-70 transition-opacity no-underline"
        >
          work
        </NuxtLink>
        <NuxtLink
          to="/garden"
          class="font-heading font-black text-body tracking-[0.02em] text-surface-brand hover:opacity-70 transition-opacity no-underline"
        >
          garden
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-6">
        <LanguageSelector />
        <ThemeSwitch />
      </div>

      <!-- CTA -->
      <Button @click="scrollToContact">Chat with Bruna</Button>
    </nav>

    <!-- Tablet / Mobile (<1280px) — only hamburger, no actions -->
    <button
      type="button"
      class="flex xl:hidden w-10 h-10 items-center justify-center cursor-pointer border-0 bg-transparent outline-none appearance-none p-0"
      aria-label="Toggle menu"
      @click="toggleMenu"
    >
      <span
        ref="hamburgerRef"
        class="i-hugeicons-menu-02 w-6 h-6 text-surface-brand"
        aria-hidden="true"
      />
    </button>
  </header>

  <!-- ── Mobile Menu Overlay ────────────────────────────────────────────────── -->
  <Teleport to="body">
    <div
      v-if="isMenuOpen"
      ref="menuRef"
      class="dark fixed inset-0 z-[100] bg-neutral-900 flex flex-col"
    >
      <!-- Menu Header — matches Figma p-24 -->
      <div class="flex items-center justify-between p-6">
        <NuxtLink to="/" class="shrink-0" @click="closeMenu">
          <Logo />
        </NuxtLink>

        <button
          type="button"
          class="w-10 h-8 flex items-center justify-center cursor-pointer border-0 bg-transparent outline-none appearance-none p-0 overflow-hidden"
          aria-label="Close menu"
          @click="closeMenu"
        >
          <span class="i-hugeicons-multiplication-sign w-8 h-8 text-white" aria-hidden="true" />
        </button>
      </div>

      <!-- Group 1 — Nav Links: Geist extrabold (800), 40px/48px, white, right-aligned, gap-40px -->
      <div :ref="setMenuItemRef(0)" class="flex-1 flex flex-col items-end gap-10 px-4 pt-8">
        <NuxtLink
          to="/work"
          class="font-heading font-extrabold text-[40px] leading-[48px] text-white hover:opacity-70 transition-opacity no-underline"
          @click="closeMenu"
        >
          work
        </NuxtLink>
        <NuxtLink
          to="/garden"
          class="font-heading font-extrabold text-[40px] leading-[48px] text-white hover:opacity-70 transition-opacity no-underline"
          @click="closeMenu"
        >
          garden
        </NuxtLink>
      </div>

      <!-- Group 2 — Language + Theme: Geist medium (500), 24px/32px, neutral-300 -->

      <!-- Language -->
      <div :ref="setMenuItemRef(1)" class="flex flex-col items-end px-4 py-10">
        <button
          type="button"
          class="inline-flex items-center gap-2 cursor-pointer font-heading font-medium text-subsection-title text-neutral-300 border-0 bg-transparent outline-none appearance-none p-0 hover:opacity-70 transition-opacity"
          @click="mobileLanguageOpen = !mobileLanguageOpen"
        >
          <span class="i-hugeicons-internet w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{{ currentLabel }}</span>
        </button>

        <!-- Language options -->
        <div v-if="mobileLanguageOpen" class="flex flex-col items-end gap-1 mt-4">
          <button
            v-for="lang in languages"
            :key="lang.code"
            type="button"
            class="font-heading font-medium text-body border-0 bg-transparent outline-none appearance-none cursor-pointer px-2 py-1.5 hover:opacity-70 transition-opacity"
            :class="lang.code === locale ? 'text-white' : 'text-neutral-400'"
            @click="selectLanguage(lang.code)"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>

      <!-- Theme -->
      <div :ref="setMenuItemRef(2)" class="flex items-center justify-end gap-2 px-4 py-10">
        <button
          type="button"
          class="inline-flex items-center gap-2 cursor-pointer font-heading font-medium text-subsection-title text-neutral-300 border-0 bg-transparent outline-none appearance-none p-0 hover:opacity-70 transition-opacity"
          @click="toggleMobileTheme"
        >
          <span v-if="isDark" class="i-hugeicons-moon-02 w-5 h-5 shrink-0" aria-hidden="true" />
          <span v-else class="i-hugeicons-sun-03 w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{{ isDark ? 'Dark' : 'Light' }}</span>
        </button>
      </div>

      <!-- Group 3 — Socials: IBM Plex Serif regular, 16px/24px, neutral-300 -->
      <div :ref="setMenuItemRef(3)" class="flex items-center justify-between px-6 py-16 mt-auto">
        <button
          type="button"
          class="inline-flex items-center gap-1 font-body text-body text-neutral-300 border-0 bg-transparent outline-none appearance-none cursor-pointer p-0 hover:opacity-70 transition-opacity"
        >
          <span>Copy</span>
          <span class="i-hugeicons-copy-01 w-4 h-4 shrink-0" aria-hidden="true" />
          <span>email</span>
        </button>
        <a
          href="#"
          class="font-body text-body text-neutral-300 no-underline hover:opacity-70 transition-opacity"
          >LinkedIn</a
        >
        <a
          href="#"
          class="font-body text-body text-neutral-300 no-underline hover:opacity-70 transition-opacity"
          >X</a
        >
      </div>
    </div>
  </Teleport>
</template>
