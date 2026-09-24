<script setup lang="ts">
import type { AnimationParams } from '#nanime/types'

useSeoMeta({ title: 'Transitions playground', robots: 'noindex, nofollow' })

const show = ref(true)

const views = ['Alpha', 'Beta', 'Gamma']
const view = ref(0)

const swapEnter: AnimationParams = { opacity: [0, 1], translateX: [24, 0], duration: 350, ease: 'out(3)' }
const swapLeave: AnimationParams = { opacity: 0, translateX: -24, duration: 250, ease: 'in(3)' }

const listEnter: AnimationParams = { opacity: [0, 1], scale: [0.6, 1], duration: 400, ease: 'out(3)' }
const listLeave: AnimationParams = { opacity: 0, scale: 0.6, duration: 300, ease: 'in(3)' }

const builtinStyles = ['fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale']
const styleShown = reactive<Record<string, boolean>>(Object.fromEntries(builtinStyles.map(name => [name, true])))
const swapView = ref(0)
const inlineShown = ref(true)

// `pop` is defined in app/app.config.ts.
const popItems = ref([1, 2, 3, 4])

function popAdd() {
  popItems.value.splice(Math.floor(Math.random() * (popItems.value.length + 1)), 0, nextId++)
}

function popRemove() {
  popItems.value.splice(Math.floor(Math.random() * popItems.value.length), 1)
}

let nextId = 6
const items = ref([1, 2, 3, 4, 5])

function add() {
  const at = Math.floor(Math.random() * (items.value.length + 1))
  items.value.splice(at, 0, nextId++)
}

function remove() {
  if (!items.value.length) return
  items.value.splice(Math.floor(Math.random() * items.value.length), 1)
}

function removeItem(id: number) {
  items.value = items.value.filter(item => item !== id)
}

function shuffled(list: number[]) {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = next[i]
    const other = next[j]
    if (current === undefined || other === undefined) continue
    next[i] = other
    next[j] = current
  }
  return next
}

function shuffle() {
  items.value = shuffled(items.value)
}

interface EdgeCase {
  title: string
  caption: string
  items: number[]
  itemClass?: string
  itemStyle?: Record<string, string>
  enter?: AnimationParams
  leave?: AnimationParams
  absoluteLeave?: boolean
  siblings?: boolean
  action?: { label: string, run: (edge: EdgeCase) => void }
}

const edge = {
  add(c: EdgeCase) {
    c.items.splice(Math.floor(Math.random() * (c.items.length + 1)), 0, nextId++)
  },
  remove(c: EdgeCase) {
    if (c.items.length) c.items.splice(Math.floor(Math.random() * c.items.length), 1)
  },
  shuffle(c: EdgeCase) {
    c.items = shuffled(c.items)
  },
}

const edgeCases = reactive<EdgeCase[]>([
  {
    title: 'Tailwind transition class',
    caption: 'Items have transition-all duration-300. Moves and enters should not lag behind or animate twice.',
    items: [1, 2, 3, 4],
    itemClass: 'transition-all duration-300',
  },
  {
    title: 'User inline style',
    caption: 'Items have :style rotate(8deg). They should stay rotated through enters, leaves and moves.',
    items: [1, 2, 3, 4],
    itemStyle: { transform: 'rotate(8deg)' },
  },
  {
    title: 'Enter/leave on a property layout records',
    caption: 'Enter and leave animate fontSize, which layout also records. Watch items that move while still growing.',
    items: [1, 2, 3, 4],
    enter: { opacity: [0, 1], fontSize: ['4px', '16px'], duration: 600, ease: 'out(3)' },
    leave: { opacity: 0, fontSize: '4px', duration: 400, ease: 'in(3)' },
  },
  {
    title: 'Reorder while entering',
    caption: 'Adds 3 items and shuffles in the same tick. New items should keep fading in while everything moves.',
    items: [1, 2, 3, 4],
    action: {
      label: 'Add 3 + shuffle',
      run(c) {
        for (let i = 0; i < 3; i++) edge.add(c)
        edge.shuffle(c)
      },
    },
  },
  {
    title: ':absolute-leave="false"',
    caption: 'Leaving items keep their slot until the leave ends, then the rest close the gap.',
    items: [1, 2, 3, 4],
    absoluteLeave: false,
  },
  {
    title: 'Siblings next to the group',
    caption: 'The dashed boxes sit outside the group. They must never be animated by it.',
    items: [1, 2, 3, 4],
    siblings: true,
  },
  {
    title: 'Rapid clicking',
    caption: 'Chaos fires 10 random add/remove/shuffle operations 50ms apart. The list should settle with no stuck or duplicated items.',
    items: [1, 2, 3, 4],
    action: {
      label: 'Chaos',
      run(c) {
        const ops = [edge.add, edge.remove, edge.shuffle]
        for (let i = 0; i < 10; i++) {
          setTimeout(() => ops[Math.floor(Math.random() * ops.length)]?.(c), i * 50)
        }
      },
    },
  },
])
</script>

<template>
  <UContainer class="py-10 space-y-12">
    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        v-if toggle
      </h2>
      <UButton
        data-test="toggle"
        @click="show = !show"
      >
        Toggle
      </UButton>
      <div class="h-24">
        <AnimeTransition>
          <div
            v-if="show"
            data-test="toggle-box"
            class="size-24 rounded-lg bg-primary"
          />
        </AnimeTransition>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        Keyed swap, mode="out-in"
      </h2>
      <UButton
        data-test="swap"
        @click="view = (view + 1) % views.length"
      >
        Next
      </UButton>
      <div class="h-16">
        <AnimeTransition
          mode="out-in"
          :enter-animation="swapEnter"
          :leave-animation="swapLeave"
        >
          <div
            :key="view"
            data-test="swap-view"
            class="inline-block rounded-lg border border-default px-6 py-4 font-mono"
          >
            {{ views[view] }}
          </div>
        </AnimeTransition>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        List
      </h2>
      <div class="flex gap-2">
        <UButton
          data-test="add"
          @click="add"
        >
          Add
        </UButton>
        <UButton
          data-test="remove"
          @click="remove"
        >
          Remove
        </UButton>
        <UButton
          data-test="shuffle"
          @click="shuffle"
        >
          Shuffle
        </UButton>
      </div>
      <AnimeTransitionGroup
        tag="ul"
        class="relative flex flex-wrap gap-3"
        :enter-animation="listEnter"
        :leave-animation="listLeave"
      >
        <li
          v-for="item in items"
          :key="item"
          data-test="list-item"
          class="flex size-16 cursor-pointer items-center justify-center rounded-lg bg-elevated font-mono"
          @click="removeItem(item)"
        >
          {{ item }}
        </li>
      </AnimeTransitionGroup>
    </section>

    <section class="space-y-6">
      <h2 class="text-lg font-semibold">
        Styles
      </h2>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="name in builtinStyles"
          :key="name"
          class="space-y-2"
        >
          <UButton
            size="sm"
            :data-test="`style-${name}`"
            @click="styleShown[name] = !styleShown[name]"
          >
            {{ name }}
          </UButton>
          <div class="h-20">
            <AnimeTransition
              :enter-animation="name"
              :leave-animation="name"
            >
              <div
                v-if="styleShown[name]"
                class="size-16 rounded-lg bg-primary"
              />
            </AnimeTransition>
          </div>
        </div>

        <div class="space-y-2">
          <UButton
            size="sm"
            data-test="style-swap"
            @click="swapView = (swapView + 1) % views.length"
          >
            swap (out-in)
          </UButton>
          <div class="h-20">
            <AnimeTransition
              mode="out-in"
              enter-animation="swap"
              leave-animation="swap"
            >
              <div
                :key="swapView"
                class="inline-block rounded-lg border border-default px-4 py-3 font-mono"
              >
                {{ views[swapView] }}
              </div>
            </AnimeTransition>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="font-medium">
          Inline objects
        </h3>
        <UButton
          size="sm"
          data-test="style-inline"
          @click="inlineShown = !inlineShown"
        >
          Toggle
        </UButton>
        <div class="h-20">
          <AnimeTransition
            :enter-animation="{ opacity: [0, 1], rotate: [-90, 0], scale: [0.5, 1], duration: 500, ease: 'out(4)' }"
            leave-animation="slide-right"
          >
            <div
              v-if="inlineShown"
              class="size-16 rounded-lg bg-secondary"
            />
          </AnimeTransition>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="font-medium">
          Custom style from app.config.ts: pop
        </h3>
        <div class="flex gap-2">
          <UButton
            size="sm"
            @click="popAdd"
          >
            Add
          </UButton>
          <UButton
            size="sm"
            @click="popRemove"
          >
            Remove
          </UButton>
          <UButton
            size="sm"
            @click="popItems = shuffled(popItems)"
          >
            Shuffle
          </UButton>
        </div>
        <AnimeTransitionGroup
          class="relative flex flex-wrap gap-3"
          enter-animation="pop"
          leave-animation="pop"
          move-animation="pop"
        >
          <div
            v-for="item in popItems"
            :key="item"
            class="flex size-12 items-center justify-center rounded-lg bg-elevated font-mono"
          >
            {{ item }}
          </div>
        </AnimeTransitionGroup>
      </div>
    </section>

    <section class="space-y-8">
      <h2 class="text-lg font-semibold">
        Edge cases
      </h2>
      <div
        v-for="c in edgeCases"
        :key="c.title"
        class="space-y-3"
      >
        <h3 class="font-medium">
          {{ c.title }}
        </h3>
        <p class="text-sm text-muted">
          {{ c.caption }}
        </p>
        <div class="flex gap-2">
          <UButton
            size="sm"
            @click="edge.add(c)"
          >
            Add
          </UButton>
          <UButton
            size="sm"
            @click="edge.remove(c)"
          >
            Remove
          </UButton>
          <UButton
            size="sm"
            @click="edge.shuffle(c)"
          >
            Shuffle
          </UButton>
          <UButton
            v-if="c.action"
            size="sm"
            color="neutral"
            @click="c.action.run(c)"
          >
            {{ c.action.label }}
          </UButton>
        </div>
        <div class="flex items-center gap-3">
          <div
            v-if="c.siblings"
            class="size-12 shrink-0 rounded-lg border border-dashed border-default"
          />
          <AnimeTransitionGroup
            class="relative flex flex-wrap gap-3"
            :enter-animation="c.enter ?? listEnter"
            :leave-animation="c.leave ?? listLeave"
            :absolute-leave="c.absoluteLeave ?? true"
          >
            <div
              v-for="item in c.items"
              :key="item"
              class="flex size-12 cursor-pointer items-center justify-center rounded-lg bg-elevated font-mono"
              :class="c.itemClass"
              :style="c.itemStyle"
              @click="c.items = c.items.filter(i => i !== item)"
            >
              {{ item }}
            </div>
          </AnimeTransitionGroup>
          <div
            v-if="c.siblings"
            class="size-12 shrink-0 rounded-lg border border-dashed border-default"
          />
        </div>
      </div>
    </section>
  </UContainer>
</template>
