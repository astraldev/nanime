<script setup lang="ts" generic="Value extends string | boolean">
const props = defineProps<{
  options: readonly Value[]
  label?: (value: Value) => string
}>()

const model = defineModel<Value>({ required: true })

const labelOf = (value: Value) => props.label?.(value) ?? String(value)
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <UButton
      v-for="option in options"
      :key="String(option)"
      size="sm"
      :color="option === model ? 'primary' : 'neutral'"
      :variant="option === model ? 'soft' : 'outline'"
      @click="model = option"
    >
      {{ labelOf(option) }}
    </UButton>
  </div>
</template>
