<script setup lang="ts">
withDefaults(
  defineProps<{
    showDescription?: boolean
  }>(),
  { showDescription: true },
)
</script>

<template>
  <div class="flex flex-col gap-6 items-start w-full max-w-[736px]">
    <h2
      class="font-heading font-extrabold text-default w-full text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] xl:text-[56px] xl:leading-[72px]"
    >
      <slot name="title" />
    </h2>
    <p
      v-if="showDescription"
      class="font-body text-muted w-full text-base leading-6 md:text-xl md:leading-7 xl:text-2xl xl:leading-7"
    >
      <slot name="description" />
    </p>
  </div>
</template>
