<script setup lang="ts">
import { CONTACT_EMAIL, LINKEDIN_URL, X_URL } from '~/constants/social'

const { t } = useI18n()
const { copied: emailCopied, copy } = useClipboardCopy()

const hoveredDoor = ref<string | null>(null)

const doorIds = ['linkedin', 'email', 'x'] as const
type DoorId = (typeof doorIds)[number]

function isDoorOpen(id: DoorId) {
  return hoveredDoor.value === id || (id === 'email' && emailCopied.value)
}

function getDoorHref(id: DoorId) {
  if (id === 'linkedin') return LINKEDIN_URL
  if (id === 'x') return X_URL
  return undefined
}

function handleClick(id: DoorId) {
  if (id === 'email') copy(CONTACT_EMAIL)
}
</script>

<template>
  <SectionBase id="contact" variant="main">
    <div class="flex flex-col items-center">
      <!-- Brand block card -->
      <div class="contact-hero-card">
        <DoorOrnamentsSvg />
        <h2 class="contact-hero-title" v-text="t('contact.doorTitle')" />
      </div>

      <!-- Doors row -->
      <div class="flex items-center justify-between w-full px-8 md:px-10">
        <component
          :is="id === 'email' ? 'button' : 'a'"
          v-for="id in doorIds"
          :key="id"
          :href="getDoorHref(id)"
          :target="id !== 'email' ? '_blank' : undefined"
          :rel="id !== 'email' ? 'noopener noreferrer' : undefined"
          :type="id === 'email' ? 'button' : undefined"
          :aria-label="
            id === 'email'
              ? `${t('actions.copy')} ${t('contact.emailLabel')}`
              : undefined
          "
          class="flex flex-col items-center gap-2 w-[94px] md:w-[160px] no-underline cursor-pointer bg-transparent border-0 outline-none appearance-none p-0"
          @mouseenter="hoveredDoor = id"
          @mouseleave="hoveredDoor = null"
          @click="handleClick(id)"
        >
          <!-- Door: icon sits inside (behind swinging closed panel + open artwork when hovered) -->
          <div class="contact-door-frame">
            <BaseContactDoor :open="isDoorOpen(id)">
              <span
                v-if="id === 'linkedin'"
                class="i-hugeicons-link-square-01 size-6 md:size-8 contact-door-icon"
                aria-hidden="true"
              />
              <span
                v-else-if="id === 'x'"
                class="i-hugeicons-link-square-01 size-6 md:size-8 contact-door-icon"
                aria-hidden="true"
              />
              <span
                v-else
                :class="emailCopied ? 'i-hugeicons-tick-02' : 'i-hugeicons-copy-01'"
                class="size-6 md:size-8 contact-door-icon"
                aria-hidden="true"
              />
            </BaseContactDoor>
          </div>

          <!-- Label -->
          <div class="flex flex-wrap items-center justify-center gap-1">
            <template v-if="id === 'email'">
              <template v-if="emailCopied">
                <span class="contact-door-label" v-text="t('actions.copied')" />
              </template>
              <template v-else>
                <span
                  class="i-hugeicons-copy-01 size-4 contact-door-label-icon md:hidden"
                  aria-hidden="true"
                />

                <span class="contact-door-label" v-text="t('contact.emailLabel')" />
              </template>
            </template>
            <span
              v-else
              class="contact-door-label"
              v-text="id === 'linkedin' ? 'LinkedIn' : 'X'"
            />
          </div>
        </component>
      </div>
    </div>
  </SectionBase>
</template>
