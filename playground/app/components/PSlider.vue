<template>
  <label class="block space-y-2">
    <div class="flex justify-between text-sm">
      <span class="text-gray-400">{{ label }}</span>
      <span class="font-mono text-gray-200">{{ modelValue }}</span>
    </div>
    <input
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
      @input="handleInput"
    >
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number
  label: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number.parseFloat(target.value))
}
</script>
