<script setup lang="ts">
import { CHANGELOG_TYPES } from '~/utils/changelog'

const entries = Object.values(CHANGELOG_TYPES)
</script>

<template>
  <div class="changelog-legend">
    <span
      v-for="entry in entries"
      :key="entry.label"
      class="entry"
    >
      <span
        class="swatch"
        :style="{ backgroundColor: entry.color }"
      />
      <strong>{{ entry.label }}</strong>
    </span>
  </div>
</template>

<style scoped>
.changelog-legend {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.25rem;
  row-gap: 0.5rem;
}

.entry {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
}

.swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
</style>
