<script setup lang="ts">
import type { DriveLayout } from '~/examples/drive/files'
import DriveSegmented, { type Segment } from './DriveSegmented.vue'

defineProps<{
  canUpload: boolean
}>()

const layout = defineModel<DriveLayout>('layout', { required: true })

const emit = defineEmits<{
  upload: []
}>()

const layoutSegments: Segment<DriveLayout>[] = [
  { value: 'grid', label: 'Grid', icon: 'i-ph-squares-four' },
  { value: 'list', label: 'List', icon: 'i-ph-list' },
  { value: 'columns', label: 'Columns', icon: 'i-ph-columns' },
]
</script>

<template>
  <div class="flex items-center gap-3 border-b border-default p-3">
    <label class="hidden min-w-0 flex-1 items-center gap-2 rounded-lg bg-elevated/60 px-3 py-2 text-sm text-muted opacity-40 sm:flex">
      <UIcon
        name="i-ph-magnifying-glass"
        class="size-4 shrink-0"
      />
      <input
        type="search"
        disabled
        placeholder="Search"
        title="Not part of this example"
        class="w-full min-w-0 bg-transparent outline-none disabled:cursor-not-allowed"
      >
    </label>
    <DriveSegmented
      v-model="layout"
      data-live="1"
      :segments="layoutSegments"
      icon-only
    />
    <button
      type="button"
      data-live="6"
      class="ml-auto flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:ml-0"
      :disabled="!canUpload"
      @click="emit('upload')"
    >
      <UIcon
        name="i-ph-upload-simple-bold"
        class="size-4"
      />
      Upload
    </button>
    <button
      type="button"
      disabled
      title="Not part of this example"
      class="grid size-9 shrink-0 place-items-center rounded-full bg-elevated text-xs font-semibold text-muted disabled:cursor-not-allowed disabled:opacity-40"
    >
      EE
    </button>
  </div>
</template>
