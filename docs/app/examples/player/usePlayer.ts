import { computed, reactive, ref, watch } from 'vue'
import { useAnimate } from '#nanime/composables'
import { shuffle } from '#nanime/utils'
import { openingTrack, queuedTracks, type Track } from './tracks'

const allTracks = [openingTrack, ...queuedTracks]

export function usePlayer() {
  const playlist = ref<Track[]>([...allTracks])
  const currentId = ref(openingTrack.id)
  const playing = ref(false)
  const volume = ref(0.7)
  const clock = reactive({ time: 0 })

  const current = computed(() => playlist.value.find(track => track.id === currentId.value) ?? openingTrack)
  const currentIndex = computed(() => playlist.value.findIndex(track => track.id === currentId.value))

  const playback = useAnimate(clock, () => ({
    time: [0, current.value.duration],
    duration: current.value.duration * 1000,
    ease: 'linear',
    autoplay: false,
    onComplete: next,
  }))

  watch(currentId, () => {
    playback.seek(0)
    if (playing.value) playback.play()
  })

  function play() {
    playing.value = true
    playback.play()
  }

  function pause() {
    playing.value = false
    playback.pause()
  }

  function togglePlay() {
    if (playing.value) pause()
    else play()
  }

  function seek(fraction: number) {
    playback.seek(fraction * current.value.duration * 1000)
  }

  function stepTo(offset: number) {
    const count = playlist.value.length
    const track = playlist.value[(currentIndex.value + offset + count) % count]
    if (track) currentId.value = track.id
  }

  function next() {
    stepTo(1)
  }

  function previous() {
    if (clock.time > 3) return seek(0)
    stepTo(-1)
  }

  function playTrack(track: Track) {
    if (track.id === currentId.value) return togglePlay()
    currentId.value = track.id
    play()
  }

  function shufflePlaylist() {
    playlist.value = shuffle([...playlist.value])
  }

  function reset() {
    pause()
    playlist.value = [...allTracks]
    currentId.value = openingTrack.id
    volume.value = 0.7
    seek(0)
  }

  return { current, playlist, playing, volume, clock, togglePlay, seek, next, previous, playTrack, shufflePlaylist, reset }
}
