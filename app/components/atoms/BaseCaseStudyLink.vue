<script setup lang="ts">
withDefaults(
  defineProps<{
    to: string
    /** Accessible name when the visible label is absent or insufficient */
    label: string
    /** Visible text to the right of the icon (optional) */
    caption?: string
    /** Off-site URL: plain anchor (avoids NuxtLink SSR/client hydration quirks) */
    external?: boolean
  }>(),
  { external: false, caption: undefined },
)

const linkClass =
  'group inline-flex max-w-full items-center gap-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2'

const iconPillClass =
  'inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-current border-dashed bg-transparent px-2.5 py-1 font-body text-sm text-link outline-none transition-opacity group-hover:opacity-85 md:px-2.5 md:py-1 md:text-sm'
</script>

<template>
  <a
    v-if="external"
    :href="to"
    :aria-label="label"
    target="_blank"
    rel="noopener noreferrer"
    :class="[linkClass, caption ? 'w-full justify-start' : 'mx-auto justify-center']"
  >
    <span
      v-if="caption"
      class="min-w-0 text-left font-body text-sm leading-6 text-default transition-colors group-hover:text-brand md:text-base md:leading-7"
      v-text="caption"
    />
    <span :class="iconPillClass">
      <BaseArrowOutIcon class="size-3.5 shrink-0 text-current" />
    </span>
  </a>
  <NuxtLink
    v-else
    :to="to"
    :aria-label="label"
    :class="[linkClass, caption ? 'w-full justify-start' : 'mx-auto justify-center']"
  >
    <span :class="iconPillClass">
      <BaseArrowOutIcon class="size-3.5 shrink-0 text-current" />
    </span>
    <span
      v-if="caption"
      class="min-w-0 text-left font-body text-sm leading-6 text-default transition-colors group-hover:text-brand md:text-base md:leading-7"
      v-text="caption"
    />
  </NuxtLink>
</template>
