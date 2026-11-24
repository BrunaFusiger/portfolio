import type { Globe, Marker } from 'cobe'
import type { TrajectoryStop } from '~/types/trajectory'
import {
  GLOBE_FLIGHT,
  GLOBE_LOOK,
  GLOBE_MAP_SAMPLES,
  GLOBE_MARKER,
  GLOBE_MAX_PIXEL_RATIO,
  GLOBE_PHONE_QUERY,
} from '~/utils/globe/globeSettings'
import { angularDistance, locationToAngles, nearestEquivalentAngle, projectLocation } from '~/utils/globe/projection'
import type { GlobeView } from '~/utils/globe/projection'

type Flight = { kill: () => void }

const MAP_TEXTURE_LOAD_FRAMES = 30

function buildMarker(stop: TrajectoryStop, isActive: boolean): Marker {
  return {
    location: [stop.location[0], stop.location[1]],
    size: isActive ? GLOBE_MARKER.activeSize : GLOBE_MARKER.idleSize,
    color: [...(isActive ? GLOBE_MARKER.activeColor : GLOBE_MARKER.idleColor)],
  }
}

function buildMarkers(stops: readonly TrajectoryStop[], activeIndex: number): Marker[] {
  const idle = stops.filter((_, index) => index !== activeIndex).map(stop => buildMarker(stop, false))
  const active = stops[activeIndex]
  return active ? [...idle, buildMarker(active, true)] : idle
}

function viewOf(stop: TrajectoryStop): GlobeView {
  return { ...locationToAngles(stop.location), scale: stop.zoom }
}

function loseWebglContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
  context?.getExtension('WEBGL_lose_context')?.loseContext()
}

export function useTrajectoryGlobe(
  canvas: Ref<HTMLCanvasElement | null>,
  stops: () => readonly TrajectoryStop[],
  activeIndex: Ref<number>,
) {
  const reducedMotion = useReducedMotion()
  const { loadGsap } = useGsap()

  const firstStop = stops()[activeIndex.value]
  const view = ref<GlobeView>(firstStop ? viewOf(firstStop) : { phi: 0, theta: 0, scale: 1 })

  const hasEnteredView = ref(false)

  const projectedStops = computed(() =>
    stops().map(stop => projectLocation(stop.location, view.value, GLOBE_LOOK.markerElevation)),
  )

  let globe: Globe | null = null
  let flight: Flight | null = null
  let resizeObserver: ResizeObserver | null = null
  let unmounted = false
  let mapLoadFrame = 0

  function draw() {
    globe?.update({ ...view.value })
  }

  function resize() {
    const size = canvas.value?.clientWidth ?? 0
    if (!globe || size === 0) return
    globe.update({ width: size, height: size })
    draw()
  }

  function redrawWhileMapLoads(framesLeft: number) {
    draw()
    if (framesLeft <= 0 || unmounted) return
    mapLoadFrame = requestAnimationFrame(() => redrawWhileMapLoads(framesLeft - 1))
  }

  async function createGlobe(target: HTMLCanvasElement) {
    const { default: create } = await import('cobe')
    if (unmounted) return
    const isPhone = window.matchMedia(GLOBE_PHONE_QUERY).matches
    const maxPixelRatio = isPhone ? GLOBE_MAX_PIXEL_RATIO.phone : GLOBE_MAX_PIXEL_RATIO.desktop
    const size = target.clientWidth || 1
    globe = create(target, {
      ...GLOBE_LOOK,
      ...view.value,
      baseColor: [...GLOBE_LOOK.baseColor],
      glowColor: [...GLOBE_LOOK.glowColor],
      markerColor: [...GLOBE_LOOK.markerColor],
      width: size,
      height: size,
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, maxPixelRatio),
      mapSamples: isPhone ? GLOBE_MAP_SAMPLES.phone : GLOBE_MAP_SAMPLES.desktop,
      markers: buildMarkers(stops(), activeIndex.value),
    })
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(target)
    redrawWhileMapLoads(MAP_TEXTURE_LOAD_FRAMES)
  }

  async function flyTo(index: number, fromIndex: number) {
    const stop = stops()[index]
    const previousStop = stops()[fromIndex]
    if (!stop) return
    hasEnteredView.value = true
    globe?.update({ markers: buildMarkers(stops(), index) })

    const target = viewOf(stop)
    const destination: GlobeView = { ...target, phi: nearestEquivalentAngle(view.value.phi, target.phi) }
    flight?.kill()
    flight = null

    if (reducedMotion.value) {
      view.value = destination
      draw()
      return
    }

    const { gsap } = await loadGsap()
    if (unmounted || activeIndex.value !== index) return

    const animated = { ...view.value }
    const isLongHop = !!previousStop && angularDistance(previousStop.location, stop.location) > GLOBE_FLIGHT.longHopRadians
    const half = GLOBE_FLIGHT.duration / 2
    const onUpdate = () => {
      view.value = { ...animated }
      draw()
    }

    const onComplete = () => {
      flight = null
    }

    const timeline = gsap.timeline({ onUpdate, onComplete })
    timeline.to(animated, {
      phi: destination.phi,
      theta: destination.theta,
      duration: GLOBE_FLIGHT.duration,
      ease: GLOBE_FLIGHT.ease,
    }, 0)
    if (isLongHop) {
      timeline.to(animated, { scale: GLOBE_FLIGHT.overviewScale, duration: half, ease: 'power2.out' }, 0)
      timeline.to(animated, { scale: destination.scale, duration: half, ease: 'power2.in' }, half)
    }
    else {
      timeline.to(animated, { scale: destination.scale, duration: GLOBE_FLIGHT.duration, ease: GLOBE_FLIGHT.ease }, 0)
    }
    flight = timeline
  }

  const { stop: stopWatchingVisibility } = useIntersectionObserver(
    canvas,
    ([entry]) => {
      if (!entry?.isIntersecting) return
      hasEnteredView.value = true
      stopWatchingVisibility()
    },
    { threshold: 0.15 },
  )

  watch(activeIndex, (index, fromIndex) => void flyTo(index, fromIndex))

  onMounted(() => {
    if (canvas.value) void createGlobe(canvas.value)
  })

  onBeforeUnmount(() => {
    unmounted = true
    cancelAnimationFrame(mapLoadFrame)
    flight?.kill()
    flight = null
    resizeObserver?.disconnect()
    resizeObserver = null
    globe?.destroy()
    globe = null
    if (canvas.value) loseWebglContext(canvas.value)
  })

  return { projectedStops, hasEnteredView: readonly(hasEnteredView) }
}
