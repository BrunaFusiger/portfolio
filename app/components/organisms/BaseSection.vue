<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'main' | 'wide' | 'full'
    space?: boolean
  }>(),
  {
    variant: 'main',
    space: true,
  },
)
</script>

<template>
  <section
    :class="[variant === 'full' ? 'full-bleed' : 'section-outer', space ? 'section-space' : '']"
  >
    <template v-if="variant === 'full'">
      <slot />
    </template>

    <div v-else class="section-grid">
      <div :class="variant === 'wide' ? 'col-wide' : 'col-main'">
        <slot />
      </div>
    </div>
  </section>
</template>
