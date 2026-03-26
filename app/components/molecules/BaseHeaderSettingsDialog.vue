<script setup lang="ts">
import { SITE_LOCALES, type SiteLocaleCode } from '~/constants/site-locales'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { locale, setLocale } = useI18n()

const closeBtnRef = ref<HTMLButtonElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    e.preventDefault()
    emit('close')
  }
}

watch(
  () => props.open,
  (v) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = v ? 'hidden' : ''
    if (v) {
      nextTick(() => closeBtnRef.value?.focus())
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

async function selectLanguage(code: SiteLocaleCode) {
  if (code !== locale.value) await setLocale(code)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="header-settings-dialog">
      <div
        v-if="open"
        class="header-settings-dialog-root fixed inset-0 z-[60] flex items-end justify-end pointer-events-none pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] pb-[calc(max(1.25rem,env(safe-area-inset-bottom,0px))+2.5rem+0.375rem)] xl:pr-10 xl:pb-[calc(2rem+2.5rem+0.375rem)]"
      >
        <button
          type="button"
          class="header-settings-dialog-backdrop absolute inset-0 z-0 cursor-default border-0 p-0 appearance-none bg-black/25 dark:bg-black/40 motion-reduce:transition-none pointer-events-auto"
          :aria-label="$t('header.closeSettings')"
          @click="emit('close')"
        />

        <div
          role="dialog"
          aria-modal="true"
          :aria-label="$t('header.settings')"
          class="header-settings-dialog-panel relative z-10 w-full max-w-[min(20rem,calc(100vw-2rem))] rounded-2xl p-6 pointer-events-auto bg-surface-subtle text-default shadow-[0_16px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-neutral-200/90 dark:shadow-[0_20px_48px_-16px_rgba(0,0,0,0.45)] dark:ring-neutral-700/70 origin-bottom"
          @click.stop
        >
          <div class="flex items-start justify-between gap-4 mb-6">
            <h2 class="font-heading font-black tracking-[0.02em] text-lg text-default m-0">
              {{ $t('header.settings') }}
            </h2>
            <button
              ref="closeBtnRef"
              type="button"
              class="shrink-0 flex h-9 w-9 items-center justify-center rounded-full border-0 cursor-pointer outline-none appearance-none bg-surface-card text-default transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none hover:opacity-80 active:scale-95 ring-1 ring-neutral-200/80 dark:ring-neutral-600/50"
              :aria-label="$t('header.closeSettings')"
              @click="emit('close')"
            >
              <span class="i-hugeicons-multiplication-sign w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <p
            class="font-heading font-black tracking-[0.02em] text-xs uppercase text-muted m-0 mb-3"
          >
            {{ $t('header.language') }}
          </p>
          <ul class="list-none m-0 p-0 flex flex-col gap-0.5" role="list">
            <li v-for="lang in SITE_LOCALES" :key="lang.code">
              <button
                type="button"
                class="w-full flex items-center gap-2 rounded-xl border-0 outline-none appearance-none cursor-pointer px-2 py-1.5 text-left font-heading font-black tracking-[0.02em] transition-opacity duration-200 ease-out motion-reduce:transition-none hover:opacity-70"
                :class="lang.code === locale ? 'text-default' : 'text-muted'"
                @click="selectLanguage(lang.code)"
              >
                <span class="shrink-0 w-3 h-3 flex items-center justify-center" aria-hidden="true">
                  <span
                    v-if="lang.code === locale"
                    class="block w-2 h-2 rounded-full bg-red-500 shrink-0"
                  />
                </span>
                <span>{{ lang.label }}</span>
              </button>
            </li>
          </ul>

          <div class="my-6 border-t border-neutral-200 dark:border-neutral-700" />

          <p
            class="font-heading font-black tracking-[0.02em] text-xs uppercase text-muted m-0 mb-3"
          >
            {{ $t('header.appearance') }}
          </p>
          <BaseThemeSwitch variant="auto" size="lg" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
