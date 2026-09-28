<script setup lang="ts">
import type { DriveKind, DriveSort } from '~/examples/drive/files'
import DriveSegmented, { type Segment } from './DriveSegmented.vue'

const filter = defineModel<DriveKind | 'all'>('filter', { required: true })
const sort = defineModel<DriveSort>('sort', { required: true })

const filterSegments: Segment<DriveKind | 'all'>[] = [
  { value: 'all', label: 'All' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
]

const sortSegments: Segment<DriveSort>[] = [
  { value: 'name', label: 'Name' },
  { value: 'kind', label: 'Type' },
  { value: 'size', label: 'Size' },
]
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 px-4 pt-4">
    <DriveSegmented
      v-model="filter"
      data-live="2"
      :segments="filterSegments"
    />
    <DriveSegmented
      v-model="sort"
      data-live="3"
      class="ml-auto"
      :segments="sortSegments"
    />
  </div>
</template>
