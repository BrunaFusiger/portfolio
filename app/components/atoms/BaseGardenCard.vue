<script setup lang="ts">
withDefaults(
  defineProps<{
    to: string
    title: string
    coverImage: string
    coverAlt: string
    /** Short labels, usually ~3, shown in one line with dot separators. */
    tags?: string[]
  }>(),
  { tags: () => [] },
)
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

    <div class="flex flex-col gap-1.5 w-full min-w-0">
      <h3
        class="wind-lift-root font-heading font-semibold text-default w-full text-lg leading-6 md:text-xl md:leading-7"
      >
        <BaseWindLiftText :text="title" split-by="char" />
      </h3>
      <p
        v-if="tags.length"
        class="font-body text-sm leading-snug text-muted w-full"
      >
        <template v-for="(tag, i) in tags" :key="`tag-${i}`">
          <span v-if="i > 0" aria-hidden="true" class="px-0.5">·</span>
          <span>{{ tag }}</span>
        </template>
      </p>
    </div>
  </NuxtLink>
</template>
