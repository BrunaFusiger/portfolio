<script setup lang="ts"></script>

<template>
  <span class="inline-block select-none pointer-events-none" aria-hidden="true">
    <NuxtImg
      src="/media/utils/red-pin.png"
      alt=""
      v-bind="nuxtImgRasterDefaults"
      width="34"
      height="39"
      sizes="34px"
      densities="x1 x2"
      loading="lazy"
    />
  </span>
</template>
