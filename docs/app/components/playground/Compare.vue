<script setup lang="ts">
import type { CompareColumn } from '~/utils/playground'

defineProps<{
  title: string
  caption: string
  columns: CompareColumn[]
}>()
</script>

<template>
  <section class="space-y-4">
    <div class="space-y-1">
      <h2 class="text-lg font-semibold">
        {{ title }}
      </h2>
      <p class="text-sm text-muted">
        {{ caption }}
      </p>
    </div>
    <div
      v-if="$slots.controls"
      class="flex flex-wrap items-center gap-2"
    >
      <slot name="controls" />
    </div>
    <div
      class="grid gap-6"
      :class="columns.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'"
    >
      <div
        v-for="(column, index) in columns"
        :key="column.badge"
        class="space-y-3 rounded-lg border border-default p-4"
      >
        <PlaygroundColumnLabel
          :badge="column.badge"
          :name="column.name"
          :highlighted="index > 0"
        />
        <PlaygroundDefaultsScope :defaults="column.defaults">
          <slot :column="column" />
        </PlaygroundDefaultsScope>
      </div>
    </div>
  </section>
</template>
