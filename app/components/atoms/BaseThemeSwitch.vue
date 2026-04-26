<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => {
  const p = colorMode.preference
  if (p === 'dark') return true
  if (p === 'light') return false
  return colorMode.value === 'dark'
})

type ThemeVariant = 'auto' | 'light' | 'dark' | 'inverse'
type ThemeSize = 'sm' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ThemeVariant
    size?: ThemeSize
  }>(),
  { variant: 'auto', size: 'sm' },
)

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const textColorClass = computed(() => {
  switch (props.variant) {
    case 'light':
      return 'text-white'
    case 'dark':
      return 'text-neutral-900'
    case 'inverse':
      return 'text-inverse'
    default:
      return 'text-muted'
  }
})

const sizeClasses = computed(() => ({
  text: props.size === 'lg' ? 'text-subsection-title' : 'text-body',
  icon: props.size === 'lg' ? 'size-5' : 'size-4',
}))
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 cursor-pointer font-heading font-black tracking-[0.02em] hover:opacity-70 transition-opacity border-0 bg-transparent outline-none appearance-none p-0"
    :class="[textColorClass, sizeClasses.text]"
    :aria-label="`Theme: ${isDark ? $t('header.dark') : $t('header.light')}`"
    @click="toggle"
  >
    <span
      v-if="isDark"
      class="i-hugeicons-moon-02 shrink-0"
      :class="sizeClasses.icon"
      aria-hidden="true"
    />
    <span v-else class="i-hugeicons-sun-03 shrink-0" :class="sizeClasses.icon" aria-hidden="true" />
    <span v-text="isDark ? $t('header.dark') : $t('header.light')" />
  </button>
</template>
