<script setup lang="ts">
import { spring } from '#nanime/easings'
import { round } from '#nanime/utils'

const props = defineProps<{
  trashCount: number
  trashArmed: boolean
  usedStorage: number
}>()

const capacity = 500

const disabledNav = [
  { label: 'Recent', icon: 'i-ph-clock' },
  { label: 'Starred', icon: 'i-ph-star' },
  { label: 'Shared', icon: 'i-ph-users' },
]

const badgeEnter = {
  scale: [0.6, 1],
  ease: spring({ bounce: 0.2, duration: 300 }),
}

const badgeLeave = {
  opacity: 0,
  duration: 60,
}

const meterParams = {
  used: { duration: 600, ease: 'out(3)' },
}

const trashTarget = useTemplateRef('trashTarget')
const meter = reactive({ used: props.usedStorage })
const meterTo = useAnimatable(meter, meterParams)

watch(() => props.usedStorage, used => meterTo.used?.(used))

defineExpose({ trashTarget })
</script>

<template>
  <aside class="flex w-14 shrink-0 flex-col gap-1 border-r border-default p-2 text-sm sm:w-52 sm:p-3">
    <div class="flex items-center gap-2.5 rounded-lg bg-elevated px-2.5 py-2 font-medium text-highlighted">
      <UIcon
        name="i-ph-folder-simple-fill"
        class="size-5 shrink-0"
      />
      <span class="hidden sm:inline">Library</span>
    </div>
    <button
      v-for="item in disabledNav"
      :key="item.label"
      type="button"
      disabled
      title="Not part of this example"
      class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted disabled:cursor-not-allowed disabled:opacity-40"
    >
      <UIcon
        :name="item.icon"
        class="size-5 shrink-0"
      />
      <span class="hidden sm:inline">{{ item.label }}</span>
    </button>

    <div
      ref="trashTarget"
      data-live="5"
      class="relative mt-auto flex items-center gap-2.5 rounded-lg border border-dashed px-2.5 py-4 transition-colors h-20 justify-center"
      :class="trashArmed ? 'border-primary bg-primary/15 text-highlighted' : 'border-default text-muted'"
    >
      <UIcon
        :name="trashArmed ? 'i-ph-trash-simple-fill' : 'i-ph-trash-simple'"
        class="size-5 shrink-0"
      />
      <span class="hidden sm:inline">Trash</span>
      <AnimeTransition
        mode="out-in"
        :enter-animation="badgeEnter"
        :leave-animation="badgeLeave"
      >
        <span
          v-if="trashCount"
          :key="trashCount"
          class="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-primary text-xs font-semibold text-white sm:static sm:ml-auto"
        >
          {{ trashCount }}
        </span>
      </AnimeTransition>
    </div>

    <div class="hidden flex-col gap-2 px-1 pt-3 pb-1 sm:flex">
      <div class="h-2 overflow-hidden rounded-full bg-elevated">
        <div
          class="h-full rounded-full bg-primary"
          :style="{ width: `${(meter.used / capacity) * 100}%` }"
        />
      </div>
      <span class="text-xs text-muted tabular-nums">{{ round(meter.used, 0) }} MB of {{ capacity }} MB</span>
    </div>
  </aside>
</template>
