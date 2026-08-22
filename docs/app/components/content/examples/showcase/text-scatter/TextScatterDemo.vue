<script setup lang="ts">
import { animate, createTimer, random } from '#nanime/utils'
import type { JSAnimation, Timer } from '#nanime/types'
import { tryOnScopeDispose, useEventListener, useIntervalFn } from '@vueuse/core'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const container = useTemplateRef<HTMLElement>('container')
const textRef = useTemplateRef<HTMLElement>('textRef')
const { chars } = useSplitText(textRef, { chars: true })

const radius = 60
const mode = ref<'repel' | 'attract'>('repel')
const isInside = ref(false)
const localX = ref(0)
const localY = ref(0)

const animations: (JSAnimation | undefined)[] = []
let rects: DOMRect[] = []
let pointerX = -1000
let pointerY = -1000

function updateRects() {
  if (chars.value && chars.value.length) {
    rects = chars.value.map(c => c.getBoundingClientRect())
  }
}

function onPointerMove(e: PointerEvent) {
  pointerX = e.clientX
  pointerY = e.clientY
  if (container.value) {
    const box = container.value.getBoundingClientRect()
    localX.value = e.clientX - box.left
    localY.value = e.clientY - box.top
  }
  isInside.value = true
}

function onPointerLeave() {
  pointerX = -1000
  pointerY = -1000
  isInside.value = false
}

function animateChar(el: HTMLElement, i: number) {
  const anim = animations[i]
  if (anim && anim.progress < 0.4) return
  const rect = rects[i]
  if (!rect) return

  const charCenterX = rect.left + rect.width * 0.5
  const charCenterY = rect.top + rect.height * 0.5
  const dx = pointerX - charCenterX
  const dy = pointerY - charCenterY
  const distSq = dx * dx + dy * dy

  if (distSq > radius * radius) return

  const dist = Math.sqrt(distSq) || 1
  const force = 1 - dist / radius
  const sign = mode.value === 'repel' ? -1 : 1
  const push = (35 * force + random(6, 16)) * sign

  animations[i] = animate(el, {
    keyframes: [
      {
        x: (dx / dist) * push + random(-4, 4),
        y: (dy / dist) * push + random(-4, 4),
        z: -random(60, 220) * force,
        rotate: random(-18, 18),
        rotateX: (dy / dist) * 25 * force,
        rotateY: -(dx / dist) * 25 * force,
      },
      {
        x: 0,
        y: 0,
        z: 0,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        ease: 'inOutQuad',
        delay: 400,
        duration: 800,
      },
    ],
  })
}

let timer: Timer | null = null

onMounted(async () => {
  await nextTick()
  updateRects()

  timer = createTimer({
    onUpdate: () => {
      if (!isInside.value) return
      chars.value.forEach(animateChar)
    },
  })
})

watch(chars, async (newChars) => {
  if (newChars.length) {
    await nextTick()
    updateRects()
  }
})

useIntervalFn(() => {
  mode.value = mode.value === 'repel' ? 'attract' : 'repel'
}, 5000)

useEventListener('resize', updateRects)
useEventListener('scroll', updateRects, { capture: true, passive: true })

tryOnScopeDispose(() => {
  timer?.revert()
  animations.forEach(a => a?.revert())
})

const actions = computed<ExampleAction[]>(() => [
  {
    label: `Mode: ${mode.value === 'repel' ? 'Repel' : 'Attract'}`,
    run: () => {
      mode.value = mode.value === 'repel' ? 'attract' : 'repel'
    },
  },
])

const status = computed(() => `${mode.value === 'repel' ? 'Repelling' : 'Attracting'} · switches every 5s`)
</script>

<template>
  <ExampleWrapper
    :actions="actions"
    :status="status"
  >
    <div
      ref="container"
      class="relative w-full p-8 rounded-lg overflow-hidden bg-primary/5 border border-primary/20 flex items-center justify-center cursor-crosshair select-none [perspective:400px]"
      @pointerenter="updateRects"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <!-- Visible Magnetic Proximity Field Halo -->
      <div
        v-if="isInside"
        class="pointer-events-none absolute rounded-full border border-dashed border-primary/45 bg-primary/10 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
        :style="{
          left: `${localX}px`,
          top: `${localY}px`,
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
        }"
      />

      <p
        ref="textRef"
        class="text-sm sm:text-base text-muted leading-relaxed select-none pointer-events-none max-w-xl text-left"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </div>
  </ExampleWrapper>
</template>
