<script setup lang="ts">
import { SITE_LOCALES, type SiteLocaleCode } from '~/constants/site-locales'
import type { GsapTimeline } from '~/composables/useGsap'

const { loadGsap } = useGsap()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { locale, setLocale } = useI18n()

const closeBtnRef = ref<HTMLButtonElement | null>(null)
const renderOpen = ref(false)
const isAnimatingClose = ref(false)

const backdropRef = ref<HTMLDivElement | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)
const langItemRefs = ref<(HTMLElement | null)[]>([])
const footerGroupRef = ref<HTMLElement | null>(null)

let dialogTl: GsapTimeline | null = null

const prefersReducedMotion = useReducedMotion()

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

function dur(s: number) {
  return prefersReducedMotion.value ? 0.001 : s
}

function setLangRef(i: number) {
  return (el: Element | ComponentPublicInstance | null) => {
    langItemRefs.value[i] = unwrapElement(el)
  }
}

async function playOpen() {
  await nextTick()
  if (!backdropRef.value || !panelRef.value) return
  const { gsap } = await loadGsap()
  dialogTl?.kill()

  document.body.style.overflow = 'hidden'

  const langItems = langItemRefs.value.filter(Boolean) as HTMLElement[]
  const footer = footerGroupRef.value

  const d = dur

  gsap.set(backdropRef.value, { opacity: 0 })
  gsap.set(panelRef.value, { y: 28, opacity: 0, scale: 0.96 })
  if (langItems.length) gsap.set(langItems, { y: 18, opacity: 0 })
  if (footer) gsap.set(footer, { y: 14, opacity: 0 })

  const tl = gsap.timeline()
  dialogTl = tl

  tl.fromTo(
    backdropRef.value,
    { opacity: 0 },
    { opacity: 1, duration: d(0.38), ease: 'power2.out' },
    0,
  )

  tl.fromTo(
    panelRef.value,
    { y: 28, opacity: 0, scale: 0.96 },
    { y: 0, opacity: 1, scale: 1, duration: d(0.48), ease: 'power3.out' },
    d(0.1),
  )

  if (langItems.length) {
    tl.fromTo(
      langItems,
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: d(0.42),
        stagger: d(0.05),
        ease: 'back.out(1.45)',
      },
      d(0.26),
    )
  }

  if (footer) {
    tl.fromTo(
      footer,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: d(0.4), ease: 'power3.out' },
      d(0.34),
    )
  }

  tl.call(
    () => {
      closeBtnRef.value?.focus()
    },
    undefined,
    d(0.2),
  )
}

async function playClose(shouldEmit: boolean) {
  if (!renderOpen.value) return
  if (!backdropRef.value || !panelRef.value) {
    dialogTl?.kill()
    isAnimatingClose.value = false
    renderOpen.value = false
    document.body.style.overflow = ''
    if (shouldEmit) emit('close')
    return
  }
  const { gsap } = await loadGsap()
  dialogTl?.kill()
  isAnimatingClose.value = true

  const langItems = langItemRefs.value.filter(Boolean) as HTMLElement[]
  const footer = footerGroupRef.value

  const d = dur

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimatingClose.value = false
      renderOpen.value = false
      document.body.style.overflow = ''
      if (shouldEmit) emit('close')
    },
  })
  dialogTl = tl

  tl.to([...langItems, ...(footer ? [footer] : [])], {
    y: 14,
    opacity: 0,
    duration: d(0.22),
    stagger: d(0.02),
    ease: 'power2.in',
  })

  tl.to(
    panelRef.value,
    {
      y: 16,
      opacity: 0,
      scale: 0.97,
      duration: d(0.32),
      ease: 'power2.in',
    },
    d(0.06),
  )

  tl.to(
    backdropRef.value,
    { opacity: 0, duration: d(0.28), ease: 'power2.in' },
    d(0.12),
  )
}

function requestClose() {
  if (!props.open || isAnimatingClose.value) return
  void playClose(true)
}

function onBackdropPointerDown(e: PointerEvent) {
  if (e.target === backdropRef.value) requestClose()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && renderOpen.value && !isAnimatingClose.value) {
    e.preventDefault()
    requestClose()
  }
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      renderOpen.value = true
      void nextTick(() => void playOpen())
    } else if (renderOpen.value && !isAnimatingClose.value) {
      void nextTick(() => {
        if (!props.open && renderOpen.value && !isAnimatingClose.value) void playClose(false)
      })
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  dialogTl?.kill()
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

async function selectLanguage(code: SiteLocaleCode) {
  if (code !== locale.value) await setLocale(code)
}
</script>

<template>
  <Teleport to="body">
    <template v-if="renderOpen">
      <!-- Backdrop alone at z-60 so the settings FAB (z-[62] when open) can sit above blur, below panel -->
      <div
        ref="backdropRef"
        class="fixed inset-0 z-[60] pointer-events-auto bg-[color-mix(in_srgb,var(--neutral-900)_28%,transparent)] dark:bg-[color-mix(in_srgb,#000_45%,transparent)] backdrop-blur-[2px] motion-reduce:backdrop-blur-none"
        aria-hidden="true"
        @pointerdown="onBackdropPointerDown"
      />
      <div
        class="fixed inset-0 z-[65] flex items-end justify-end pointer-events-none pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] pb-[calc(max(1.25rem,env(safe-area-inset-bottom,0px))+2.5rem+0.375rem)] xl:pr-10 xl:pb-[calc(2rem+2.5rem+0.375rem)]"
      >
        <div
          ref="panelRef"
          role="dialog"
          aria-modal="true"
          :aria-label="$t('header.settings')"
          class="header-settings-dialog-panel relative w-full max-w-[min(20rem,calc(100vw-2rem))] rounded-3xl p-8 pointer-events-auto bg-surface-inverse text-inverse shadow-none origin-bottom will-change-transform"
          @click.stop
        >
          <button
            ref="closeBtnRef"
            type="button"
            class="absolute top-5 right-5 z-[1] flex size-8 items-center justify-center border-0 p-0 cursor-pointer outline-none appearance-none bg-transparent text-inverse/75 hover:text-inverse transition-colors duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-inverse)] rounded-sm"
            :aria-label="$t('header.closeSettings')"
            @click="requestClose"
          >
            <span class="i-hugeicons-multiplication-sign size-5 shrink-0" aria-hidden="true" />
          </button>

          <ul class="list-none m-0 p-0 flex flex-col gap-1 pr-10" role="list">
            <li v-for="(lang, i) in SITE_LOCALES" :key="lang.code">
              <button
                :ref="setLangRef(i)"
                type="button"
                class="w-full flex items-center gap-2 rounded-xl border-0 outline-none appearance-none cursor-pointer pl-1 pr-2 py-2 text-left font-heading font-bold text-[15px] tracking-tight transition-opacity duration-200 ease-out motion-reduce:transition-none hover:opacity-80"
                :class="lang.code === locale ? 'text-inverse' : 'text-inverse/70'"
                @click="selectLanguage(lang.code)"
              >
                <span class="shrink-0 size-3.5 flex items-center justify-center" aria-hidden="true">
                  <span
                    v-if="lang.code === locale"
                    class="block size-2.5 rounded-full bg-red-500 shrink-0"
                  />
                </span>
                <span v-text="lang.label" />
              </button>
            </li>
          </ul>

          <div ref="footerGroupRef">
            <div
              class="my-8 border-t border-[color-mix(in_srgb,var(--color-text-inverse)_16%,transparent)]"
            />
            <BaseThemeSwitch
              variant="inverse"
              size="lg"
              class="!font-bold pl-1 !gap-3 !text-[15px] !tracking-tight"
            />
          </div>
        </div>
      </div>
    </template>
  </Teleport>
</template>
