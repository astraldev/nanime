<template>
  <PWrapper title="useDraggable">
    <div class="space-y-8">
      <section class="space-y-4">
        <h3 class="text-xl font-semibold text-white">
          Reactive Snapping
        </h3>
        <p class="text-gray-400 text-sm">
          The box snaps to 25%, 50%, and 75% of the container width. Resize the window to see the snap points update automatically via <code>refresh()</code>.
        </p>
        <div
          ref="container"
          class="relative h-64 bg-black/40 rounded-xl overflow-hidden border border-white/10 p-8 flex items-center"
        >
          <!-- Visual Snap Guides -->
          <div class="absolute inset-0 pointer-events-none flex justify-around">
            <div
              v-for="snap in snapLevels"
              :key="snap"
              class="h-full border-l border-dashed border-white/10 relative"
              :style="{ left: `${snap * 100}%` }"
            >
              <span class="absolute top-2 left-2 text-[10px] text-gray-500 font-mono whitespace-nowrap">
                {{ Math.round(width * snap) }}px ({{ snap * 100 }}%)
              </span>
            </div>
          </div>

          <!-- Draggable Element -->
          <div
            ref="draggable"
            class="w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-bold shadow-xl z-10 select-none"
          >
            DRAG
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <PButton @click="revert">
            Revert Position
          </PButton>
          <PButton @click="enable">
            Enable
          </PButton>
          <PButton @click="disable">
            Disable
          </PButton>
          <div class="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <span class="text-xs text-gray-400 font-mono">X: {{ Math.round(dragger.x || 0) }}</span>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <h3 class="text-xl font-semibold text-white">
          Constraint Test
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
            <h4 class="text-sm font-medium text-gray-300">
              Snap Config
            </h4>
            <pre class="text-[10px] text-blue-400 font-mono bg-black/50 p-2 rounded">{{ JSON.stringify(snapConfig, null, 2) }}</pre>
          </div>
          <div class="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
            <h4 class="text-sm font-medium text-gray-300">
              Container Bounds
            </h4>
            <p class="text-xs text-gray-400">
              Width: {{ Math.round(width) }}px
            </p>
          </div>
        </div>
      </section>
    </div>
  </PWrapper>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core'

const container = useTemplateRef<HTMLElement>('container')
const draggable = useTemplateRef<HTMLElement>('draggable')
const { width } = useElementSize(container)

const snapLevels = [0.25, 0.5, 0.75]

const snapConfig = computed(() => {
  if (!width.value) return [0]
  return snapLevels.map(v => width.value * v)
})

const dragger = useDraggable(draggable, {
  container: container,
  x: {
    snap: snapConfig,
  },
})

const revert = () => dragger.revert?.()
const enable = () => dragger.enable?.()
const disable = () => dragger.disable?.()
</script>
