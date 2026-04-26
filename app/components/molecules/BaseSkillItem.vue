<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  title: string
  description: string
  dialogDescription: string
  image: string
  imageAlt: string
  to: string
  linkLabel: string
}>()

const isOpen = ref(false)
const showDialog = ref(false)
const iconTriggerRef = ref<ComponentPublicInstance | null>(null)

function iconDiskEl(): HTMLElement | null {
  const v = iconTriggerRef.value
  if (!v) return null
  const el = v.$el
  return el instanceof HTMLElement ? el : null
}
const dialogPlacement = ref<Record<string, string>>({})

let closeTimer: ReturnType<typeof setTimeout> | null = null
let layoutListenersBound = false

const DIALOG_W = 444
const DIALOG_H = 377
const VIEW_MARGIN = 16
const ICON_GAP = 20
const ICON_CLEARANCE = 12

function clearCloseTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function scheduleClose() {
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    showDialog.value = false
  }, 100)
}

function inflateRect(r: DOMRect, pad: number) {
  return {
    top: r.top - pad,
    left: r.left - pad,
    right: r.right + pad,
    bottom: r.bottom + pad,
  }
}

function rectsOverlap(
  a: { top: number; left: number; right: number; bottom: number },
  b: { top: number; left: number; right: number; bottom: number },
) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom)
}

function layoutDialog() {
  if (!import.meta.client || !showDialog.value) return

  const el = iconDiskEl()
  if (!el) return

  const r = el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w = Math.min(DIALOG_W, vw - VIEW_MARGIN * 2)
  const h = Math.min(DIALOG_H, vh - VIEW_MARGIN * 2)

  let left = (vw - w) / 2
  left = Math.max(VIEW_MARGIN, Math.min(left, vw - w - VIEW_MARGIN))

  let top = r.bottom + ICON_GAP
  if (top + h > vh - VIEW_MARGIN) {
    top = r.top - h - ICON_GAP
  }
  if (top < VIEW_MARGIN) {
    top = VIEW_MARGIN
  }

  const iconBox = inflateRect(r, ICON_CLEARANCE)
  const dialogBox = (t: number, l: number) => ({
    top: t,
    left: l,
    right: l + w,
    bottom: t + h,
  })

  let box = dialogBox(top, left)
  if (rectsOverlap(box, iconBox)) {
    top = r.bottom + ICON_GAP
    if (top + h <= vh - VIEW_MARGIN) {
      box = dialogBox(top, left)
    } else {
      top = r.top - h - ICON_GAP
      if (top >= VIEW_MARGIN) {
        box = dialogBox(top, left)
      }
    }
  }

  if (rectsOverlap(box, iconBox)) {
    const fitsRight = r.right + ICON_GAP + w <= vw - VIEW_MARGIN
    if (fitsRight) {
      left = r.right + ICON_GAP
      top = Math.max(VIEW_MARGIN, Math.min(r.top - (h - r.height) / 2, vh - h - VIEW_MARGIN))
      box = dialogBox(top, left)
    }
  }

  if (rectsOverlap(box, iconBox)) {
    const fitsLeft = r.left - ICON_GAP - w >= VIEW_MARGIN
    if (fitsLeft) {
      left = r.left - ICON_GAP - w
      top = Math.max(VIEW_MARGIN, Math.min(r.top - (h - r.height) / 2, vh - h - VIEW_MARGIN))
      box = dialogBox(top, left)
    }
  }

  if (rectsOverlap(box, iconBox)) {
    top = Math.max(VIEW_MARGIN, (vh - h) / 2)
    left = Math.max(VIEW_MARGIN, (vw - w) / 2)
    box = dialogBox(top, left)
    if (rectsOverlap(box, iconBox)) {
      if (r.left + r.width / 2 < vw / 2) {
        left = Math.min(vw - w - VIEW_MARGIN, r.right + ICON_GAP)
      } else {
        left = VIEW_MARGIN
      }
      top = Math.max(VIEW_MARGIN, Math.min(top, vh - h - VIEW_MARGIN))
    }
  }

  dialogPlacement.value = {
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
    width: `${Math.round(w)}px`,
  }
}

function onIconEnter() {
  clearCloseTimer()
  showDialog.value = true
}

function onIconLeave() {
  scheduleClose()
}

function onDialogEnter() {
  clearCloseTimer()
}

function onDialogLeave() {
  scheduleClose()
}

function toggle() {
  isOpen.value = !isOpen.value
}

function bindLayoutListeners() {
  if (!import.meta.client || layoutListenersBound) return
  layoutListenersBound = true
  window.addEventListener('resize', layoutDialog)
  window.addEventListener('scroll', layoutDialog, true)
}

function unbindLayoutListeners() {
  if (!import.meta.client || !layoutListenersBound) return
  layoutListenersBound = false
  window.removeEventListener('resize', layoutDialog)
  window.removeEventListener('scroll', layoutDialog, true)
}

watch(showDialog, (show) => {
  if (!import.meta.client) return
  if (show) {
    nextTick(() => {
      if (!showDialog.value) return
      layoutDialog()
      bindLayoutListeners()
    })
  } else {
    unbindLayoutListeners()
  }
})

onUnmounted(() => {
  clearCloseTimer()
  unbindLayoutListeners()
})
</script>

<template>
  <!-- Desktop: whole row links to case study; icon hover opens preview dialog -->
  <NuxtLink
    :to="to"
    class="relative hidden cursor-pointer flex flex-col items-start justify-center gap-4 rounded-lg no-underline outline-none md:flex focus-visible:ring-2 focus-visible:ring-surface-brand focus-visible:ring-offset-2"
  >
    <div class="flex w-full flex-col items-start gap-2">
      <div class="flex w-full items-center gap-2">
        <div
          class="group/icon pulsing-icon flex size-9 shrink-0 items-center justify-center"
          @mouseenter="onIconEnter"
          @mouseleave="onIconLeave"
        >
          <BaseIconDisk ref="iconTriggerRef" interaction="group">
            <slot name="icon" />
          </BaseIconDisk>
        </div>
        <p class="flex-1 font-heading text-base font-semibold leading-6 text-default" v-text="title" />
      </div>
      <p class="w-full font-body text-base leading-6 text-muted" v-text="description" />
    </div>

    <Teleport to="body">
      <Transition name="skill-dialog">
        <div
          v-if="showDialog"
          class="pointer-events-none fixed inset-0 z-[100]"
        >
          <div
            class="pointer-events-auto fixed z-[101]"
            :style="dialogPlacement"
          >
            <LazyBaseSkillDialog
              :image="image"
              :image-alt="imageAlt"
              :to="to"
              :link-label="linkLabel"
              class="!relative !w-full max-w-none"
              @dialog-enter="onDialogEnter"
              @dialog-leave="onDialogLeave"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </NuxtLink>

  <!-- Mobile: Accordion item -->
  <button
    type="button"
    class="group/skill skill-accordion-dash-bottom relative flex w-full cursor-pointer items-start border-0 bg-surface-background px-0 py-8 text-left md:hidden"
    @click="toggle"
  >
    <div
      class="flex min-h-0 min-w-0 flex-1 flex-col items-start gap-0 transition-all duration-300"
      :class="isOpen ? 'gap-8' : 'gap-0'"
    >
      <div class="flex w-full items-center gap-2">
        <BaseIconDisk interaction="static">
          <slot name="icon" />
        </BaseIconDisk>
        <p
          class="min-h-0 min-w-0 flex-1 text-left font-heading text-base font-semibold leading-6 text-default"
          v-text="title"
        />
      </div>

      <Transition name="accordion">
        <div v-if="isOpen" class="flex w-full flex-col gap-8 overflow-hidden">
          <div class="relative h-70 w-full overflow-hidden rounded-3xl">
            <NuxtImg
              :src="image"
              :alt="imageAlt"
              v-bind="nuxtImgRasterDefaults"
              class="absolute inset-0 size-full object-contain"
              sizes="100vw md:896px"
              loading="lazy"
            />
          </div>

          <p class="w-full text-left font-body text-sm leading-5 text-muted" v-text="dialogDescription" />

          <BaseCaseStudyLink
            :to="to"
            :label="linkLabel"
            :caption="t('skills.checkOutCaseStudy')"
            @click.stop
          />
        </div>
      </Transition>
    </div>

    <!-- Toggle icon: + when closed (rotated x), x when open -->
    <div class="mt-1 flex size-4 shrink-0 items-center justify-center">
      <svg
        class="size-3 text-subtle transition-transform duration-300"
        :class="isOpen ? 'rotate-0' : 'rotate-45'"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      >
        <line x1="1" y1="1" x2="11" y2="11" />
        <line x1="11" y1="1" x2="1" y2="11" />
      </svg>
    </div>
  </button>
</template>

<style scoped>
/* 8px dash + 8px gap (horizontal rule); replaces border-dashed */
.skill-accordion-dash-bottom::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: repeating-linear-gradient(
    to right,
    var(--color-surface-subtle) 0 8px,
    transparent 8px 16px
  );
}
</style>
