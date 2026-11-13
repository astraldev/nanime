<script setup lang="ts">
import ExampleWrapper from '~/components/shared/ExampleWrapper.vue'

const box = useTemplateRef('box')

const animator = useAnimatable(box, {
  x: 400,
  y: 400,
  ease: 'outQuad',
})

function follow(event: PointerEvent) {
  animator.x?.(event.offsetX - 20)
  animator.y?.(event.offsetY - 20)
}
</script>

<template>
  <ExampleWrapper>
    <div
      class="relative h-48 w-full overflow-hidden rounded-lg"
      @pointermove="follow"
    >
      <div
        ref="box"
        class="pointer-events-none size-10 rounded-lg bg-primary"
      />
    </div>
  </ExampleWrapper>
</template>
