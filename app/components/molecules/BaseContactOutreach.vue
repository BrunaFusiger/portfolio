<script setup lang="ts">
import { CONTACT_EMAIL, LINKEDIN_URL } from '~/constants/social'

const { t } = useI18n()
const { copied, copy } = useClipboardCopy()

async function onCopy() {
  await copy(CONTACT_EMAIL)
}
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-4">
    <div class="flex w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-2">
      <span class="font-body text-sm text-default leading-6 break-all md:text-base md:leading-7">
        {{ CONTACT_EMAIL }}
      </span>
      <button
        type="button"
        class="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-current border-dashed bg-transparent px-2.5 py-1 font-body text-sm text-link outline-none transition-opacity hover:opacity-85 appearance-none md:px-2.5 md:py-1 md:text-sm"
        :aria-label="t('contact.copyEmailAria')"
        @click="onCopy"
      >
        <template v-if="copied">
          <span class="i-hugeicons-tick-02 size-3.5 shrink-0" aria-hidden="true" />
          <span>{{ t('actions.copied') }}</span>
        </template>
        <template v-else>
          <span class="i-hugeicons-copy-01 size-3.5 shrink-0" aria-hidden="true" />
          <span>{{ t('actions.copy') }}</span>
        </template>
      </button>
    </div>

    <BaseCaseStudyLink
      :to="LINKEDIN_URL"
      :label="t('contact.linkedinAria')"
      :caption="t('contact.linkedin')"
      external
    />
  </div>
</template>
