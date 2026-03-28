<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)
</script>

<template>
  <main class="min-h-screen flex items-center justify-center p-8">
    <h1 class="font-heading font-black text-[48px] text-default" v-text="slug" />
  </main>
</template>
