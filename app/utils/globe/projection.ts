import type { GeoLocation } from '~/types/trajectory'

export type GlobeView = { phi: number, theta: number, scale: number }

export type ProjectedPoint = { x: number, y: number, facing: number }

const GLOBE_RADIUS = 0.8
const FULL_TURN = Math.PI * 2

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

function toCartesian([latitude, longitude]: GeoLocation): [number, number, number] {
  const lat = toRadians(latitude)
  const lng = toRadians(longitude) - Math.PI
  return [-Math.cos(lat) * Math.cos(lng), Math.sin(lat), Math.cos(lat) * Math.sin(lng)]
}

export function locationToAngles([latitude, longitude]: GeoLocation) {
  return { phi: Math.PI * 1.5 - toRadians(longitude), theta: toRadians(latitude) }
}

export function projectLocation(
  location: GeoLocation,
  { phi, theta, scale }: GlobeView,
  elevation = 0,
): ProjectedPoint {
  const radius = GLOBE_RADIUS + elevation
  const [px, py, pz] = toCartesian(location).map(axis => axis * radius) as [number, number, number]
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  const screenX = cosPhi * px + sinPhi * pz
  const screenY = sinPhi * sinTheta * px + cosTheta * py - cosPhi * sinTheta * pz
  const depth = -sinPhi * cosTheta * px + sinTheta * py + cosPhi * cosTheta * pz

  return { x: (screenX * scale + 1) / 2, y: (1 - screenY * scale) / 2, facing: depth / radius }
}

export function nearestEquivalentAngle(from: number, to: number) {
  const delta = (((to - from + Math.PI) % FULL_TURN) + FULL_TURN) % FULL_TURN - Math.PI
  return from + delta
}

export function angularDistance(from: GeoLocation, to: GeoLocation) {
  const [ax, ay, az] = toCartesian(from)
  const [bx, by, bz] = toCartesian(to)
  return Math.acos(Math.min(1, Math.max(-1, ax * bx + ay * by + az * bz)))
}
