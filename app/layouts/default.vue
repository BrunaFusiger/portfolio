<script setup lang="ts"></script>

<template>
  <div class="site-shell">
    <BaseHeader />
    <main class="site-main [padding-top:var(--site-header-h,5.5rem)]">
      <slot />
    </main>
    <BaseFooter />
  </div>
</template>
