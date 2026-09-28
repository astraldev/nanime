<script setup lang="ts" generic="Value extends string">
export interface Segment<Value> {
  value: Value
  label: string
  icon?: string
}

defineProps<{
  segments: Segment<Value>[]
  iconOnly?: boolean
}>()

const selected = defineModel<Value>({ required: true })

const layoutOptions = {
  duration: 250,
  ease: 'out(3)',
}
</script>

<template>
  <AnimeLayoutGroup
    :deps="[selected]"
    elements=".segment-pill"
    :layout-options="layoutOptions"
    class="relative grid shrink-0 grid-flow-col auto-cols-max rounded-lg bg-elevated p-1 text-xs sm:text-sm"
  >
    <span
      class="segment-pill row-start-1 rounded-md bg-default shadow-sm ring-1 ring-default"
      :style="{ gridColumn: segments.findIndex(segment => segment.value === selected) + 1 }"
    />
    <button
      v-for="(segment, index) in segments"
      :key="segment.value"
      type="button"
      class="relative row-start-1 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 font-medium sm:px-3 transition-colors"
      :class="segment.value === selected ? 'text-highlighted' : 'text-muted hover:text-default'"
      :style="{ gridColumn: index + 1 }"
      :title="segment.label"
      @click="selected = segment.value"
    >
      <UIcon
        v-if="segment.icon"
        :name="segment.icon"
        class="size-5"
      />
      <span :class="{ 'sr-only': iconOnly }">{{ segment.label }}</span>
    </button>
  </AnimeLayoutGroup>
</template>
