<template>
  <div class="p-8 space-y-12 text-white [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:font-mono">
    <!-- Section 1: Basic Loop -->
    <section>
      <h2>1. Basic Infinite Loop</h2>
      <PWrapper>
        <PItem ref="box1" />
      </PWrapper>
    </section>

    <!-- Section 2: Grid Stagger -->
    <section>
      <h2>2. Grid Stagger</h2>
      <PWrapper extra-class="grid grid-cols-5 w-fit gap-2">
        <PItem
          v-for="i in 30"
          :key="i"
          ref="staggerBox"
          extra-class="size-5 bg-indigo-500"
        />
      </PWrapper>
    </section>

    <!-- Section 3: Interactive Controls -->
    <section>
      <h2>3. Interactive: Swap Target & Animation</h2>

      <div class="flex gap-4 mb-6">
        <PTabs
          v-model="animType"
          :items="[
            { value: 'move', label: 'Move' },
            { value: 'spin', label: 'Spin' },
            { value: 'scale', label: 'Scale' },
          ]"
        />

        <PButton @click="targetId = targetId === 'A' ? 'B' : 'A'">
          Swap Target (Current: {{ targetId }})
        </PButton>
      </div>

      <PWrapper extra-class="relative h-40 overflow-hidden">
        <PItem
          ref="targetA"
          label="A"
          extra-class="absolute top-1/2 left-4 -translate-y-1/2 size-20 bg-rose-500 rounded-xl text-2xl"
        />

        <PItem
          ref="targetB"
          label="B"
          extra-class="absolute top-1/2 left-32 -translate-y-1/2 size-20 bg-amber-500 rounded-full text-2xl"
        />
      </PWrapper>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AnimationParams } from 'animejs'

const { $anime } = useNuxtApp()

// --- Section 1 ---
const box1 = useTemplateRef('box1')
useWaapiAnimate(box1, {
  x: 250,
  y: 50,
  rotate: '45deg',
  alternate: true,
  loop: true,
  duration: 2000,
  ease: 'out',
})

// --- Section 2 ---
const staggerBox = useTemplateRef('staggerBox')
useAnimate(staggerBox, {
  scale: [
    { to: [0, 1.25] },
    { to: 0 },
  ],
  boxShadow: [
    { to: '0 0 1rem 0 currentColor' },
    { to: '0 0 0rem 0 currentColor' },
  ],
  delay: $anime.utils.stagger(100, {
    grid: [5, 6],
    from: $anime.utils.random(0, 5 * 6),
  }),
  loop: true,
  alternate: true,
})

// --- Section 3 ---
const targetA = useTemplateRef('targetA')
const targetB = useTemplateRef('targetB')
const targetId = ref<'A' | 'B'>('A')
const animType = ref<'move' | 'spin' | 'scale'>('move')

// Dynamic target
const activeTarget = computed(() => targetId.value === 'A' ? targetA.value : targetB.value)

// Dynamic options
const activeOptions = computed((): AnimationParams => {
  switch (animType.value) {
    case 'move':
      return {
        translateX: 200,
        rotate: 0,
        scale: 1,
        borderRadius: targetId.value === 'A' ? ['0%', '50%'] : ['50%', '0%'], // Morph shape
        duration: 800,
        ease: 'inOutExpo',
        loop: false,
        alternate: false,
      } satisfies AnimationParams
    case 'spin':
      return {
        translateX: 0,
        rotate: 360,
        scale: 1,
        duration: 1500,
        ease: 'inOutExpo',
        loop: true, // Loop this one
        alternate: false,
      } satisfies AnimationParams
    case 'scale':
      return {
        translateX: 0,
        rotate: 0,
        scale: [1, 1.5],
        duration: 600,
        alternate: true,
        loop: true,
        ease: 'inOutExpo',
      } satisfies AnimationParams
  }

  return {} as AnimationParams
})

useAnimate(activeTarget, activeOptions)
</script>
