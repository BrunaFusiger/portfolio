<script setup lang="ts">
defineProps<{
  to: string
  title: string
  coverImage: string
  coverAlt: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex flex-col gap-4 items-start w-full no-underline"
  >
    <div
      class="relative w-full aspect-[7/8] overflow-hidden rounded-2xl border-[6px] md:border-8 border-white bg-neutral-200 shadow-[3px_4px_20px_0px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 dark:border-neutral-200 dark:bg-neutral-700 dark:shadow-[3px_4px_20px_0px_rgba(0,0,0,0.5)]"
    >
      <NuxtImg
        :src="coverImage"
        :alt="coverAlt"
        class="absolute inset-0 size-full object-cover transform-gpu [backface-visibility:hidden] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:scale-[1.045] motion-reduce:group-hover:scale-100"
        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 352px"
        loading="lazy"
        format="webp"
        decoding="async"
      />
    </div>

    <h3
      class="wind-lift-root font-heading font-semibold text-default w-full text-lg leading-6 md:text-xl md:leading-7"
    >
      <BaseWindLiftText :text="title" split-by="char" />
    </h3>
  </NuxtLink>
</template>
