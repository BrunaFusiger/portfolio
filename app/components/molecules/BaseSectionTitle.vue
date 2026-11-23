<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    titleId?: string
    as?: 'h1' | 'h2'
    size?: 'default' | 'large'
    link?: { to: string; label: string; ariaLabel?: string; external?: boolean }
  }>(),
  { as: 'h2', size: 'default' },
)
</script>

<template>
  <div class="min-w-0 w-full">
    <div class="flex items-baseline gap-x-4">
      <component
        :is="as"
        v-if="size === 'large'"
        :id="titleId"
        class="wind-lift-root min-w-0 flex-1 max-w-[736px] font-heading font-extrabold text-default text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] xl:text-[56px] xl:leading-[72px]"
      >
        <BaseWindLiftText :text="title" split-by="char" />
      </component>
      <component
        :is="as"
        v-else
        :id="titleId"
        class="min-w-0 flex-1 font-heading font-semibold text-default [overflow-wrap:anywhere]"
        :class="as === 'h1' ? 'text-[28px] leading-8 md:text-[32px] md:leading-10' : 'text-lg leading-6 md:text-xl md:leading-7'"
      >
        {{ title }}
      </component>
      <NuxtLink
        v-if="link"
        :to="link.to"
        :external="link.external"
        :target="link.external ? '_blank' : undefined"
        :aria-label="link.ariaLabel"
        class="inline-flex min-h-6 max-w-[45%] shrink-0 items-center gap-1.5 rounded-sm text-right font-heading text-sm text-muted no-underline hover:text-default hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-text-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-background)]"
      >
        <span class="min-w-0 [overflow-wrap:anywhere]">{{ link.label }}</span>
        <svg
          class="size-3.5 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="miter"
          aria-hidden="true"
        >
          <path d="M4 12 12 4M5 4h7v7" />
        </svg>
      </NuxtLink>
    </div>
    <p
      v-if="$slots.description"
      class="mt-6 max-w-[736px] font-body text-muted text-base leading-6 md:text-xl md:leading-7 xl:text-2xl xl:leading-7"
    >
      <slot name="description" />
    </p>
  </div>
</template>
