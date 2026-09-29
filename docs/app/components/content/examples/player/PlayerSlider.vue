<script setup lang="ts">
const props = defineProps<{
  value: number
  label: string
}>()

const emit = defineEmits<{
  input: [value: number]
  change: [value: number]
}>()

const rail = useTemplateRef('rail')
const thumb = useTemplateRef('thumb')
const range = ref(0)
const dragging = ref(false)
const dragValue = ref(0)

const draggable = useDraggable(thumb, {
  container: rail,
  y: false,
  velocityMultiplier: 0,
  onGrab: grab,
  onDrag: drag,
  onRelease: release,
  onResize: measure,
})

const shown = computed(() => dragging.value ? dragValue.value : props.value)

function fractionOf(x: number) {
  return range.value ? Math.min(1, Math.max(0, x / range.value)) : 0
}

function follow() {
  if (!dragging.value) draggable.setX(props.value * range.value, true)
}

function measure() {
  const railWidth = rail.value?.getBoundingClientRect().width ?? 0
  const thumbWidth = thumb.value?.getBoundingClientRect().width ?? 0
  range.value = Math.max(0, railWidth - thumbWidth)
  follow()
}

function grab() {
  dragging.value = true
  dragValue.value = fractionOf(draggable.x)
}

function drag() {
  dragValue.value = fractionOf(draggable.x)
  emit('input', dragValue.value)
}

function release() {
  dragging.value = false
  emit('change', fractionOf(draggable.x))
}

watch(() => props.value, follow)
onMounted(measure)
</script>

<template>
  <div
    ref="rail"
    role="slider"
    :aria-label="label"
    :aria-valuenow="Math.round(shown * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    class="relative h-4 w-full"
  >
    <div class="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-accented">
      <div
        class="h-full rounded-full bg-primary"
        :style="{ width: `${shown * 100}%` }"
      />
    </div>
    <div
      ref="thumb"
      class="absolute top-0 left-0 size-4 cursor-grab touch-none rounded-full bg-white shadow ring-1 ring-black/10 active:cursor-grabbing"
    />
  </div>
</template>
