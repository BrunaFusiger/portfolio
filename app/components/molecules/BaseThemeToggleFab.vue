<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => {
  const preference = colorMode.preference
  if (preference === 'dark') return true
  if (preference === 'light') return false
  return colorMode.value === 'dark'
})

const label = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'))

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <BaseIconDisk
    as="button"
    variant="inverse"
    size="lg"
    interaction="button"
    class="group"
    :aria-label="label"
    :title="label"
    @click="toggle"
  >
    <span
      class="grid place-items-center size-[1.125rem] shrink-0 transition-transform duration-500 ease-out motion-reduce:transition-none"
      :class="isDark ? 'group-hover:-rotate-12' : 'group-hover:rotate-45'"
      aria-hidden="true"
    >
      <span
        class="col-start-1 row-start-1 i-hugeicons-sun-03 size-[1.125rem] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
        :class="isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'"
      />
      <span
        class="col-start-1 row-start-1 i-hugeicons-moon-02 size-[1.125rem] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
        :class="isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'"
      />
    </span>
  </BaseIconDisk>
</template>
