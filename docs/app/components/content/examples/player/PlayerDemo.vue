<script setup lang="ts">
import { usePlayer } from '~/examples/player/usePlayer'
import SceneWindow from '../shared/SceneWindow.vue'
import PlayerNowPlaying from './PlayerNowPlaying.vue'
import PlayerQueue from './PlayerQueue.vue'

const player = usePlayer()
const { current, playlist, playing, volume, clock } = player

function setVolume(fraction: number) {
  volume.value = fraction
}
</script>

<template>
  <SceneWindow
    title="Player"
    @reset="player.reset"
  >
    <div class="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
      <PlayerNowPlaying
        :track="current"
        :playing="playing"
        :time="clock.time"
        :volume="volume"
        @toggle-play="player.togglePlay"
        @next="player.next"
        @previous="player.previous"
        @seek="player.seek"
        @volume="setVolume"
      />
      <PlayerQueue
        :playlist="playlist"
        :current-id="current.id"
        :playing="playing"
        @play="player.playTrack"
        @shuffle="player.shufflePlaylist"
      />
    </div>
  </SceneWindow>
</template>
