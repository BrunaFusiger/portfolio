<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: 'Bruna Fusiger',
  titleTemplate: '%s',
  meta: [
    {
      name: 'description',
      content: () => t('seo.homeDescription'),
    },
  ],
})
</script>

<template>
  <div>
    <OrigamiIntro />
    <SectionHero />
    <LazySectionWork />
    <LazySectionSkills />
    <LazySectionAbout />
    <LazySectionContact />
    <LazySectionGarden />
  </div>
</template>

