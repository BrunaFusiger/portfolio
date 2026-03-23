<script setup lang="ts">
const { gsap, ScrollTrigger } = useGsap()

const collapseWrapper = ref<HTMLSpanElement | null>(null)
const collapseInner = ref<HTMLSpanElement | null>(null)
const dotRef = ref<HTMLSpanElement | null>(null)

let collapseTl: gsap.core.Timeline | null = null
let st: ScrollTrigger | null = null
let bounceTimer: ReturnType<typeof setTimeout> | null = null

// ── Dot bounce ────────────────────────────────────────────────────────────────

function playDotBounce() {
  if (!dotRef.value) return
  const h = 8 + Math.random() * 7 // 8–15 px jump height, varies each time

  gsap
    .timeline()
    // Launch up: stretch vertically (ball squash-and-stretch)
    .to(dotRef.value, {
      y: -h,
      scaleX: 0.8,
      scaleY: 1.25,
      duration: 0.17,
      ease: 'power2.out',
    })
    // Land: GSAP bounce.out handles the diminishing bounces naturally
    .to(dotRef.value, {
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 0.58,
      ease: 'bounce.out',
    })
}

function scheduleBounce() {
  bounceTimer = setTimeout(
    () => {
      playDotBounce()
      scheduleBounce()
    },
    3000 + Math.random() * 2000,
  ) // 3–5 s
}

// ── Scroll collapse ───────────────────────────────────────────────────────────

onMounted(() => {
  if (!collapseWrapper.value || !collapseInner.value) return

  // Pin the wrapper's natural width so we can animate it to 0
  const naturalWidth = collapseInner.value.offsetWidth
  gsap.set(collapseWrapper.value, { width: naturalWidth, overflow: 'hidden' })

  const chars = Array.from(collapseInner.value.children) as HTMLElement[]

  collapseTl = gsap
    .timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
    // Chars slide left (behind "F") and fade out, staggered from right→left
    .to(
      chars,
      {
        x: -naturalWidth,
        opacity: 0,
        duration: 0.4,
        stagger: { each: 0.028, from: 'end' },
      },
      0,
    )
    // Wrapper collapses so the "." naturally pulls in flush with "F"
    .to(
      collapseWrapper.value,
      {
        width: 0,
        duration: 0.42,
      },
      0,
    )

  // ScrollTrigger fires at 1 px scroll — snaps collapsed on enter, expands on return
  st = ScrollTrigger.create({
    start: 1,
    onEnter: () => collapseTl?.play(),
    onLeaveBack: () => collapseTl?.reverse(),
  })

  scheduleBounce()
})

onBeforeUnmount(() => {
  st?.kill()
  collapseTl?.kill()
  if (bounceTimer) clearTimeout(bounceTimer)
})
</script>

<template>
  <span
    class="font-heading font-black text-default text-subsection-title inline-flex items-baseline select-none leading-none tracking-[-0.03em]"
    aria-label="BFusiger."
    role="img"
  >
    <span class="inline-block">B</span>
    <span class="inline-block">F</span>

    <span ref="collapseWrapper" class="pb-[0.12rem] mb-[-0.12em] inline-block">
      <span ref="collapseInner" class="inline-flex whitespace-nowrap">
        <span class="inline-block">u</span>
        <span class="inline-block">s</span>
        <span class="inline-block">i</span>
        <span class="inline-block">g</span>
        <span class="inline-block">e</span>
        <span class="inline-block">r</span>
      </span>
    </span>

    <span ref="dotRef" class="inline-block pb-[0.08em] origin-bottom">.</span>
  </span>
</template>
