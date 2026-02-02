<template>
  <div class="p-8 space-y-12 text-white [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:font-mono">
    <!-- Section 1: Character Animation -->
    <section>
      <h2>1. Character Animation - Bounce</h2>
      <p class="text-gray-400 mb-4">
        Each character splits and animates independently with stagger
      </p>
      <PWrapper>
        <div
          ref="charTarget"
          class="text-4xl font-bold text-center"
        >
          Hello World!
        </div>
      </PWrapper>
    </section>

    <!-- Section 2: Word Animation -->
    <section>
      <h2>2. Word Animation - Wave Effect</h2>
      <p class="text-gray-400 mb-4">
        Words animate with a wave pattern using sequential stagger
      </p>
      <PWrapper>
        <div
          ref="wordTarget"
          class="text-4xl font-bold text-center"
        >
          The quick brown fox jumps over the lazy dog
        </div>
      </PWrapper>
    </section>

    <!-- Section 3: Line Animation -->
    <section>
      <h2>3. Line Animation - Slide In</h2>
      <p class="text-gray-400 mb-4">
        Multi-line text with each line sliding in from the left
      </p>
      <PWrapper>
        <div
          ref="lineTarget"
          class="text-3xl font-bold max-w-2xl leading-tight"
        >
          Animation brings life to design.<br>
          It guides attention and creates flow.<br>
          Great motion feels effortless and natural.
        </div>
      </PWrapper>
    </section>
  </div>
</template>

<script setup lang="ts">
const { $anime } = useNuxtApp()

// --- Section 1: Character Animation ---
const { chars: charChars } = useSplitText(
  useTemplateRef('charTarget'),
  { chars: true },
)

useAnimate(charChars, {
  y: [
    { to: '-45%', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 },
  ],
  rotate: {
    from: '-1turn',
    duration: 600,
  },
  delay: $anime.utils.stagger(100),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true,
})

// --- Section 2: Word Animation ---
const { words } = useSplitText(
  useTemplateRef('wordTarget'),
  { words: true },
)

useAnimate(words, {
  y: [
    { to: -30, duration: 500 },
    { to: 0, duration: 500 },
  ],
  scale: [
    { to: 1.1, duration: 500 },
    { to: 1, duration: 500 },
  ],
  color: [
    { to: '#61C3FF', duration: 500 },
    { to: '#ffffff', duration: 500 },
  ],
  delay: $anime.utils.stagger(150),
  ease: 'outBack',
  loop: true,
  loopDelay: 500,
})

// --- Section 3: Line Animation ---
const { lines } = useSplitText(
  useTemplateRef('lineTarget'),
  { lines: true },
)

useAnimate(lines, {
  x: [-100, 0],
  opacity: [0, 1],
  duration: 800,
  delay: $anime.utils.stagger(200),
  ease: 'outExpo',
  loop: true,
  loopDelay: 2000,
  alternate: true,
})
</script>
