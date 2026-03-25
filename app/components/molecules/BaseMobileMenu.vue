<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

const { gsap } = useGsap()
const { locale, setLocale } = useI18n()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const EMAIL = 'bruna.fusiger@gmail.com'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'PortuguÃªs' },
  { code: 'it', label: 'Italiano' },
  { code: 'de', label: 'Deutsch' },
] as const

type LocaleCode = (typeof languages)[number]['code']

// â”€â”€ Refs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const menuRef = ref<HTMLDivElement | null>(null)
const contentRefs = ref<(HTMLElement | null)[]>([])
const langItemRefs = ref<(HTMLElement | null)[]>([])
const checkRef = ref<HTMLSpanElement | null>(null)
const emailCopied = ref(false)

let menuTl: gsap.core.Timeline | null = null

function unwrapElement(el: Element | ComponentPublicInstance | null): HTMLElement | null {
  if (el == null) return null
  if (typeof el === 'object' && '$el' in el) {
    const node = (el as ComponentPublicInstance).$el
    return node instanceof HTMLElement ? node : null
  }
  return el instanceof HTMLElement ? el : null
}

function setContentRef(i: number) {
  return (el: Element | ComponentPublicInstance | null) => {
    contentRefs.value[i] = unwrapElement(el)
  }
}

function setLangRef(i: number) {
  return (el: Element | ComponentPublicInstance | null) => {
    langItemRefs.value[i] = unwrapElement(el)
  }
}

// â”€â”€ Open animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function playOpen() {
  nextTick(() => {
    if (!menuRef.value) return
    document.body.style.overflow = 'hidden'

    const groups = contentRefs.value.filter(Boolean) as HTMLElement[]
    const langItems = langItemRefs.value.filter(Boolean) as HTMLElement[]

    menuTl = gsap.timeline()

    // Background fades in smoothly
    menuTl.fromTo(
      menuRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      0,
    )

    // Content groups rise from below with subtle movement
    menuTl.fromTo(
      groups,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
      0.15,
    )

    // Language items stagger from below individually
    if (langItems.length) {
      menuTl.fromTo(
        langItems,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.5)' },
        0.3,
      )
    }
  })
}

// â”€â”€ Close animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function playClose() {
  if (!menuRef.value) return
  menuTl?.kill()

  const groups = contentRefs.value.filter(Boolean) as HTMLElement[]
  const langItems = langItemRefs.value.filter(Boolean) as HTMLElement[]

  menuTl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = ''
      emit('close')
    },
  })

  // All content fades out
  menuTl.to([...groups, ...langItems], {
    y: 20,
    opacity: 0,
    duration: 0.25,
    stagger: 0.02,
    ease: 'power2.in',
  })

  // Background fades out
  menuTl.to(menuRef.value, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.1)
}

// â”€â”€ Watch open prop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

watch(
  () => props.open,
  (val) => {
    if (val) playOpen()
  },
)

// â”€â”€ Copy email â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = EMAIL
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }

  emailCopied.value = true

  nextTick(() => {
    if (checkRef.value) {
      gsap.fromTo(
        checkRef.value,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(3)' },
      )
    }
  })

  setTimeout(() => {
    emailCopied.value = false
  }, 2000)
}

// â”€â”€ Language â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function selectLanguage(code: LocaleCode) {
  if (code !== locale.value) await setLocale(code)
}

// â”€â”€ Cleanup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

onBeforeUnmount(() => {
  menuTl?.kill()
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="menuRef"
      class="dark fixed inset-0 z-[100] bg-neutral-900 flex flex-col"
    >
      <!-- Header â€” Logo + Close (no bottom animation) -->
      <div class="flex items-center justify-between p-6">
        <NuxtLink to="/" class="shrink-0" @click="playClose()">
          <BaseLogo />
        </NuxtLink>

        <button
          type="button"
          class="w-10 h-8 flex items-center justify-center cursor-pointer border-0 bg-transparent outline-none appearance-none p-0 overflow-hidden"
          aria-label="Close menu"
          @click="playClose()"
        >
          <span class="i-hugeicons-multiplication-sign w-8 h-8 text-white" aria-hidden="true" />
        </button>
      </div>

      <!-- Nav links â€” animate from bottom -->
      <div :ref="setContentRef(0)" class="flex-1 flex flex-col items-end gap-10 px-4 pt-8">
        <NuxtLink
          to="/work"
          class="font-heading font-extrabold text-[40px] leading-[48px] text-white hover:opacity-70 transition-opacity no-underline"
          @click="playClose()"
        >
          {{ $t('header.work') }}
        </NuxtLink>
        <NuxtLink
          to="/garden"
          class="font-heading font-extrabold text-[40px] leading-[48px] text-white hover:opacity-70 transition-opacity no-underline"
          @click="playClose()"
        >
          {{ $t('header.garden') }}
        </NuxtLink>
      </div>

      <!-- Language selector â€” items animate individually from bottom -->
      <div class="flex flex-col items-end gap-2 px-4 py-10">
        <button
          v-for="(lang, i) in languages"
          :key="lang.code"
          :ref="setLangRef(i)"
          type="button"
          class="inline-flex items-center gap-2 font-heading font-black tracking-[0.02em] border-0 bg-transparent outline-none appearance-none cursor-pointer px-2 py-1.5 hover:opacity-70 transition-opacity"
          :class="lang.code === locale ? 'text-white' : 'text-neutral-400'"
          @click="selectLanguage(lang.code)"
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

      <!-- Theme â€” animate from bottom -->
      <div :ref="setContentRef(1)" class="flex items-center justify-end px-4 py-10">
        <BaseThemeSwitch variant="light" size="lg" />
      </div>

      <!-- Socials â€” animate from bottom -->
      <div :ref="setContentRef(2)" class="flex items-center justify-between px-6 py-16 mt-auto">
        <button
          type="button"
          class="inline-flex items-center gap-1 font-body text-neutral-300 border-0 bg-transparent outline-none appearance-none cursor-pointer p-0 hover:opacity-70 transition-opacity"
          @click="copyEmail"
        >
          <span
            v-if="emailCopied"
            ref="checkRef"
            class="inline-flex items-center gap-1 text-green-400"
          >
            <span class="i-hugeicons-tick-02 w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{{ $t('actions.copied') }}</span>
          </span>
          <span v-else class="inline-flex items-center gap-1">
            <span>{{ $t('actions.copy') }}</span>
            <span class="i-hugeicons-copy-01 w-4 h-4 shrink-0" aria-hidden="true" />
            <span>email</span>
          </span>
        </button>
        <a
          href="#"
          class="font-body text-neutral-300 no-underline hover:opacity-70 transition-opacity"
        >LinkedIn</a>
        <a
          href="#"
          class="font-body text-neutral-300 no-underline hover:opacity-70 transition-opacity"
        >X</a>
      </div>
    </div>
  </Teleport>
</template>
