<template>
  <div
    class="relative w-full min-w-0 border-0 rounded-none bg-surface-default md:overflow-hidden md:rounded-4xl md:border md:border-2 md:border-surface-subtle"
  >
    <BaseRulesRulerDecoration side="left" />
    <BaseRulesRulerDecoration side="right" />
    <div class="relative z-1 flex w-full flex-col gap-8 py-10 px-4 md:gap-10 md:px-10 lg:px-12">
      <slot />
    </div>
  </div>
</template>
