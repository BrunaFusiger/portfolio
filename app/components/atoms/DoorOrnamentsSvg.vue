<template>
  <div class="relative w-[216px] shrink-0">
    <NuxtImg
      src="/images/illustrations/doors-light.png"
      alt=""
      aria-hidden="true"
      :width="216"
      class="w-full dark:hidden"
    />
    <NuxtImg
      src="/images/illustrations/doors-dark.png"
      alt=""
      aria-hidden="true"
      :width="216"
      class="w-full hidden dark:block"
    />
  </div>
</template>
