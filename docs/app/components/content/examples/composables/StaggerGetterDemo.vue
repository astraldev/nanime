<script setup lang="ts">
import { stagger } from '#nanime/utils'
import ExampleWrapper, { type ExampleAction } from '~/components/shared/ExampleWrapper.vue'

const plain = useTemplateRef('plain')
const getter = useTemplateRef('getter')
const count = ref(4)

const hop = () => ({
  y: [{ to: -16 }, { to: 0 }],
  duration: 600,
  ease: 'out(3)',
  delay: stagger(60),
})

useAnimate(plain, hop())
useAnimate(getter, hop)

function add() {
  count.value++
}

const actions: ExampleAction[] = [
  { label: 'Add item', run: add },
]
</script>

<template>
  <ExampleWrapper :actions="actions">
    <div class="flex flex-col gap-3 font-mono text-xs">
      <div class="flex flex-col gap-1">
        <span>hop()</span>
        <div class="flex gap-2 pt-4">
          <div
            v-for="n in count"
            ref="plain"
            :key="n"
            class="size-6 rounded-lg bg-primary"
          />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <span>hop</span>
        <div class="flex gap-2 pt-4">
          <div
            v-for="n in count"
            ref="getter"
            :key="n"
            class="size-6 rounded-lg bg-primary"
          />
        </div>
      </div>
    </div>
  </ExampleWrapper>
</template>
