<template>
  <div :class="wrapperClasses">
    <button
      v-for="item in items"
      :key="hash(item)"
      :class="getButtonClasses(item)"
      @click="handleTabClick(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends number | boolean | string">
import { twMerge } from 'tailwind-merge'
import { hash } from 'ohash'

interface TabItem {
  label: string
  value: T
}

interface Props {
  items: TabItem[]
  modelValue: T
  extraClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  extraClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const wrapperClasses = computed(() => {
  const defaultClasses = 'flex gap-2 p-1 bg-gray-800/50 rounded-lg w-fit border border-gray-700'
  return twMerge(defaultClasses, props.extraClass)
})

function getButtonClasses(item: TabItem) {
  const baseClasses = 'px-3 py-1 rounded text-sm transition-colors'
  const activeClasses = item.value === props.modelValue
    ? 'bg-white text-black'
    : 'text-gray-400 hover:text-white'

  return twMerge(baseClasses, activeClasses)
}

function handleTabClick(value: T) {
  emit('update:modelValue', value)
}
</script>
