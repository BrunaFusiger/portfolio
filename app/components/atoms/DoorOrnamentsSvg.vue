<script setup lang="ts"></script>

<template>
  <div class="relative w-[216px] shrink-0">
    <NuxtImg
      src="/media/illustrations/doors-light.png"
      alt=""
      aria-hidden="true"
      v-bind="nuxtImgRasterDefaults"
      :width="216"
      sizes="216px"
      densities="x1 x2"
      loading="lazy"
      class="w-full"
    />
  </div>
</template>
