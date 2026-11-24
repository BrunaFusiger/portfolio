export type GeoLocation = readonly [latitude: number, longitude: number]

export type GlobePhoto = {
  src: string
  alt: string
  year: number
  tooltip?: string
}

export type TrajectoryStop = {
  id: string
  place: string
  location: GeoLocation
  zoom: number
  text: string
  photos: readonly GlobePhoto[]
}
