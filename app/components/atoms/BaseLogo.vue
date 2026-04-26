<script setup lang="ts">
const { gsap, ScrollTrigger } = useGsap()

const clipId = `logo-clip-${useId()}`

const clipRectRef = ref<SVGRectElement | null>(null)
const dotRef = ref<SVGGElement | null>(null)
const letterU = ref<SVGGElement | null>(null)
const letterS = ref<SVGGElement | null>(null)
const letterI = ref<SVGGElement | null>(null)
const letterG = ref<SVGGElement | null>(null)
const letterE = ref<SVGGElement | null>(null)
const letterR = ref<SVGGElement | null>(null)

let collapseTl: gsap.core.Timeline | null = null
let st: ScrollTrigger | null = null
let bounceTimer: ReturnType<typeof setTimeout> | null = null

const COLLAPSE_WIDTH = 95.04
const DOT_SHIFT = -93.49

function playDotBounce() {
  if (!dotRef.value) return
  const h = 3 + Math.random() * 3

  gsap
    .timeline()
    .to(dotRef.value, {
      y: -h,
      scaleX: 0.8,
      scaleY: 1.25,
      duration: 0.17,
      ease: 'power2.out',
    })
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
  )
}

onMounted(() => {
  const letters = [
    letterU.value,
    letterS.value,
    letterI.value,
    letterG.value,
    letterE.value,
    letterR.value,
  ].filter(Boolean) as SVGGElement[]

  if (!clipRectRef.value || !letters.length || !dotRef.value) return

  gsap.set(dotRef.value, { transformOrigin: '50% 100%' })

  collapseTl = gsap
    .timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
    .to(
      letters,
      {
        x: -COLLAPSE_WIDTH,
        opacity: 0,
        duration: 0.4,
        stagger: { each: 0.028, from: 'end' },
      },
      0,
    )
    .to(
      clipRectRef.value,
      {
        attr: { width: 0 },
        duration: 0.42,
      },
      0,
    )
    .to(
      dotRef.value,
      {
        x: DOT_SHIFT,
        duration: 0.42,
      },
      0,
    )

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
  <svg
    viewBox="0 0 139 29.75"
    width="139"
    height="34"
    fill="currentColor"
    aria-label="BFusiger."
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    class="text-default block"
  >
    <!-- B -->
    <g transform="translate(0, 0.67)">
      <path
        d="M0 23.68V0H9.94C12.96 0 15.29 0.52 16.94 1.57C18.61 2.59 19.44 4.22 19.44 6.47C19.44 7.43 19.25 8.25 18.87 8.94C18.52 9.63 17.97 10.18 17.24 10.6C16.51 11 15.61 11.27 14.54 11.4V11.47C16.52 11.67 17.99 12.26 18.97 13.24C19.95 14.19 20.44 15.49 20.44 17.14C20.44 19.36 19.62 21.01 17.97 22.08C16.33 23.14 13.98 23.68 10.94 23.68H0ZM6.54 18.67H10.5C11.46 18.67 12.26 18.48 12.9 18.11C13.57 17.71 13.91 17.08 13.91 16.24C13.91 15.39 13.58 14.77 12.94 14.37C12.29 13.97 11.48 13.77 10.5 13.77H6.54V18.67ZM6.54 9.5H9.67C10.6 9.5 11.37 9.33 11.97 8.97C12.59 8.59 12.9 8.03 12.9 7.27C12.9 6.47 12.6 5.89 12 5.54C11.4 5.18 10.63 5 9.67 5H6.54V9.5Z"
      />
    </g>

    <!-- F -->
    <g transform="translate(21.67, 0.67)">
      <path d="M0 23.68V0H17.31V5.24H2.8L6.54 1.37V12.2L2.8 9.5H16.71V14.71H2.8L6.54 12V23.68H0Z" />
    </g>

    <!-- Collapsible group: usiger -->
    <g :clip-path="`url(#${clipId})`">
      <!-- u -->
      <g transform="translate(38.95, 6.34)">
        <g ref="letterU">
          <path
            d="M5.94 18.41C4.05 18.41 2.58 17.82 1.53 16.64C0.51 15.44 0 13.76 0 11.6V0H6.47V10.14C6.47 11.29 6.62 12.14 6.94 12.67C7.25 13.18 7.74 13.44 8.4 13.44C9.18 13.44 9.77 13.16 10.17 12.6C10.57 12.03 10.77 11.09 10.77 9.8V0H17.24V18.01H11.44L11.2 12.34L11.94 12.4C11.76 14.43 11.17 15.94 10.17 16.94C9.17 17.92 7.76 18.41 5.94 18.41Z"
          />
        </g>
      </g>

      <!-- s -->
      <g transform="translate(56.80, 5.94)">
        <g ref="letterS">
          <path
            d="M9.24 18.81C7.21 18.81 5.54 18.55 4.2 18.04C2.87 17.51 1.86 16.78 1.17 15.87C0.48 14.96 0.09 13.92 0 12.74L6.5 12.57C6.64 13.28 6.92 13.82 7.37 14.17C7.81 14.51 8.45 14.67 9.27 14.67C9.96 14.67 10.47 14.56 10.8 14.34C11.16 14.12 11.34 13.79 11.34 13.37C11.34 13.06 11.26 12.8 11.1 12.6C10.95 12.38 10.65 12.19 10.2 12.04C9.78 11.88 9.15 11.74 8.3 11.6C6.28 11.27 4.69 10.88 3.53 10.44C2.4 9.99 1.6 9.41 1.13 8.7C0.67 7.97 0.43 7.05 0.43 5.94C0.43 4.13 1.16 2.7 2.6 1.63C4.05 0.54 6.26 0 9.24 0C11.08 0 12.63 0.27 13.87 0.8C15.12 1.33 16.07 2.09 16.74 3.07C17.43 4.02 17.84 5.16 17.97 6.47L11.57 6.67C11.53 6.11 11.39 5.65 11.17 5.27C10.97 4.89 10.7 4.61 10.37 4.44C10.04 4.23 9.64 4.13 9.17 4.13C8.55 4.13 8.04 4.28 7.64 4.57C7.26 4.84 7.07 5.22 7.07 5.74C7.07 6.07 7.15 6.35 7.3 6.57C7.48 6.79 7.77 6.97 8.17 7.1C8.57 7.24 9.1 7.35 9.77 7.44C11.75 7.68 13.34 8.05 14.54 8.54C15.74 9.03 16.61 9.66 17.14 10.44C17.7 11.19 17.97 12.12 17.97 13.21C17.97 14.41 17.63 15.43 16.94 16.27C16.25 17.1 15.25 17.73 13.94 18.17C12.65 18.6 11.08 18.81 9.24 18.81Z"
          />
        </g>
      </g>

      <!-- i -->
      <g transform="translate(75.25, 0)">
        <g ref="letterI">
          <path d="M0.1 24.34V6.34H6.57V24.34H0.1ZM0 4.54V0H6.67V4.54H0Z" />
        </g>
      </g>

      <!-- g -->
      <g transform="translate(82.43, 5.94)">
        <g ref="letterG">
          <path
            d="M9.7 23.81C7.7 23.81 6.08 23.6 4.84 23.18C3.61 22.75 2.67 22.16 2 21.41C1.33 20.67 0.86 19.83 0.57 18.87L7.17 18.41C7.3 18.83 7.55 19.15 7.9 19.37C8.28 19.62 8.88 19.74 9.7 19.74C10.62 19.74 11.32 19.49 11.8 18.97C12.29 18.46 12.54 17.61 12.54 16.41V15.11C12.12 15.86 11.44 16.47 10.5 16.94C9.57 17.41 8.53 17.64 7.37 17.64C5.92 17.64 4.65 17.28 3.53 16.57C2.42 15.86 1.56 14.85 0.93 13.54C0.31 12.23 0 10.67 0 8.87C0 7.14 0.31 5.6 0.93 4.27C1.56 2.93 2.42 1.89 3.53 1.13C4.65 0.38 5.92 0 7.37 0C8.73 0 9.83 0.29 10.67 0.87C11.52 1.44 12.18 2.2 12.67 3.13V0.4H19.07V16.27C19.07 18.01 18.66 19.43 17.84 20.54C17.04 21.65 15.93 22.48 14.51 23.01C13.1 23.54 11.5 23.81 9.7 23.81ZM9.67 13.27C10.58 13.27 11.29 12.88 11.8 12.1C12.34 11.33 12.6 10.23 12.6 8.8C12.6 7.87 12.48 7.07 12.24 6.4C12.02 5.74 11.68 5.22 11.24 4.87C10.82 4.51 10.29 4.33 9.67 4.33C8.71 4.33 7.97 4.75 7.44 5.57C6.9 6.39 6.64 7.47 6.64 8.8C6.64 10.16 6.91 11.25 7.47 12.07C8.03 12.87 8.76 13.27 9.67 13.27Z"
          />
        </g>
      </g>

      <!-- e -->
      <g transform="translate(102.11, 5.94)">
        <g ref="letterE">
          <path
            d="M9.64 18.81C7.7 18.81 6.01 18.42 4.57 17.64C3.12 16.86 2 15.77 1.2 14.37C0.4 12.95 0 11.29 0 9.4C0 7.51 0.4 5.87 1.2 4.47C2 3.07 3.12 1.98 4.57 1.2C6.01 0.4 7.7 0 9.64 0C11.57 0 13.24 0.41 14.64 1.23C16.06 2.03 17.15 3.18 17.91 4.67C18.66 6.16 19.04 7.91 19.04 9.94V11.07H6.67C6.71 12.16 7.01 12.97 7.57 13.51C8.15 14.02 8.88 14.27 9.77 14.27C10.42 14.27 10.96 14.15 11.4 13.91C11.87 13.66 12.2 13.23 12.4 12.6L18.81 12.94C18.32 14.87 17.25 16.34 15.61 17.34C13.96 18.32 11.97 18.81 9.64 18.81ZM6.67 7.6H12.57C12.55 6.56 12.27 5.77 11.74 5.24C11.2 4.68 10.5 4.4 9.64 4.4C8.81 4.4 8.13 4.69 7.57 5.27C7.04 5.85 6.74 6.62 6.67 7.6Z"
          />
        </g>
      </g>

      <!-- r -->
      <g transform="translate(121.75, 6.34)">
        <g ref="letterR">
          <path
            d="M0 18.01V0H6.27L6.47 5.67L6 5.6C6.34 3.6 6.87 2.17 7.6 1.3C8.34 0.43 9.37 0 10.7 0H12.24V5.14H10.64C9.68 5.14 8.89 5.24 8.27 5.44C7.67 5.61 7.21 5.94 6.9 6.4C6.61 6.87 6.47 7.53 6.47 8.37V18.01H0Z"
          />
        </g>
      </g>
    </g>

    <!-- Dot -->
    <g transform="translate(132.47, 18.34)">
      <g ref="dotRef">
        <path d="M0 6V0H6.54V6H0Z" />
      </g>
    </g>

    <!-- Clip definition -->
    <defs>
      <clipPath :id="clipId">
        <rect ref="clipRectRef" x="38.95" y="0" width="95.04" height="29.75" />
      </clipPath>
    </defs>
  </svg>
</template>
