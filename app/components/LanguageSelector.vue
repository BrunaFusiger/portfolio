<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const { locale, setLocale } = useI18n()

const languages = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'de', label: 'Deutsch' },
] as const

type LocaleCode = typeof languages[number]['code']

const currentLabel = computed(
  () => languages.find(l => l.code === locale.value)?.label ?? locale.value,
)

const wrapperRef = ref<HTMLDivElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)
const isOpen = ref(false)

// ── Animation ─────────────────────────────────────────────────────────────────

function open() {
  if (isOpen.value || !dropdownRef.value) return
  isOpen.value = true
  gsap.fromTo(
    dropdownRef.value,
    { autoAlpha: 0, y: -6 },
    { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power3.out' },
  )
}

function close() {
  if (!isOpen.value || !dropdownRef.value) return
  gsap.to(dropdownRef.value, {
    autoAlpha: 0,
    y: -4,
    duration: 0.15,
    ease: 'power2.in',
    onComplete: () => { isOpen.value = false },
  })
}

function toggle() {
  isOpen.value ? close() : open()
}

// ── Language switch ───────────────────────────────────────────────────────────

async function select(code: LocaleCode) {
  close()
  if (code !== locale.value) await setLocale(code)
}

// ── Click outside ─────────────────────────────────────────────────────────────

function onPointerDown(e: PointerEvent) {
  if (!wrapperRef.value?.contains(e.target as Node)) close()
}

onMounted(() => {
  gsap.set(dropdownRef.value, { autoAlpha: 0 })
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
      class="inline-flex items-center gap-2 cursor-pointer font-black text-base leading-6 tracking-[0.02em] text-default hover:opacity-70 transition-opacity border-0 bg-transparent outline-none appearance-none p-0
               "
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-label="`Language: ${currentLabel}`"
      @click="toggle"
    >
      <span class="i-hugeicons-internet w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{{ currentLabel }}</span>
    </button>

    <!-- ── Dropdown ────────────────────────────────────────────────────────── -->
    <div
      ref="dropdownRef"
      role="listbox"
      :aria-label="`Language — current: ${currentLabel}`"
      class="absolute right-0 top-[calc(100%+10px)] min-w-[156px] z-50 border-0 rounded-xl bg-neutral-900"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        type="button"
        role="option"
        :aria-selected="lang.code === locale"
        class="border-0 outline-none appearance-none
               w-full flex items-center gap-2 px-3 py-2 text-left box-border bg-neutral-900 cursor-pointer font-black text-base leading-6 tracking-[0.02em] transition-colors duration-120 rounded-2xl"
               :class="lang.code === locale 
  ? 'text-white hover:bg-[#292929]' 
  : 'text-[#888888] hover:bg-[#292929] hover:text-white'"
        @click="select(lang.code)"
      >
        <span class="shrink-0 w-3 h-3 flex items-center justify-center">
          <span
            v-if="lang.code === locale"
            class="block w-1 h-1 rounded-full bg-red-500"
            aria-hidden="true"
          />
        </span>

        <span>{{ lang.label }}</span>
      </button>
    </div>

  </div>
</template>