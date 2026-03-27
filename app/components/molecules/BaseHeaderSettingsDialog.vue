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
        <div
          role="dialog"
          aria-modal="true"
          :aria-label="$t('header.settings')"
          class="header-settings-dialog-panel relative z-10 w-full max-w-[min(20rem,calc(100vw-2rem))] rounded-3xl p-8 pointer-events-auto bg-surface-card text-default  shadow-2xl  dark:bg-neutral-800  origin-bottom"
          @click.stop
        >
          <button
            ref="closeBtnRef"
            type="button"
            class="absolute top-5 right-5 z-[1] flex size-8 items-center justify-center border-0 p-0 cursor-pointer outline-none appearance-none bg-transparent text-muted hover:text-default transition-colors duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card dark:focus-visible:ring-offset-neutral-800 rounded-sm"
            :aria-label="$t('header.closeSettings')"
            @click="emit('close')"
          >
            <span class="i-hugeicons-multiplication-sign w-5 h-5 shrink-0" aria-hidden="true" />
          </button>

          <ul class="list-none m-0 p-0 flex flex-col gap-1 pr-10" role="list">
            <li v-for="lang in SITE_LOCALES" :key="lang.code">
              <button
                type="button"
                class="w-full flex items-center gap-2 rounded-xl border-0 outline-none appearance-none cursor-pointer pl-1 pr-2 py-2 text-left font-heading font-bold text-[15px] tracking-tight transition-opacity duration-200 ease-out motion-reduce:transition-none hover:opacity-80"
                :class="lang.code === locale ? 'text-default' : 'text-muted'"
                @click="selectLanguage(lang.code)"
              >
                <span class="shrink-0 w-3.5 h-3.5 flex items-center justify-center" aria-hidden="true">
                  <span
                    v-if="lang.code === locale"
                    class="block w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"
                  />
                </span>
                <span>{{ lang.label }}</span>
              </button>
            </li>
          </ul>

          <div class="my-8 border-t border-neutral-200/90 dark:border-neutral-600/80" />
          <BaseThemeSwitch
            variant="auto"
            size="lg"
            class="!font-bold pl-1 !gap-3 !text-[15px] !tracking-tight"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
