export interface StoryPhoto {
  src: string
  altKey: string
  tooltipKey: string
  left: string
  top: string
  rotation: string
  scratched: boolean
}

export interface TapePosition {
  left: string
  top: string
  rotateDeg: number
}

export type AboutCollageStoryPin = {
  kind: 'pin'
  textKey: string
  photos: readonly StoryPhoto[]
  pinStyle: { left: string; top: string }
  pinShiftClass: string
}

export type AboutCollageStoryTapes = {
  kind: 'tapes'
  textKey: string
  photos: readonly StoryPhoto[]
  tapes: readonly TapePosition[]
}

export type AboutCollageStory = AboutCollageStoryPin | AboutCollageStoryTapes
