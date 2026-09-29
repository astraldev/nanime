<script setup lang="ts">
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const questions = [
  { title: 'What is nanime?', answer: 'nanime wraps AnimeJS v4 in Vue composables and components for Nuxt. It resolves template refs to elements, rebuilds animations when their inputs change, and reverts them when the component unmounts.' },
  { title: 'Does it work with SSR?', answer: 'Yes. The composables wait for the component to mount before they touch the DOM, so nothing animates on the server. The server-rendered markup stays as it is until the page hydrates.' },
  { title: 'Which AnimeJS version does it use?', answer: 'AnimeJS v4. Each feature is imported from its own submodule, such as animejs/animation or animejs/layout, and Vite pre-bundles those submodules for development.' },
]

const open = ref<number | null>(0)

function toggle(index: number) {
  open.value = open.value === index ? null : index
}
</script>

<template>
  <ExampleWrapper>
    <AnimeLayoutGroup
      :deps="[open]"
      class="flex w-full max-w-md flex-col gap-2"
    >
      <div
        v-for="(question, index) in questions"
        :key="question.title"
        class="rounded-lg bg-primary text-inverted"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold"
          @click="toggle(index)"
        >
          <span>{{ question.title }}</span>
          <UIcon
            :name="open === index ? 'i-ph-minus-bold' : 'i-ph-plus-bold'"
            class="size-4 shrink-0"
          />
        </button>
        <p
          v-if="open === index"
          class="px-4 pb-4 text-sm"
        >
          {{ question.answer }}
        </p>
      </div>
    </AnimeLayoutGroup>
  </ExampleWrapper>
</template>
