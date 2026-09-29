export interface Track {
  id: number
  title: string
  artist: string
  album: string
  duration: number
  icon: string
  cover: string
}

export const openingTrack: Track = { id: 1, title: 'Midnight Drive', artist: 'Nova Lane', album: 'Neon Roads', duration: 222, icon: 'i-ph-moon-stars-fill', cover: 'bg-linear-to-br from-primary to-primary/25' }

export const queuedTracks: Track[] = [
  { id: 2, title: 'Glass Harbor', artist: 'The Tidelines', album: 'Salt & Static', duration: 192, icon: 'i-ph-waves-bold', cover: 'bg-linear-to-t from-primary/30 to-primary' },
  { id: 3, title: 'Low Tide', artist: 'Mara Quell', album: 'Undertow', duration: 178, icon: 'i-ph-drop-fill', cover: 'bg-linear-to-tr from-primary/60 to-primary/10' },
  { id: 4, title: 'Paper Lanterns', artist: 'Kites at Dusk', album: 'Festival', duration: 205, icon: 'i-ph-lamp-fill', cover: 'bg-linear-to-bl from-primary to-primary/40' },
  { id: 5, title: 'Northern Loop', artist: 'Arc Theory', album: 'Loops', duration: 236, icon: 'i-ph-infinity-bold', cover: 'bg-linear-to-r from-primary/20 to-primary' },
  { id: 6, title: 'Slow Burn', artist: 'Juniper Row', album: 'Embers', duration: 187, icon: 'i-ph-fire-fill', cover: 'bg-linear-to-b from-primary to-primary/15' },
]

export function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}
