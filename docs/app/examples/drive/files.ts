export type DriveKind = 'image' | 'video' | 'audio'
export type DriveLayout = 'grid' | 'list' | 'columns'
export type DriveSort = 'name' | 'kind' | 'size'

export interface DriveFile {
  id: number
  name: string
  kind: DriveKind
  size: number
  modified: string
}

export const kinds: DriveKind[] = ['image', 'video', 'audio']

export const kindStyles: Record<DriveKind, { icon: string, tint: string, label: string }> = {
  image: { icon: 'i-ph-image-fill', tint: 'bg-primary/15 text-primary', label: 'Image' },
  video: { icon: 'i-ph-film-strip-fill', tint: 'bg-primary/80 text-white', label: 'Video' },
  audio: { icon: 'i-ph-waveform-bold', tint: 'bg-elevated/70 text-highlighted', label: 'Audio' },
}

export const startingFiles: DriveFile[] = [
  { id: 1, name: 'beach.jpg', kind: 'image', size: 4.2, modified: 'Sep 12' },
  { id: 2, name: 'launch.mp4', kind: 'video', size: 86, modified: 'Sep 9' },
  { id: 3, name: 'podcast.mp3', kind: 'audio', size: 32, modified: 'Aug 30' },
  { id: 4, name: 'sunset.png', kind: 'image', size: 6.8, modified: 'Aug 24' },
  { id: 5, name: 'demo.mov', kind: 'video', size: 140, modified: 'Aug 17' },
  { id: 6, name: 'theme.wav', kind: 'audio', size: 18, modified: 'Jul 28' },
  { id: 7, name: 'portrait.jpg', kind: 'image', size: 3.1, modified: 'Jul 3' },
]

export const uploads: Omit<DriveFile, 'id' | 'modified'>[] = [
  { name: 'trailer.mp4', kind: 'video', size: 64 },
  { name: 'city.jpg', kind: 'image', size: 5.4 },
  { name: 'voice.m4a', kind: 'audio', size: 9 },
  { name: 'forest.png', kind: 'image', size: 7.7 },
]

export const maxFiles = 8
