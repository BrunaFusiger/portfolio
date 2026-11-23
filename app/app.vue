<template>
  <div class="bg-surface-background transition-colors duration-200 overflow-x-clip">
    <div
      id="site-content"
      class="transition-opacity duration-700 ease-out motion-reduce:transition-none [.origami-intro_&]:opacity-0"
    >
      <NuxtLayout>
        <NuxtRouteAnnouncer />
        <NuxtPage />
      </NuxtLayout>
    </div>
    <RouteLoadingDots />
  </div>
</template>
