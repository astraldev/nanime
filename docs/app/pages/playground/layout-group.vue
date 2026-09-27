<script setup lang="ts">
import type { NanimeComponentDefaults } from '#nanime/types'

useSeoMeta({ title: 'Layout group playground', robots: 'noindex, nofollow' })

const grid = ref(false)
const clicks = ref(0)

let nextId = 5
const items = ref([1, 2, 3, 4])

function add() {
  items.value.splice(Math.floor(Math.random() * (items.value.length + 1)), 0, nextId++)
}

function remove() {
  if (items.value.length) items.value.splice(Math.floor(Math.random() * items.value.length), 1)
}

const deepConfig = reactive({ wide: false })
const shallowConfig = ref({ wide: false })

const expanded = ref<number | null>(null)

const elementsGrid = ref(false)

const panelShown = ref(true)

const store = reactive({ view: 'column' })

function toggleStoreView() {
  store.view = store.view === 'column' ? 'grid' : 'column'
}

const slowDefaults: NanimeComponentDefaults = {
  layoutGroup: { tag: 'ul', layoutOptions: { duration: 1500, ease: 'out(4)' } },
}
const scopedGrid = ref(false)

const rapid = ref(false)

function chaos() {
  for (let i = 0; i < 10; i++) setTimeout(() => rapid.value = !rapid.value, i * 60)
}

const mounted = ref(true)
const unmountGrid = ref(false)
</script>

<template>
  <UContainer class="py-10 space-y-12">
    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        deps mode
      </h2>
      <p class="text-sm text-muted">
        Toggle layout animates. "Unrelated click" re-renders the children but is not in deps, so nothing animates.
      </p>
      <div class="flex gap-2">
        <UButton
          data-test="deps-toggle"
          @click="grid = !grid"
        >
          Toggle layout
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          data-test="deps-unrelated"
          @click="clicks++"
        >
          Unrelated click ({{ clicks }})
        </UButton>
      </div>
      <AnimeLayoutGroup
        data-test="deps-group"
        :deps="[grid]"
        :class="grid ? 'grid grid-cols-2 gap-2 w-64' : 'flex flex-col gap-2 w-40'"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="rounded-lg bg-primary text-inverted px-4 py-3 font-mono"
        >
          {{ n }}·{{ clicks }}
        </div>
      </AnimeLayoutGroup>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        No deps: every re-render animates
      </h2>
      <p class="text-sm text-muted">
        Adding and removing items animates the rest into place. New items fade in.
      </p>
      <div class="flex gap-2">
        <UButton
          data-test="nodeps-add"
          @click="add"
        >
          Add
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          data-test="nodeps-remove"
          @click="remove"
        >
          Remove
        </UButton>
      </div>
      <AnimeLayoutGroup
        data-test="nodeps-group"
        class="flex flex-wrap gap-2 w-80"
      >
        <div
          v-for="item in items"
          :key="item"
          class="rounded-lg bg-primary text-inverted px-4 py-3 font-mono"
        >
          {{ item }}
        </div>
      </AnimeLayoutGroup>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        Deep vs shallow deps
      </h2>
      <p class="text-sm text-muted">
        Both groups get their config object in deps. Mutating a nested value animates only the deep group. Replacing the object animates the shallow one.
      </p>
      <div class="flex gap-2">
        <UButton
          data-test="deep-mutate"
          @click="deepConfig.wide = !deepConfig.wide"
        >
          Mutate deep config
        </UButton>
        <UButton
          data-test="shallow-mutate"
          @click="shallowConfig.wide = !shallowConfig.wide"
        >
          Mutate shallow config
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          data-test="shallow-replace"
          @click="shallowConfig = { wide: !shallowConfig.wide }"
        >
          Replace shallow config
        </UButton>
      </div>
      <div class="grid grid-cols-2 gap-6">
        <AnimeLayoutGroup
          data-test="deep-group"
          :deps="[deepConfig]"
        >
          <div
            class="rounded-lg bg-primary text-inverted px-4 py-3"
            :class="deepConfig.wide ? 'w-60' : 'w-24'"
          >
            deep
          </div>
        </AnimeLayoutGroup>
        <AnimeLayoutGroup
          data-test="shallow-group"
          :deps="[shallowConfig]"
          shallow
        >
          <div
            class="rounded-lg bg-primary text-inverted px-4 py-3"
            :class="shallowConfig.wide ? 'w-60' : 'w-24'"
          >
            shallow
          </div>
        </AnimeLayoutGroup>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        v-if vs v-show
      </h2>
      <p class="text-sm text-muted">
        One toggle drives both groups. Watch the middle panel as it hides: does it fade out in each, or vanish at once? The boxes below it should slide in both.
      </p>
      <UButton
        data-test="panel-toggle"
        @click="panelShown = !panelShown"
      >
        {{ panelShown ? 'Hide panel' : 'Show panel' }}
      </UButton>
      <div class="grid grid-cols-2 items-start gap-6">
        <div class="space-y-2">
          <p class="font-mono text-sm">
            v-if
          </p>
          <AnimeLayoutGroup
            data-test="vif-group"
            :deps="[panelShown]"
            :layout-options="{ duration: 1200 }"
            class="flex w-40 flex-col gap-2"
          >
            <div class="h-10 rounded-lg bg-primary" />
            <div
              v-if="panelShown"
              data-test="vif-panel"
              class="h-16 rounded-lg bg-primary/40"
            />
            <div
              data-test="vif-below"
              class="h-10 rounded-lg bg-primary"
            />
          </AnimeLayoutGroup>
        </div>
        <div class="space-y-2">
          <p class="font-mono text-sm">
            v-show
          </p>
          <AnimeLayoutGroup
            data-test="vshow-group"
            :deps="[panelShown]"
            :layout-options="{ duration: 1200 }"
            class="flex w-40 flex-col gap-2"
          >
            <div class="h-10 rounded-lg bg-primary" />
            <div
              v-show="panelShown"
              data-test="vshow-panel"
              class="h-16 rounded-lg bg-primary/40"
            />
            <div
              data-test="vshow-below"
              class="h-10 rounded-lg bg-primary"
            />
          </AnimeLayoutGroup>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        elements=".card"
      </h2>
      <p class="text-sm text-muted">
        The first group uses elements=".card, .card span", the second elements=".card". Toggling the first moves only its own cards, and the centred labels slide to the new centre with no vertical drop. The second group must stay untouched.
      </p>
      <UButton
        data-test="elements-toggle"
        @click="elementsGrid = !elementsGrid"
      >
        Toggle first group
      </UButton>
      <div class="grid grid-cols-2 items-start gap-6">
        <AnimeLayoutGroup
          data-test="elements-group-a"
          elements=".card, .card span"
          :deps="[elementsGrid]"
          :class="elementsGrid ? 'grid grid-cols-2 gap-2 w-64' : 'flex flex-col gap-2 w-40'"
        >
          <div
            v-for="n in 4"
            :key="n"
            class="card rounded-lg bg-primary text-inverted px-4 py-3 font-mono text-center"
          >
            <span data-test="elements-label">{{ n }}</span>
          </div>
        </AnimeLayoutGroup>
        <AnimeLayoutGroup
          data-test="elements-group-b"
          elements=".card"
          :deps="[false]"
          class="flex flex-col gap-2 w-40"
        >
          <div
            v-for="n in 4"
            :key="n"
            class="card rounded-lg bg-primary text-inverted px-4 py-3 font-mono"
          >
            {{ n }}
          </div>
        </AnimeLayoutGroup>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        Getter deps
      </h2>
      <p class="text-sm text-muted">
        deps is [() => store.view]. Toggling animates. "Unrelated click" above re-renders the page and creates a new getter, which must not animate.
      </p>
      <UButton
        data-test="getter-toggle"
        @click="toggleStoreView"
      >
        Toggle store view
      </UButton>
      <AnimeLayoutGroup
        data-test="getter-group"
        :deps="[() => store.view]"
        :class="store.view === 'grid' ? 'grid grid-cols-2 gap-2 w-64' : 'flex flex-col gap-2 w-40'"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="rounded-lg bg-primary text-inverted px-4 py-3 font-mono"
        >
          {{ n }}
        </div>
      </AnimeLayoutGroup>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        Expand one card
      </h2>
      <p class="text-sm text-muted">
        Clicking a card grows it and pushes the others. Size and position both animate.
      </p>
      <AnimeLayoutGroup
        data-test="expand-group"
        :deps="[expanded]"
        class="flex flex-wrap gap-2 w-96"
      >
        <button
          v-for="n in 4"
          :key="n"
          type="button"
          class="rounded-lg bg-primary text-inverted px-4 py-3 text-left"
          :class="expanded === n ? 'w-full h-28' : 'w-20 h-14'"
          @click="expanded = expanded === n ? null : n"
        >
          {{ n }}
        </button>
      </AnimeLayoutGroup>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold">
        provideAnimeDefaults
      </h2>
      <p class="text-sm text-muted">
        This group sits in a scope that sets tag="ul" and a 1.5s duration. It should render a ul and move slowly.
      </p>
      <UButton
        data-test="scoped-toggle"
        @click="scopedGrid = !scopedGrid"
      >
        Toggle layout
      </UButton>
      <PlaygroundDefaultsScope :defaults="slowDefaults">
        <AnimeLayoutGroup
          data-test="scoped-group"
          :deps="[scopedGrid]"
          :class="scopedGrid ? 'grid grid-cols-2 gap-2 w-64' : 'flex flex-col gap-2 w-40'"
        >
          <li
            v-for="n in 4"
            :key="n"
            class="rounded-lg bg-primary text-inverted px-4 py-3 font-mono list-none"
          >
            {{ n }}
          </li>
        </AnimeLayoutGroup>
      </PlaygroundDefaultsScope>
    </section>

    <section class="space-y-8">
      <h2 class="text-lg font-semibold">
        Edge cases
      </h2>

      <div class="space-y-4">
        <p class="text-sm text-muted">
          Rapid clicking: Chaos flips the layout 10 times 60ms apart. It should settle in the final layout with nothing stuck mid-move.
        </p>
        <UButton
          data-test="chaos"
          @click="chaos"
        >
          Chaos
        </UButton>
        <AnimeLayoutGroup
          data-test="chaos-group"
          :deps="[rapid]"
          :class="rapid ? 'grid grid-cols-2 gap-2 w-64' : 'flex flex-col gap-2 w-40'"
        >
          <div
            v-for="n in 4"
            :key="n"
            class="rounded-lg bg-primary text-inverted px-4 py-3 font-mono"
          >
            {{ n }}
          </div>
        </AnimeLayoutGroup>
        <p class="text-sm text-muted">
          Same flips with ease out(3) and an inline layout-options object. It should settle with no leftover inline styles.
        </p>
        <AnimeLayoutGroup
          data-test="chaos-out-group"
          :deps="[rapid]"
          :layout-options="{ ease: 'out(3)', duration: 400 }"
          :class="rapid ? 'grid grid-cols-2 gap-2 w-64' : 'flex flex-col gap-2 w-40'"
        >
          <div
            v-for="n in 4"
            :key="n"
            class="rounded-lg bg-primary text-inverted px-4 py-3 font-mono"
          >
            {{ n }}
          </div>
        </AnimeLayoutGroup>
      </div>

      <div class="space-y-4">
        <p class="text-sm text-muted">
          Centred content: the group is centred with grid place-items-center. Items should move from where they are, not from the left edge.
        </p>
        <UButton
          data-test="centred-toggle"
          @click="grid = !grid"
        >
          Toggle layout
        </UButton>
        <div class="grid place-items-center rounded-lg border border-dashed border-default p-6">
          <AnimeLayoutGroup
            :deps="[grid]"
            :class="grid ? 'grid grid-cols-2 gap-2' : 'flex gap-2'"
          >
            <div
              v-for="n in 4"
              :key="n"
              class="rounded-lg bg-primary text-inverted px-4 py-3 font-mono"
            >
              {{ n }}
            </div>
          </AnimeLayoutGroup>
        </div>
      </div>

      <div class="space-y-4">
        <p class="text-sm text-muted">
          User CSS transitions: items have transition-all duration-300. Moves should not lag behind or animate twice.
        </p>
        <UButton @click="grid = !grid">
          Toggle layout
        </UButton>
        <AnimeLayoutGroup
          :deps="[grid]"
          :class="grid ? 'grid grid-cols-2 gap-2 w-64' : 'flex flex-col gap-2 w-40'"
        >
          <div
            v-for="n in 4"
            :key="n"
            class="rounded-lg bg-primary text-inverted px-4 py-3 font-mono transition-all duration-300"
          >
            {{ n }}
          </div>
        </AnimeLayoutGroup>
      </div>

      <div class="space-y-4">
        <p class="text-sm text-muted">
          Revert on unmount: toggle the layout, then unmount mid-move. Remounting should show a clean group with no leftover inline styles.
        </p>
        <div class="flex gap-2">
          <UButton
            data-test="unmount-layout"
            @click="unmountGrid = !unmountGrid"
          >
            Toggle layout
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            data-test="unmount-toggle"
            @click="mounted = !mounted"
          >
            {{ mounted ? 'Unmount' : 'Mount' }}
          </UButton>
        </div>
        <div class="h-40">
          <AnimeLayoutGroup
            v-if="mounted"
            data-test="unmount-group"
            :deps="[unmountGrid]"
            :class="unmountGrid ? 'grid grid-cols-2 gap-2 w-64' : 'flex gap-2'"
          >
            <div
              v-for="n in 4"
              :key="n"
              class="rounded-lg bg-primary text-inverted px-4 py-3 font-mono"
            >
              {{ n }}
            </div>
          </AnimeLayoutGroup>
        </div>
      </div>
    </section>
  </UContainer>
</template>
