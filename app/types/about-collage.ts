export interface StoryPhoto {
  src: string
  alt: string
  tooltip: string
  left: string
  top: string
  rotation: string
}

export interface TapePosition {
  left: string
  top: string
  rotateDeg: number
}

export type AboutCollageStoryPin = {
  kind: 'pin'
  text: string
  photos: readonly StoryPhoto[]
  pinStyle: { left: string; top: string }
  pinShiftClass: string
}

export type AboutCollageStoryTapes = {
  kind: 'tapes'
  text: string
  photos: readonly StoryPhoto[]
  tapes: readonly TapePosition[]
}

export type AboutCollageStory = AboutCollageStoryPin | AboutCollageStoryTapes
