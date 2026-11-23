<script setup lang="ts">
import { NuxtLink } from '#components'

defineOptions({ inheritAttrs: false })

type ButtonVariant = 'solid-dark' | 'solid-red' | 'dotted' | 'text-link'

withDefaults(
  defineProps<{
    variant?: ButtonVariant
    full?: boolean
    /** When set, renders as `<NuxtLink>` so Nuxt prefetches the route in the viewport. */
    to?: string
  }>(),
  { variant: 'solid-dark', full: false, to: undefined },
)

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <div
    class="relative select-none"
    :class="full ? 'flex w-full' : 'inline-flex'"
  >
    <component
      :is="to ? NuxtLink : 'button'"
      v-bind="$attrs"
      :to="to || undefined"
      :type="to ? undefined : 'button'"
      class="relative inline-flex cursor-pointer items-center outline-none appearance-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-background)]"
      :class="[
        to && 'no-underline',
        variant === 'text-link'
          ? 'border-0 bg-transparent p-0 font-body text-base font-medium text-brand transition-opacity motion-reduce:transition-none hover:opacity-85 focus-visible:opacity-100'
          : 'h-9 whitespace-nowrap rounded-lg px-3 py-0 font-heading text-sm font-medium tracking-normal xl:px-4',
        full && 'w-full justify-center',
        variant === 'solid-dark' &&
          'overflow-hidden border-0 bg-surface-inverse text-inverse',
        variant === 'solid-red' &&
          'overflow-hidden border-0 bg-surface-brand text-white',
        variant === 'dotted' &&
          'border border-dashed border-[var(--color-text-brand)] bg-transparent text-brand transition-colors hover:bg-white/30',
      ]"
      @click="emit('click', $event)"
    >
      <slot />
    </component>
  </div>
</template>
