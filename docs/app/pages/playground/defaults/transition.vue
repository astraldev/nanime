<script setup lang="ts">
import type { AnimeTransitionMode } from '#nanime/types'
import type { CompareColumn, TuningSlider } from '~/utils/playground'

useSeoMeta({ title: 'AnimeTransition defaults playground', robots: 'noindex, nofollow' })

const tuning = ref({ crossfadeDuration: 300 })

const sliders: TuningSlider<'crossfadeDuration'>[] = [
  { key: 'crossfadeDuration', label: 'Crossfade duration', min: 100, max: 800, step: 10, unit: 'ms' },
]

const modes: { value: AnimeTransitionMode, hint: string }[] = [
  { value: 'default', hint: 'The old element leaves while the new one enters.' },
  { value: 'out-in', hint: 'The old element leaves first, then the new one enters.' },
  { value: 'in-out', hint: 'The new element enters first, then the old one leaves.' },
]
const mode = ref<AnimeTransitionMode>('default')
const modeHint = computed(() => modes.find(item => item.value === mode.value)?.hint)

const stacked = ref(true)
const swapClass = computed(() => stacked.value ? 'grid *:col-start-1 *:row-start-1' : 'grid')

const columns = computed<CompareColumn[]>(() => [
  {
    badge: 'Current',
    name: 'fade',
    lines: ['enter: opacity 300ms out(3)', 'leave: opacity 200ms in(3)', `mode: ${mode.value}`],
    defaults: {
      transition: {
        enterAnimation: 'fade',
        leaveAnimation: 'fade',
        mode: mode.value,
      },
    },
  },
  {
    badge: 'Proposed',
    name: 'crossfade',
    lines: [
      `enter: opacity ${tuning.value.crossfadeDuration}ms inOut(2)`,
      `leave: opacity ${tuning.value.crossfadeDuration}ms inOut(2)`,
      `mode: ${mode.value}`,
    ],
    defaults: {
      transition: {
        enterAnimation: { opacity: [0, 1], duration: tuning.value.crossfadeDuration, ease: 'inOut(2)' },
        leaveAnimation: { opacity: 0, duration: tuning.value.crossfadeDuration, ease: 'inOut(2)' },
        mode: mode.value,
      },
    },
  },
])

function later(ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (run: () => void) => {
    clearTimeout(timer)
    timer = setTimeout(run, ms)
  }
}

const modalOpen = ref(false)

const menuOpen = ref(false)
const menuItems = ['Rename', 'Duplicate', 'Move to…', 'Archive']

const tooltipShown = ref(false)

const toastShown = ref(false)
const hideToast = later(2000)

function save() {
  toastShown.value = true
  hideToast(() => toastShown.value = false)
}

const email = ref('')
const emailInvalid = computed(() => email.value.length > 0 && !email.value.includes('@'))

const tabs = [
  { label: 'Account', lines: ['Name', 'Username'] },
  { label: 'Password', lines: ['Current password', 'New password', 'Confirm password'] },
  { label: 'Billing', lines: ['Card'] },
]
const activeTab = ref(0)
const tab = computed(() => tabs[activeTab.value])

const loading = ref(false)
const finishLoading = later(1200)

function reload() {
  loading.value = true
  finishLoading(() => loading.value = false)
}

const copied = ref(false)
const resetCopied = later(1500)

function copy() {
  copied.value = true
  resetCopied(() => copied.value = false)
}

const slides = [
  { title: 'Lisbon', class: 'bg-amber-500' },
  { title: 'Kyoto', class: 'bg-rose-500' },
  { title: 'Reykjavík', class: 'bg-sky-500' },
  { title: 'Marrakesh', class: 'bg-emerald-500' },
]
const slideIndex = ref(0)
const slide = computed(() => slides[slideIndex.value])

function step(by: number) {
  slideIndex.value = (slideIndex.value + by + slides.length) % slides.length
}

const detailsOpen = ref(false)
</script>

<template>
  <UContainer class="py-10 space-y-12">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">
        AnimeTransition defaults
      </h1>
      <p class="text-sm text-muted">
        Each section is one real use case, run with the current default on the left and the proposed one on the right. The components inside take no animation props; the column sets the defaults. Both columns share state, so one click runs both.
      </p>
    </header>

    <PlaygroundTuning
      v-model="tuning"
      :columns="columns"
      :sliders="sliders"
    >
      <div class="space-y-1 text-sm">
        <p>Mode <span class="text-muted">(swap sections only)</span></p>
        <PlaygroundChoice
          v-model="mode"
          :options="modes.map(item => item.value)"
        />
        <p class="text-xs text-muted">
          {{ modeHint }}
        </p>
      </div>
      <div class="space-y-1 text-sm">
        <p>Swap layout <span class="text-muted">(swap sections only)</span></p>
        <PlaygroundChoice
          v-model="stacked"
          :options="[true, false]"
          :label="value => value ? 'Stacked in one cell' : 'Normal flow'"
        />
        <p class="text-xs text-muted">
          {{ stacked ? 'Old and new elements overlap in one grid cell.' : 'Old and new elements sit one after the other while both are in the page.' }}
        </p>
      </div>
    </PlaygroundTuning>

    <PlaygroundCompare
      title="Modal dialog"
      caption="Backdrop and dialog are two v-if elements. Open it, then close it with Cancel, Delete or a click on the backdrop."
      :columns="columns"
    >
      <div class="relative h-56 overflow-hidden rounded-md bg-elevated/50 p-4">
        <UButton
          color="error"
          variant="soft"
          @click="modalOpen = true"
        >
          Delete project
        </UButton>
        <AnimeTransition>
          <div
            v-if="modalOpen"
            class="absolute inset-0 bg-black/50"
            @click="modalOpen = false"
          />
        </AnimeTransition>
        <AnimeTransition>
          <div
            v-if="modalOpen"
            class="absolute inset-x-6 top-8 space-y-3 rounded-lg bg-default p-4 shadow-xl"
          >
            <p class="font-semibold">
              Delete this project?
            </p>
            <p class="text-sm text-muted">
              This removes every file in it.
            </p>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                @click="modalOpen = false"
              >
                Cancel
              </UButton>
              <UButton
                color="error"
                @click="modalOpen = false"
              >
                Delete
              </UButton>
            </div>
          </div>
        </AnimeTransition>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Dropdown menu"
      caption="A menu that opens under its button. Open it, then pick an item or press the button again."
      :columns="columns"
    >
      <div class="relative h-56 rounded-md bg-elevated/50 p-4">
        <div class="relative inline-block">
          <UButton
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-down"
            @click="menuOpen = !menuOpen"
          >
            Options
          </UButton>
          <AnimeTransition>
            <ul
              v-if="menuOpen"
              class="absolute left-0 top-full z-10 mt-1 w-44 rounded-md border border-default bg-default p-1 shadow-lg"
            >
              <li
                v-for="item in menuItems"
                :key="item"
              >
                <button
                  class="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-elevated"
                  @click="menuOpen = false"
                >
                  {{ item }}
                </button>
              </li>
            </ul>
          </AnimeTransition>
        </div>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Tooltip"
      caption="Hover the icon. A tooltip should appear and go without drawing attention to itself, even when you move in and out quickly."
      :columns="columns"
    >
      <div class="flex h-32 items-end justify-center rounded-md bg-elevated/50 p-4">
        <div class="relative">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-info"
            @mouseenter="tooltipShown = true"
            @mouseleave="tooltipShown = false"
          />
          <AnimeTransition>
            <span
              v-if="tooltipShown"
              class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-inverted px-2 py-1 text-xs text-inverted"
            >
              Shared with 3 people
            </span>
          </AnimeTransition>
        </div>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Toast after an action"
      caption="Save shows a confirmation that hides itself after 2 seconds. Click Save again while it is showing."
      :columns="columns"
    >
      <div class="relative h-40 rounded-md bg-elevated/50 p-4">
        <UButton @click="save">
          Save changes
        </UButton>
        <AnimeTransition>
          <div
            v-if="toastShown"
            class="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-default bg-default px-3 py-2 text-sm shadow-lg"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="text-primary"
            />
            Changes saved
          </div>
        </AnimeTransition>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Validation message"
      caption="Type something without an @. The error appears in the flow of the form and pushes the button down."
      :columns="columns"
    >
      <div class="space-y-2 rounded-md bg-elevated/50 p-4">
        <UInput
          v-model="email"
          placeholder="Email"
          class="w-full"
        />
        <AnimeTransition>
          <p
            v-if="emailInvalid"
            class="text-sm text-error"
          >
            Enter a valid email address.
          </p>
        </AnimeTransition>
        <UButton block>
          Subscribe
        </UButton>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Tabs"
      caption="Swap. Switch tabs; the panels have different heights. Follows the mode and swap layout controls."
      :columns="columns"
    >
      <div class="space-y-3 rounded-md bg-elevated/50 p-4">
        <div class="flex gap-1">
          <UButton
            v-for="(item, index) in tabs"
            :key="item.label"
            size="sm"
            :color="index === activeTab ? 'primary' : 'neutral'"
            :variant="index === activeTab ? 'soft' : 'ghost'"
            @click="activeTab = index"
          >
            {{ item.label }}
          </UButton>
        </div>
        <div
          class="min-h-44"
          :class="swapClass"
        >
          <AnimeTransition>
            <div
              :key="activeTab"
              class="space-y-2 self-start"
            >
              <div
                v-for="line in tab?.lines"
                :key="line"
                class="space-y-1"
              >
                <p class="text-xs text-muted">
                  {{ line }}
                </p>
                <div class="h-8 rounded border border-default bg-default" />
              </div>
            </div>
          </AnimeTransition>
        </div>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Loading to content"
      caption="Swap. Reload shows a skeleton for 1.2 seconds, then the content replaces it. Follows the mode and swap layout controls."
      :columns="columns"
    >
      <div class="space-y-3 rounded-md bg-elevated/50 p-4">
        <UButton
          size="sm"
          color="neutral"
          variant="outline"
          icon="i-lucide-refresh-cw"
          @click="reload"
        >
          Reload
        </UButton>
        <div :class="swapClass">
          <AnimeTransition>
            <div
              v-if="loading"
              class="flex gap-3"
            >
              <div class="size-12 rounded-full bg-accented" />
              <div class="flex-1 space-y-2 pt-1">
                <div class="h-3 w-1/2 rounded bg-accented" />
                <div class="h-3 w-3/4 rounded bg-accented" />
              </div>
            </div>
            <div
              v-else
              class="flex gap-3"
            >
              <div class="grid size-12 place-items-center rounded-full bg-primary font-semibold text-inverted">
                AK
              </div>
              <div class="flex-1 text-sm">
                <p class="font-medium">
                  Ada Kowalski
                </p>
                <p class="text-muted">
                  Joined the workspace today
                </p>
              </div>
            </div>
          </AnimeTransition>
        </div>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Button label"
      caption="Swap. Copy changes the label to Copied for 1.5 seconds. Follows the mode and swap layout controls."
      :columns="columns"
    >
      <div class="rounded-md bg-elevated/50 p-4">
        <UButton
          color="neutral"
          variant="outline"
          @click="copy"
        >
          <span :class="swapClass">
            <AnimeTransition>
              <span
                v-if="copied"
                class="flex items-center gap-1.5"
              >
                <UIcon name="i-lucide-check" />
                Copied
              </span>
              <span
                v-else
                class="flex items-center gap-1.5"
              >
                <UIcon name="i-lucide-link" />
                Copy link
              </span>
            </AnimeTransition>
          </span>
        </UButton>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Image carousel"
      caption="Swap. Step through the slides, and click quickly to interrupt. Follows the mode and swap layout controls."
      :columns="columns"
    >
      <div class="space-y-3 rounded-md bg-elevated/50 p-4">
        <div
          class="overflow-hidden rounded-lg"
          :class="swapClass"
        >
          <AnimeTransition>
            <div
              :key="slideIndex"
              class="flex aspect-video items-end p-3 font-semibold text-inverted"
              :class="slide?.class"
            >
              {{ slide?.title }}
            </div>
          </AnimeTransition>
        </div>
        <div class="flex justify-between">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-left"
            @click="step(-1)"
          />
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-right"
            @click="step(1)"
          />
        </div>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Show more"
      caption="A details block toggled in the flow of a card. The text below it jumps, since AnimeTransition does not animate height."
      :columns="columns"
    >
      <div class="space-y-3 rounded-md bg-elevated/50 p-4 text-sm">
        <p class="font-medium">
          Order #1042
        </p>
        <AnimeTransition>
          <dl
            v-if="detailsOpen"
            class="grid grid-cols-2 gap-1 text-muted"
          >
            <dt>Items</dt>
            <dd>3</dd>
            <dt>Shipping</dt>
            <dd>Express</dd>
            <dt>Total</dt>
            <dd>€84.00</dd>
          </dl>
        </AnimeTransition>
        <UButton
          size="sm"
          color="neutral"
          variant="link"
          class="px-0"
          @click="detailsOpen = !detailsOpen"
        >
          {{ detailsOpen ? 'Hide details' : 'Show details' }}
        </UButton>
      </div>
    </PlaygroundCompare>
  </UContainer>
</template>
