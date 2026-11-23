<script setup lang="ts">
import { CONTACT_EMAIL, LINKEDIN_URL, X_URL } from '~/constants/social'
import { PRIMARY_NAV_ITEMS } from '~/constants/site-nav'
import type { GsapTimeline } from '~/composables/useGsap'

const { loadGsap } = useGsap()
const { copied: emailCopied, copy } = useClipboardCopy()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const menuRef = ref<HTMLDivElement | null>(null)
const contentRefs = ref<(HTMLElement | null)[]>([])
const checkRef = ref<HTMLSpanElement | null>(null)

let menuTl: GsapTimeline | null = null

function setContentRef(i: number) {
  return (el: Element | ComponentPublicInstance | null) => {
    contentRefs.value[i] = unwrapElement(el)
  }
}

async function playOpen() {
  await nextTick()
  if (!menuRef.value) return
  const { gsap } = await loadGsap()
  document.body.style.overflow = 'hidden'

  const groups = contentRefs.value.filter(Boolean) as HTMLElement[]

  const tl = gsap.timeline()
  menuTl = tl

  tl.fromTo(
    menuRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: 'power2.out' },
    0,
  )

  tl.fromTo(
    groups,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
    0.15,
  )
}

async function playClose() {
  if (!menuRef.value) return
  const { gsap } = await loadGsap()
  menuTl?.kill()

  const groups = contentRefs.value.filter(Boolean) as HTMLElement[]

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = ''
      emit('close')
    },
  })
  menuTl = tl

  tl.to(groups, {
    y: 20,
    opacity: 0,
    duration: 0.25,
    stagger: 0.02,
    ease: 'power2.in',
  })

  tl.to(menuRef.value, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.1)
}

/**
 * Used by the in-menu nav links: NuxtLink fires the route change immediately,
 * so the menu must get out of the way without the ~550ms staggered animation
 * that would otherwise cover the new page. The X button still uses playClose().
 */
function closeForNavigation() {
  menuTl?.kill()
  menuTl = null
  document.body.style.overflow = ''
  emit('close')
}

watch(
  () => props.open,
  (val) => {
    if (val) void playOpen()
  },
)

async function copyEmail() {
  await copy(CONTACT_EMAIL)
  await nextTick()
  if (!checkRef.value) return
  const { gsap } = await loadGsap()
  gsap.fromTo(
    checkRef.value,
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(3)' },
  )
}

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
          <NuxtLink to="/" class="shrink-0" @click="closeForNavigation()">
            <BaseLogo />
          </NuxtLink>

          <button
            type="button"
            class="w-10 h-8 flex items-center justify-center cursor-pointer border-0 bg-transparent outline-none appearance-none p-0 overflow-hidden"
            aria-label="Close menu"
            @click="playClose()"
          >
            <span class="i-hugeicons-multiplication-sign size-8 text-white" aria-hidden="true" />
          </button>
        </div>

        <!-- Nav links — animate from bottom -->
        <div
          :ref="setContentRef(0)"
          class="flex shrink-0 flex-col items-end gap-[clamp(1rem,5dvh,2.5rem)]"
        >
          <NuxtLink
            v-for="item in PRIMARY_NAV_ITEMS"
            :key="item.key"
            :to="item.to"
            class="font-heading font-extrabold text-[40px] leading-[48px] text-white hover:opacity-70 transition-opacity no-underline"
            @click="closeForNavigation()"
          >
            {{ item.label }}
          </NuxtLink>
        </div>

        <!-- Theme — animate from bottom -->
        <div :ref="setContentRef(1)" class="flex shrink-0 items-center justify-end">
          <BaseThemeSwitch variant="light" size="lg" />
        </div>

        <!-- Socials — animate from bottom -->
        <div :ref="setContentRef(2)" class="flex shrink-0 items-center justify-between gap-2">
          <button
            type="button"
            class="inline-flex min-h-[1.5em] max-w-full items-center justify-start overflow-hidden font-body text-neutral-300 border-0 bg-transparent outline-none appearance-none cursor-pointer p-0 hover:opacity-70 transition-opacity"
            @click="copyEmail"
          >
            <template v-if="emailCopied">
              <span
                ref="checkRef"
                class="inline-flex min-w-0 items-center gap-1 text-green-400"
              >
                <span class="i-hugeicons-tick-02 size-4 shrink-0" aria-hidden="true" />
                <span>Copied!</span>
              </span>
            </template>
            <template v-else>
              <span class="inline-flex min-w-0 items-center gap-1">
                <span>Copy</span>
                <span class="i-hugeicons-copy-01 size-4 shrink-0" aria-hidden="true" />
                <span>email</span>
              </span>
            </template>
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
