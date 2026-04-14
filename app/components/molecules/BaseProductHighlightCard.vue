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
    logoImage: '/media/cases/covers/euvetia-Logo.png',
    logoAlt: 'Logo',
  },
)
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex min-w-0 w-full max-w-full flex-col gap-4 overflow-hidden rounded-[32px] border border-surface-subtle bg-background-default p-6 transition-colors duration-300 motion-reduce:transition-none hover:bg-surface-subtle"
  >
    <div class="relative isolate w-full aspect-[8/5]">
      <div
        class="absolute left-[2%] top-[3%] z-0 w-[58%] -rotate-2 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] [backface-visibility:hidden] transform-gpu motion-reduce:transition-none sm:w-[60%] md:w-[65%] md:group-hover:translate-x-[2%] group-hover:-rotate-[0.65deg] group-hover:translate-x-[1%]"
      >
        <div class="overflow-hidden rounded-[16px] border-6 md:border-8 border-white bg-red-500 shadow-[3px_4px_20px_rgba(0,0,0,0.25)]">
          <div class="relative bg-red-500 aspect-[4/3]">
            <NuxtImg
              :src="coverImage"
              :alt="coverAlt"
              class="absolute inset-0 size-full object-cover"
              sizes="xs:65vw md:45vw"
              loading="eager"
            />
          </div>
        </div>
      </div>
      <div
        class="absolute right-[2%] bottom-[3%] z-[1] w-[38%] rotate-[5deg] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] [backface-visibility:hidden] transform-gpu motion-reduce:transition-none sm:w-[40%] sm:rotate-[6deg] md:w-[40%] md:group-hover:-translate-x-[2%] group-hover:-translate-x-[1%] group-hover:rotate-[2.25deg]"
      >
        <div
          class="overflow-hidden rounded-[16px] border-6 md:border-8 border-white bg-white shadow-lg"
        >
          <div class="flex aspect-[1/0.93] items-center justify-center bg-white p-[6%]">
            <NuxtImg
              :src="logoImage"
              :alt="logoAlt"
              class="block h-auto w-full max-h-full object-contain"
              sizes="xs:40vw md:28vw"
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
