<script setup lang="ts">
import { SITE_LOCALES, type SiteLocaleCode } from '~/constants/site-locales'

const { loadGsap } = useGsap()

const { locale, setLocale } = useI18n()

const currentLabel = computed(
  () => SITE_LOCALES.find((l) => l.code === locale.value)?.label ?? locale.value,
)

const wrapperRef = ref<HTMLDivElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)
const isOpen = ref(false)

async function open() {
  if (isOpen.value || !dropdownRef.value) return
  isOpen.value = true
  const { gsap } = await loadGsap()
  gsap.fromTo(
    dropdownRef.value,
    { autoAlpha: 0, y: -6 },
    { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power3.out' },
  )
}

async function close() {
  if (!isOpen.value || !dropdownRef.value) return
  const { gsap } = await loadGsap()
  gsap.to(dropdownRef.value, {
    autoAlpha: 0,
    y: -4,
    duration: 0.15,
    ease: 'power2.in',
    onComplete: () => {
      isOpen.value = false
    },
  })
}

function toggle() {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

async function select(code: SiteLocaleCode) {
  close()
  if (code !== locale.value) await setLocale(code)
}

function onPointerDown(e: PointerEvent) {
  if (!wrapperRef.value?.contains(e.target as Node)) close()
}

onMounted(async () => {
  if (dropdownRef.value) {
    const { gsap } = await loadGsap()
    gsap.set(dropdownRef.value, { autoAlpha: 0 })
  }
  document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <div ref="wrapperRef" class="relative">
    <!-- ── Trigger ─────────────────────────────────────────────────────────── -->
    <button
      type="button"
      class="inline-flex items-center gap-2 cursor-pointer font-heading font-black tracking-[0.02em] text-muted hover:opacity-70 transition-opacity border-0 bg-transparent outline-none appearance-none p-0"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-label="`Language: ${currentLabel}`"
      @click="toggle"
    >
      <span class="i-hugeicons-internet size-4 shrink-0" aria-hidden="true" />
      <span v-text="currentLabel" />
    </button>

    <!-- ── Dropdown ────────────────────────────────────────────────────────── -->
    <div
      ref="dropdownRef"
      role="listbox"
      :aria-label="`Language — current: ${currentLabel}`"
      class="absolute right-0 top-[calc(100%+10px)] min-w-[156px] z-[200] border-0 rounded-xl bg-neutral-900 shadow-xl"
    >
      <button
        v-for="lang in SITE_LOCALES"
        :key="lang.code"
        type="button"
        role="option"
        :aria-selected="lang.code === locale"
        class="border-0 outline-none appearance-none w-full flex items-center gap-2 px-3 py-2 text-left box-border bg-neutral-900 cursor-pointer font-black text-base leading-6 tracking-[0.02em] transition-colors duration-120 rounded-2xl"
        :class="
          lang.code === locale
            ? 'text-white hover:bg-neutral-800'
            : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
        "
        @click="select(lang.code)"
      >
        <span class="shrink-0 size-3 flex items-center justify-center">
          <span
            v-if="lang.code === locale"
            class="block size-1 rounded-full bg-red-500"
            aria-hidden="true"
          />
        </span>

        <span v-text="lang.label" />
      </button>
    </div>
  </div>
</template>
