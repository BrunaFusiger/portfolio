<script setup lang="ts">
type Interaction = 'static' | 'group' | 'button'

const props = withDefaults(
  defineProps<{
    as?: 'button' | 'div'
    size?: 'sm' | 'md' | 'lg'
    interaction?: Interaction
    /** fab: light card; inverse: solid surface-inverse (e.g. settings FAB) */
    variant?: 'default' | 'fab' | 'inverse'
  }>(),
  { as: 'div', size: 'sm', interaction: 'static', variant: 'default' },
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'md':
      return 'size-9'
    case 'lg':
      return 'size-10'
    default:
      return 'size-8'
  }
})

const diskClass = computed(() => {
  if (props.variant === 'inverse') {
    const inv = [
      'flex shrink-0 items-center justify-center rounded-full',
      sizeClass.value,
      'bg-surface-inverse text-inverse border-0 shadow-none',
      'transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none',
    ]
    if (props.interaction === 'button') {
      return [
        ...inv,
        'cursor-pointer outline-none appearance-none',
        'hover:opacity-90 active:scale-[0.96] motion-reduce:active:scale-100',
        'focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background',
      ]
    }
    return inv
  }

  if (props.variant === 'fab') {
    const fab = [
      'flex shrink-0 items-center justify-center rounded-full',
      sizeClass.value,
      'bg-surface-background text-subtle',
      'border border-solid border-neutral-200/90 dark:border-neutral-600/55',
      'shadow-[0_2px_16px_-8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.04)]',
      'dark:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.55),0_1px_2px_rgba(0,0,0,0.35)]',
      'transition-[box-shadow,transform,color] duration-200 ease-out motion-reduce:transition-none',
      'hover:text-default',
      'hover:shadow-[0_4px_22px_-8px_rgba(0,0,0,0.14),0_2px_4px_rgba(0,0,0,0.05)]',
      'dark:hover:shadow-[0_6px_26px_-10px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4)]',
    ]
    if (props.interaction === 'button') {
      return [
        ...fab,
        'cursor-pointer outline-none appearance-none',
        'active:scale-[0.98] motion-reduce:active:scale-100',
        'focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background',
      ]
    }
    return fab
  }

  const base =
    'flex shrink-0 items-center justify-center rounded-full bg-surface-subtle text-subtle'

  switch (props.interaction) {
    case 'group':
      return [
        base,
        sizeClass.value,
        'transition-[background-color,box-shadow,color] duration-200',
        'group-hover/icon:bg-surface-background group-hover/icon:text-default',
        'group-hover/icon:shadow-[0_2px_8px_rgba(0,0,0,0.07)]',
        'dark:group-hover/icon:bg-neutral-700 dark:group-hover/icon:shadow-[0_2px_12px_rgba(0,0,0,0.35)]',
      ]
    case 'button':
      return [
        base,
        sizeClass.value,
        'cursor-pointer border-0 outline-none appearance-none',
        'transition-[background-color,box-shadow,color,transform] duration-200 ease-out motion-reduce:transition-none',
        'hover:text-default hover:bg-surface-background hover:shadow-[0_2px_8px_rgba(0,0,0,0.07)]',
        'dark:hover:bg-neutral-700 dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.35)]',
        'hover:scale-105 active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100',
        'focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background',
      ]
    default:
      return [base, sizeClass.value]
  }
})
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :class="diskClass"
  >
    <slot />
  </component>
</template>

<style scoped>
:deep(svg) {
  color: inherit !important;
}
</style>
