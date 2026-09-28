<script setup lang="ts">
import { spring } from '#nanime/easings'
import { prices } from '~/examples/road-trip/trip'
import { readyText, revealRate, scrambleChars, settleDuration, useBooking } from '~/examples/road-trip/useBooking'

const iconEnter = {
  opacity: [0, 1],
  scale: [0.6, 1],
  ease: spring({ bounce: 0.2, duration: 300 }),
}

const iconLeave = {
  opacity: 0,
  scale: 0.8,
  duration: 120,
  ease: 'out(2)',
}

const logEnter = {
  opacity: [0, 1],
  y: [8, 0],
  duration: 250,
  ease: 'out(3)',
}

const logLeave = {
  opacity: 0,
  duration: 150,
  ease: 'out(2)',
}

const logMove = {
  duration: 250,
  ease: 'out(3)',
}

const spinParams = {
  rotate: { to: 360 },
  duration: 800,
  ease: 'linear',
  loop: true,
}

const total = prices.reduce((sum, line) => sum + line.amount, 0)

const { state, paused, statusText, finishedSteps, book, togglePause, reset } = useBooking()

const spinner = useTemplateRef('spinner')
const statusLine = useTemplateRef('statusLine')

const spin = useWaapiAnimate(spinner, spinParams)

useScrambleText(statusLine, {}, () => ({
  text: statusText.value,
  chars: scrambleChars,
  settleDuration,
  revealRate,
}))

watch(paused, (isPaused) => {
  if (isPaused) spin.pause()
  else spin.play()
})

defineExpose({ reset })
</script>

<template>
  <aside class="flex flex-col gap-4 rounded-xl border border-default p-4">
    <h3 class="font-semibold text-highlighted">
      Summary
    </h3>

    <dl class="flex flex-col gap-2 text-sm">
      <div
        v-for="line in prices"
        :key="line.label"
        class="flex justify-between text-muted"
      >
        <dt>{{ line.label }}</dt>
        <dd class="tabular-nums">
          ${{ line.amount }}
        </dd>
      </div>
      <div class="flex justify-between border-t border-default pt-2 font-semibold text-highlighted">
        <dt>Total</dt>
        <dd class="tabular-nums">
          ${{ total }}
        </dd>
      </div>
    </dl>

    <button
      type="button"
      disabled
      title="Not part of this example"
      class="flex items-center justify-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-sm text-muted disabled:cursor-not-allowed disabled:opacity-40"
    >
      <UIcon
        name="i-ph-car-profile"
        class="size-4"
      />
      Change car
    </button>

    <div class="flex h-40 flex-col rounded-lg bg-elevated/50 p-3 font-mono text-xs select-none">
      <div class="flex items-center justify-between text-muted">
        <span><span class="font-bold text-primary">$</span> book coast-to-canyon</span>
        <AnimeTransition>
          <span
            v-if="paused"
            class="text-[10px] font-bold tracking-wider text-primary uppercase"
          >
            [paused]
          </span>
        </AnimeTransition>
      </div>

      <AnimeTransitionGroup
        tag="ul"
        class="relative mt-auto flex flex-col gap-1.5"
        :enter-animation="logEnter"
        :leave-animation="logLeave"
        :move-animation="logMove"
      >
        <li
          v-for="step in finishedSteps"
          :key="step.label"
          class="flex items-center gap-2 text-muted"
        >
          <UIcon
            name="i-ph-check-bold"
            class="size-3.5 shrink-0 text-primary"
          />
          <span class="truncate">{{ step.label }}</span>
        </li>
      </AnimeTransitionGroup>

      <div class="mt-1.5 flex items-center gap-2 text-highlighted">
        <div class="grid size-4 shrink-0 place-items-center">
          <AnimeTransition
            mode="out-in"
            :enter-animation="iconEnter"
            :leave-animation="iconLeave"
          >
            <span
              v-if="state === 'running'"
              class="flex text-primary"
            >
              <span
                ref="spinner"
                class="flex"
              >
                <UIcon
                  name="i-ph-spinner-gap"
                  class="size-4"
                />
              </span>
            </span>
            <span
              v-else-if="state === 'done'"
              class="flex text-primary"
            >
              <UIcon
                name="i-ph-check-circle-fill"
                class="size-4"
              />
            </span>
            <span
              v-else
              class="flex text-muted"
            >
              <UIcon
                name="i-ph-caret-right-bold"
                class="size-4"
              />
            </span>
          </AnimeTransition>
        </div>
        <span
          ref="statusLine"
          class="truncate"
        >
          {{ readyText }}
        </span>
      </div>
    </div>

    <div
      data-live="3"
      class="flex gap-2"
    >
      <button
        v-if="state === 'running'"
        type="button"
        class="flex-1 cursor-pointer rounded-lg border border-default px-3 py-2 text-sm font-semibold hover:bg-elevated"
        @click="togglePause"
      >
        {{ paused ? 'Resume' : 'Pause' }}
      </button>
      <button
        v-if="state === 'running'"
        type="button"
        class="cursor-pointer rounded-lg px-3 py-2 text-sm text-muted hover:bg-elevated"
        @click="reset"
      >
        Cancel
      </button>
      <button
        v-else
        type="button"
        class="flex-1 cursor-pointer rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white"
        @click="book"
      >
        {{ state === 'done' ? 'Book again' : 'Book trip' }}
      </button>
    </div>
  </aside>
</template>
