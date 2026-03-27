<script setup lang="ts">
type Interaction = 'static' | 'group' | 'button'

const props = withDefaults(
  defineProps<{
    as?: 'button' | 'div'
    size?: 'sm' | 'md' | 'lg'
    interaction?: Interaction
  }>(),
  { as: 'div', size: 'sm', interaction: 'static' },
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
