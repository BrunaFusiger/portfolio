<script setup lang="ts">
useHead({
  title: 'Get in touch with Bruna Fusiger',
  titleTemplate: '%s',
  meta: [
    {
      name: 'description',
      content: 'UX/UI Designer based in Zurich, Switzerland. Open to opportunities. Permit B, authorized to work.',
    },
  ],
})

definePageMeta({
  hideFooter: true,
  paperBackground: true,
})
</script>

<template>
  <main class="section-outer section-space min-h-[50vh]">
    <section class="relative isolate min-h-[calc(100vh-var(--site-header-h,5.5rem))]">
      <div class="section-grid relative z-10">
        <div class="col-main flex w-full min-w-0 flex-col gap-10 md:gap-16">
          <BaseSectionTitle title="Let's talk." size="large">
            <template #description>Whether it's a job opportunity, a project, or just a good conversation about design and code. I'm here.</template>
          </BaseSectionTitle>

          <div class="flex flex-wrap gap-2">
            <BasePillTag>
              <template #icon>
                <span class="i-hugeicons-location-01 size-4" />
              </template>
              Based in Zurich, Switzerland
            </BasePillTag>
            <BasePillTag>
              <template #icon>
                <span class="i-hugeicons-passport size-4" />
              </template>
              Permit B · Authorized to work
            </BasePillTag>
            <BasePillTag>
              <template #icon>
                <span class="i-hugeicons-briefcase-01 size-4" />
              </template>
              Available for work
            </BasePillTag>
          </div>

          <BaseRulesRulerFrame>
            <BaseContactOutreach />
          </BaseRulesRulerFrame>
        </div>
      </div>
    </section>
  </main>
</template>
