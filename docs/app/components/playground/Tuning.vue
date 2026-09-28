<script setup lang="ts" generic="Values extends Record<string, number>">
import type { CompareColumn, TuningSlider } from '~/utils/playground'

defineProps<{
  columns: CompareColumn[]
  sliders: readonly TuningSlider<keyof Values & string>[]
}>()

const values = defineModel<Values>({ required: true })

function set(key: keyof Values & string, value: number | number[] | undefined) {
  if (typeof value === 'number') values.value = { ...values.value, [key]: value }
}
</script>

<template>
  <section class="grid gap-6 rounded-lg border border-default p-4 md:grid-cols-2">
    <div class="space-y-3">
      <h2 class="font-semibold">
        Candidates
      </h2>
      <div
        v-for="(column, index) in columns"
        :key="column.badge"
        class="space-y-1"
      >
        <PlaygroundColumnLabel
          :badge="column.badge"
          :name="column.name"
          :highlighted="index > 0"
        />
        <p
          v-for="line in column.lines"
          :key="line"
          class="font-mono text-xs text-muted"
        >
          {{ line }}
        </p>
      </div>
    </div>
    <div class="space-y-3">
      <h2 class="font-semibold">
        Tuning
      </h2>
      <label
        v-for="slider in sliders"
        :key="slider.key"
        class="block space-y-1 text-sm"
      >
        <span class="flex justify-between">
          <span>{{ slider.label }}</span>
          <span class="font-mono text-muted">{{ values[slider.key] }}{{ slider.unit }}</span>
        </span>
        <USlider
          :model-value="values[slider.key]"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
          @update:model-value="set(slider.key, $event)"
        />
      </label>
      <slot />
    </div>
  </section>
</template>
