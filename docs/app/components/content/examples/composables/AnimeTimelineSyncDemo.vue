<script setup lang="ts">
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const circleAnimation = useAnimate('.circle', { x: '15rem' })
const tlA = useAnimeTimeline({ loop: true, alternate: true })

tlA
  .sync(circleAnimation)
  .add('.triangle', { x: '15rem', duration: 2000 })
  .add('.square', { x: '15rem' })
  .add({ duration: 1500 })

const tlB = useAnimeTimeline({
  loop: true,
  alternate: true,
  defaults: {
    duration: 2000,
  },
})

tlB
  .add(
    ['.triangle', '.square'],
    { rotate: 360 }, 0,
  )
  .add(
    '.circle',
    { scale: [1, 1.5, 1] }, 0,
  )

const tlMain = useAnimeTimeline({ loop: true, alternate: true })
tlMain.sync(tlA).sync(tlB, '-=2000')
</script>

<template>
  <ExampleWrapper>
    <div class="flex flex-col gap-1 w-full">
      <div class="triangle size-6 bg-primary" />
      <div class="flex gap-1">
        <div class="square size-6 rounded-sm bg-primary" />
        <div class="circle size-6 rounded-full bg-primary" />
      </div>
    </div>
  </ExampleWrapper>
</template>

<style scoped>
.triangle {
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4.72 31.235h22.56a2.75 2.75 0 0 0 2.393-4.105L18.175 6.838a2.5 2.5 0 0 0-4.35 0L2.327 27.13a2.75 2.75 0 0 0 2.392 4.105z'/%3E%3C/svg%3E") no-repeat 50% 50%;
  mask-size: cover;
  transform-origin: 50% 70%;
}
</style>
