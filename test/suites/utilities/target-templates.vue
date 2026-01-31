<template>
  <div>
    <span
      ref="sTarget"
      class="single-target"
    />
    <span
      v-for="i in 4"
      :key="i"
      ref="mTarget"
      class="multiple-target"
    />
    <svg ref="svgTarget">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="red"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'

const sTarget = useTemplateRef('sTarget')
const mTarget = useTemplateRef('mTarget')
const svgTarget = useTemplateRef('svgTarget')

defineExpose({
  sTarget,
  mTarget,
  svgTarget,
})
</script>
