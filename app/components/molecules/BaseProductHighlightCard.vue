<script setup lang="ts">
withDefaults(
  defineProps<{
    to: string
    title: string
    description: string
    tags: string
    coverImage: string
    coverAlt: string
    logoImage?: string
    logoAlt?: string
  }>(),
  {
    logoImage: '/images/cases/covers/euvetia-Logo.png',
    logoAlt: 'Logo',
  },
)
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex-1 flex flex-col gap-4 overflow-hidden rounded-[32px] border border-surface-subtle bg-background-default p-6 transition-colors duration-300 motion-reduce:transition-none hover:bg-surface-subtle"
  >
    <!-- Polaroid media area -->
    <div class="relative min-h-[220px] md:min-h-[260px]">
      <div
        class="absolute left-2 top-2 z-0 w-[62%] -rotate-2 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] [backface-visibility:hidden] transform-gpu motion-reduce:transition-none md:left-4 md:w-[65%] md:group-hover:translate-x-2.5 group-hover:-rotate-[0.65deg] group-hover:translate-x-1.5"
      >
        <div class="overflow-hidden rounded-[16px] border-6 md:border-8 border-white bg-red-500 shadow-[3px_4px_20px_rgba(0,0,0,0.25)]">
          <div class="relative bg-red-500 aspect-[4/3]">
            <NuxtImg
              :src="coverImage"
              :alt="coverAlt"
              class="absolute inset-0 size-full object-cover"
              sizes="(max-width: 768px) 65vw, 420px"
              loading="eager"
            />
          </div>
        </div>
      </div>
      <div
        class="absolute right-2 bottom-0 z-[1] w-[40%] rotate-[6deg] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] [backface-visibility:hidden] transform-gpu motion-reduce:transition-none md:right-0 md:w-[40%] md:group-hover:-translate-x-2.5 group-hover:-translate-x-1.5 group-hover:rotate-[2.25deg]"
      >
        <div
          class="overflow-hidden rounded-[16px] border-6 md:border-8 border-white bg-white shadow-[3px_4px_20px_rgba(0,0,0,0.25)]"
        >
          <div class="flex aspect-[1/0.93] items-center justify-center bg-white p-4">
            <NuxtImg
              :src="logoImage"
              :alt="logoAlt"
              class="block h-auto w-full max-h-full object-contain"
              sizes="(max-width: 768px) 40vw, 200px"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Copy block -->
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-4">
        <h3
          class="font-heading font-semibold text-default text-xl leading-7 md:text-2xl md:leading-8"
          v-text="title"
        />
        <p
          class="font-body text-base leading-6 text-muted"
          v-text="description"
        />
      </div>
      <p
        class="font-body text-xs leading-5 text-muted"
        v-text="tags"
      />
    </div>
  </NuxtLink>
</template>
