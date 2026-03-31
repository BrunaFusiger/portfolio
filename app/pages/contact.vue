<script setup lang="ts">
import { CONTACT_EMAIL } from '~/constants/social'

const { gsap } = useGsap()
const reducedMotion = useReducedMotion()
const { copied: emailCopied, copy } = useClipboardCopy()

const rootRef = ref<HTMLElement | null>(null)

function copyEmail() {
  copy(CONTACT_EMAIL)
}

onMounted(() => {
  const root = rootRef.value
  if (!root || typeof window === 'undefined') return
  if (reducedMotion.value) return

  const blocks = root.querySelectorAll<HTMLElement>('[data-contact-reveal]')
  if (!blocks.length) return

  gsap.fromTo(
    blocks,
    { opacity: 0, y: 22 },
    {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'transform',
    },
  )
})
</script>

<template>
  <main ref="rootRef" class="section-outer section-space min-h-[65vh]">
    <div class="section-grid">
      <div class="col-main flex flex-col gap-8 md:gap-12">
        <header
          data-contact-reveal
          class="flex flex-col gap-3 opacity-0 motion-reduce:opacity-100"
        >
          <p class="font-body text-sm md:text-lg text-muted m-0" v-text="$t('contact.eyebrow')" />
          <h1
            class="font-heading font-black text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.02em] text-default m-0"
            v-text="$t('contact.title')"
          />
        </header>

        <p
          data-contact-reveal
          class="opacity-0 motion-reduce:opacity-100 font-body text-base md:text-xl text-muted leading-relaxed text-measure m-0 max-w-[52ch]"
          v-text="$t('contact.description')"
        />

        <div
          data-contact-reveal
          class="opacity-0 motion-reduce:opacity-100 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 bg-surface-subtle/60 p-6 md:p-8 transition-shadow duration-300 hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.35)]"
        >
          <p
            class="font-heading font-black tracking-[0.02em] text-xs uppercase text-muted m-0 mb-4"
            v-text="$t('contact.emailLabel')"
          />
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <a
              :href="`mailto:${CONTACT_EMAIL}`"
              class="font-heading font-black text-lg md:text-xl text-link no-underline transition-opacity duration-200 hover:opacity-75 break-all"
              v-text="CONTACT_EMAIL"
            />
            <button
              type="button"
              class="shrink-0 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-heading font-black tracking-[0.02em] text-sm border-0 cursor-pointer outline-none appearance-none bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.98] motion-reduce:active:scale-100"
              @click="copyEmail"
            >
              <span
                v-if="emailCopied"
                class="i-hugeicons-tick-02 w-4 h-4 shrink-0 text-green-400 dark:text-green-600"
                aria-hidden="true"
              />
              <span v-else class="i-hugeicons-copy-01 w-4 h-4 shrink-0" aria-hidden="true" />
              <span v-text="emailCopied ? $t('actions.copied') : $t('contact.emailAction')" />
            </button>
          </div>
          <p class="font-body text-xs text-subtle m-0 mt-4" v-text="$t('contact.copyHint')" />
        </div>
      </div>
    </div>
  </main>
</template>
