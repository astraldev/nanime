<template>
  <div class="p-8 space-y-12 text-white [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:font-mono">
    <!-- Section 1: Mouse Follow with Particles -->
    <section>
      <h2>1. Mouse Follow - Particle Grid</h2>
      <p class="text-gray-400 mb-4">
        Move your cursor over the box to see particles follow with staggered delays
      </p>
      <PWrapper
        ref="particleContainer"
        extra-class="relative overflow-hidden h-96 cursor-crosshair"
      >
        <div
          v-for="i in particleCount"
          :key="i"
          ref="particles"
          class="particle"
        />
      </PWrapper>
    </section>

    <!-- Section 2: Simple Property Updates -->
    <section>
      <h2>2. Direct Property Updates</h2>
      <p class="text-gray-400 mb-4">
        Click buttons to update properties directly without creating new animations
      </p>
      <div class="flex gap-4 mb-6">
        <PButton @click="moveBox">
          Move Box
        </PButton>
        <PButton @click="rotateBox">
          Rotate Box
        </PButton>
        <PButton @click="scaleBox">
          Scale Box
        </PButton>
        <PButton @click="resetBox">
          Reset
        </PButton>
      </div>
      <PWrapper extra-class="relative h-40">
        <div
          ref="animatableBox"
          class="absolute top-1/2 left-8 -translate-y-1/2 size-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg"
        />
      </PWrapper>
    </section>
  </div>
</template>

<script setup lang="ts">
const { $anime } = useNuxtApp()

// --- Section 1: Mouse Follow ---
const particleContainer = useTemplateRef('particleContainer')
const particles = useTemplateRef('particles')
const gridSize = 8
const particleCount = gridSize * gridSize

const particleAnimatable = useAnimatable(particles, {
  x: {
    duration: $anime.utils.stagger(250, {
      ease: 'in(1)',
      from: 'center',
      grid: [gridSize, gridSize],
    }),
  },
  y: {
    duration: $anime.utils.stagger(250, {
      ease: 'in(1)',
      from: 'center',
      grid: [gridSize, gridSize],
    }),
  },
  rotate: {
    unit: 'rad',
    duration: 0,
  },
  ease: 'outElastic(.3, 1.4)',
})

// Use VueUse for mouse tracking
const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(particleContainer)

watchEffect(() => {
  // Only animate when mouse is inside the container
  if (isOutside.value) return

  const x = elementX.value
  const y = elementY.value
  const w = elementWidth.value
  const h = elementHeight.value
  const hw = w / 2
  const hh = h / 2

  const mappedX = $anime.utils.mapRange(x, 0, w, -hw, hw)
  const mappedY = $anime.utils.mapRange(y, 0, h, -hh, hh)

  particleAnimatable.x?.(mappedX)
  particleAnimatable.y?.(mappedY)
  particleAnimatable.rotate?.(-Math.atan2(hw - x, hh - y))
})

// --- Section 2: Direct Property Updates ---
const animatableBox = useTemplateRef('animatableBox')
const boxAnimatable = useAnimatable(animatableBox, {
  x: { duration: 800 },
  rotate: { duration: 600 },
  scale: { duration: 500 },
  ease: 'outElastic(.5, 1)',
})

function moveBox() {
  const currentX = Math.random() * 300
  boxAnimatable.x?.(currentX)
}

function rotateBox() {
  const currentRotate = Math.random() * 360
  boxAnimatable.rotate?.(currentRotate)
}

function scaleBox() {
  const currentScale = 0.5 + Math.random() * 1.5
  boxAnimatable.scale?.(currentScale)
}

function resetBox() {
  boxAnimatable.x?.(0)
  boxAnimatable.rotate?.(0)
  boxAnimatable.scale?.(1)
}
</script>

<style scoped>
.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translate(-50%, -50%);
}
</style>
