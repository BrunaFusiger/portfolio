<script setup lang="ts">
import { CONTACT_EMAIL, LINKEDIN_URL, X_URL } from '~/constants/social'
import { SITE_LOCALES, type SiteLocaleCode } from '~/constants/site-locales'

const { gsap } = useGsap()
const { locale, setLocale } = useI18n()
const { copied: emailCopied, copy } = useClipboardCopy()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const menuRef = ref<HTMLDivElement | null>(null)
const contentRefs = ref<(HTMLElement | null)[]>([])
const langItemRefs = ref<(HTMLElement | null)[]>([])
const checkRef = ref<HTMLSpanElement | null>(null)

let menuTl: gsap.core.Timeline | null = null

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

// ── Open animation ───────────────────────────────────────────────────────────

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

// ── Close animation ──────────────────────────────────────────────────────────

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

// ── Watch open prop ──────────────────────────────────────────────────────────

watch(
  () => props.open,
  (val) => {
    if (val) playOpen()
  },
)

async function copyEmail() {
  await copy(CONTACT_EMAIL)
  nextTick(() => {
    if (checkRef.value) {
      gsap.fromTo(
        checkRef.value,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(3)' },
      )
    }
  })
}

// ── Language ─────────────────────────────────────────────────────────────────

async function selectLanguage(code: SiteLocaleCode) {
  if (code !== locale.value) await setLocale(code)
}

// ── Cleanup ──────────────────────────────────────────────────────────────────

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
      class="dark fixed inset-0 z-[100] bg-neutral-900 flex flex-col min-h-0 h-[100dvh] max-h-[100dvh] overflow-y-auto overscroll-y-contain pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-[env(safe-area-inset-top,0px)] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1.25rem))] xl:pl-[max(2.5rem,env(safe-area-inset-left))] xl:pr-[max(2.5rem,env(safe-area-inset-right))]"
    >
      <div
        class="flex flex-col flex-1 min-h-0 justify-between gap-[clamp(0.5rem,2.5dvh,1.5rem)] pb-6"
      >
        <!-- Header — Logo + Close (no bottom animation) -->
        <div class="flex shrink-0 items-center justify-between py-8 lg:py-4">
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

        <!-- Nav links — animate from bottom -->
        <div
          :ref="setContentRef(0)"
          class="flex shrink-0 flex-col items-end gap-[clamp(1rem,5dvh,2.5rem)]"
        >
          <NuxtLink
            to="/work"
            class="font-heading font-extrabold text-[40px] leading-[48px] text-white hover:opacity-70 transition-opacity no-underline"
            v-text="$t('header.work')"
            @click="playClose()"
          />
          <NuxtLink
            to="/garden"
            class="font-heading font-extrabold text-[40px] leading-[48px] text-white hover:opacity-70 transition-opacity no-underline"
            v-text="$t('header.garden')"
            @click="playClose()"
          />
        </div>

        <!-- Language selector — items animate individually from bottom -->
        <div class="flex shrink-0 flex-col items-end gap-[clamp(0.25rem,1.5dvh,0.5rem)]">
          <button
            v-for="(lang, i) in SITE_LOCALES"
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
            <span v-text="lang.label" />
          </button>
        </div>

        <!-- Theme — animate from bottom -->
        <div :ref="setContentRef(1)" class="flex shrink-0 items-center justify-end">
          <BaseThemeSwitch variant="light" size="lg" />
        </div>

        <!-- Socials — animate from bottom -->
        <div :ref="setContentRef(2)" class="flex shrink-0 items-center justify-between gap-2">
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
              <span v-text="$t('actions.copied')" />
            </span>
            <span v-else class="inline-flex items-center gap-1">
              <span v-text="$t('actions.copy')" />
              <span class="i-hugeicons-copy-01 w-4 h-4 shrink-0" aria-hidden="true" />
              <span>email</span>
            </span>
          </button>
          <a
            :href="LINKEDIN_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="font-body text-neutral-300 no-underline hover:opacity-70 transition-opacity"
          >LinkedIn</a>
          <a
            :href="X_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="font-body text-neutral-300 no-underline hover:opacity-70 transition-opacity"
          >X</a>
        </div>
      </div>
    </div>
  </Teleport>
</template>
