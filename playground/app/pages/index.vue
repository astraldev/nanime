<template>
  <div class="p-8 max-w-4xl mx-auto space-y-8 my-auto">
    <div class="space-y-4">
      <h2 class="text-3xl font-bold text-white">
        Welcome to the Playground
      </h2>
      <p class="text-gray-400">
        Explore demos
      </p>
    </div>

    <nav class="grid gap-4 sm:grid-cols-2">
      <PDemoCard
        to="/composables/use-animate"
        title="useAnimate Demo"
        description="Explore the useAnimate composable with stagger effects and timeline animations."
      />

      <PDemoCard
        to="/transitions/slide-transition"
        title="Slide Transition"
        description="Interactive demos of slide transitions with useWaapi, modes, and group transitions."
      />

      <PDemoCard
        to="/composables/use-animatable"
        title="useAnimatable Demo"
        description="Interactive examples with mouse interaction and property mixing."
      />

      <PDemoCard
        to="/composables/use-split-text"
        title="useSplitText Demo"
        description="Demonstration of text splitting into lines, words, and chars with animation."
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
</script>
