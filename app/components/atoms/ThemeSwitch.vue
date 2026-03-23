<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 cursor-pointer font-heading font-black text-body tracking-[0.02em] text-interactive-muted hover:opacity-70 transition-opacity border-0 bg-transparent outline-none appearance-none p-0"
    :aria-label="`Theme: ${isDark ? 'Dark' : 'Light'}`"
    @click="toggle"
  >
    <span v-if="isDark" class="i-hugeicons-moon-02 w-4 h-4 shrink-0" aria-hidden="true" />
    <span v-else class="i-hugeicons-sun-03 w-4 h-4 shrink-0" aria-hidden="true" />
    <span>{{ isDark ? 'Dark' : 'Light' }}</span>
  </button>
</template>
