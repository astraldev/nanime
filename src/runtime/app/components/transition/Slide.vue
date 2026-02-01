<script setup lang="ts">
import { TransitionGroup, Transition } from 'vue'
import { isStandardEase, isWaapiEase, type SharedTransitionProps } from './types'
import { animate, utils, waapi } from 'animejs'
import { nextTick, unref, useAnimeLayout, useTemplateRef, computed } from '#imports'
import type { TransitionOffsetInput } from '../../utils/transitions/types'
import { normalizeAxis, normalizeDuration, normalizeOffset } from '../../utils/transitions/normalizers'

type TransitionSlideProp = SharedTransitionProps & {
  axis?: 'x' | 'y'
  offset?: TransitionOffsetInput
}

const props = withDefaults(
  defineProps<TransitionSlideProp>(),
  {
    ease: 'out',
    noOpacity: false,
    useWaapi: true,
    offset: '-20%',
    tag: 'div',
    mode: 'out-in',
    duration: () => ({
      enter: 300,
      leave: 300,
    }),
  },
)

const delays = computed(() => normalizeDuration(props.delay))
const durations = computed(() => normalizeDuration(props.duration))
const offsets = computed(() => normalizeOffset(props.offset))
const axis = computed(() => normalizeAxis(props.axis))

const isGrouped = computed(() => props.group ?? false)
const groupWrapper = useTemplateRef<HTMLElement | null>('group-wrapper')
const groupWrapperRef = computed(() => isGrouped.value ? unref(groupWrapper) : null)
const layoutOptions = computed(() => {
  const ease = isStandardEase(props) ? props.ease : undefined
  const easeString = typeof ease === 'string' ? ease : undefined
  const layoutOptions = 'layoutOptions' in props && props.layoutOptions
  return {
    ...layoutOptions,
    enterFrom: {
      delay: delays.value.enter,
      duration: durations.value.enter,
      ...(axis.value.enter === 'y' && { transform: `translateY(${offsets.value.enter}) scale(0.95)` }),
      ...(axis.value.enter === 'x' && { transform: `translateX(${offsets.value.enter}) scale(0.95)` }),
      ...(!props.noOpacity && { opacity: 0 }),
      ...(easeString && { ease: easeString }),
    },
    leaveTo: {
      delay: delays.value.leave,
      duration: durations.value.leave,
      ...(axis.value.leave === 'y' && { transform: `translateY(${offsets.value.leave}) scale(0.95)` }),
      ...(axis.value.leave === 'x' && { transform: `translateX(${offsets.value.leave}) scale(0.95)` }),
      ...(!props.noOpacity && { opacity: 0 }),
      ...(easeString && { ease: easeString }),
    },
  }
})

const layoutAnimation = useAnimeLayout(groupWrapperRef, layoutOptions)

const onChangeComplete = (callback = () => {}) => {
  layoutAnimation.animate(props.animateOptions, () => {
    callback()
    nextTick(() => {
      layoutAnimation.revert()
    })
  })
}

function onEnter(el: HTMLElement, done: () => void) {
  const sharedEnterOptions = {
    delay: delays.value.enter,
    duration: durations.value.enter,
  } as const

  if (props.useWaapi && !props.group) {
    const ease = isWaapiEase(props) ? props.ease : undefined
    waapi.animate(el, {
      ...sharedEnterOptions,
      ...(axis.value.enter === 'y' && { y: { from: offsets.value.enter } }),
      ...(axis.value.enter === 'x' && { x: { from: offsets.value.enter } }),
      ...(!props.noOpacity && { opacity: { from: 0 } }),
      ...(ease && { ease }),
      onComplete: done,
    })
  }
  else if (!props.group) {
    const ease = isStandardEase(props) ? props.ease : undefined

    utils.set(el, {
      ...(axis.value.enter === 'y' && { y: offsets.value.enter }),
      ...(axis.value.enter === 'x' && { x: offsets.value.enter }),
      ...(!props.noOpacity && { opacity: 0 }),
    })

    animate(el, {
      ...sharedEnterOptions,
      ...(axis.value.enter === 'y' && { y: { to: 0 } }),
      ...(axis.value.enter === 'x' && { x: { to: 0 } }),
      ...(!props.noOpacity && { opacity: { to: 1 } }),
      ...(ease && { ease }),
      onComplete: done,
    })
  }
  else {
    done()
  }
}

function onLeave(el: HTMLElement, done: () => void) {
  const sharedLeaveOptions = {
    delay: delays.value.leave,
    duration: durations.value.leave,
    ...(axis.value.leave === 'y' && { y: { to: offsets.value.leave } }),
    ...(axis.value.leave === 'x' && { x: { to: offsets.value.leave } }),
    ...(!props.noOpacity && { opacity: { to: 0 } }),
  } as const

  if (props.useWaapi && !props.group) {
    const ease = isWaapiEase(props) ? props.ease : undefined
    waapi.animate(el, {
      ...sharedLeaveOptions,
      ...(ease && { ease }),
      onComplete: done,
    })
  }
  else if (!props.group) {
    const ease = isStandardEase(props) ? props.ease : undefined
    animate(el, {
      ...sharedLeaveOptions,
      ...(ease && { ease }),
      onComplete: done,
    })
  }
  else {
    el.style.display = 'none'
    onChangeComplete(() => {
      el.style.display = ''
      done()
    })
  }
}

// Bound css
// const moveDuration = computed(() => `${durations.value.leave}ms`);
// const moveDelay = computed(() => `${delays.value.leave}ms`);
// const moveEase = computed(() => props.moveEase || 'out');
</script>

<template>
  <component
    :is="isGrouped ? TransitionGroup : Transition"
    :ref="isGrouped ? 'group-wrapper' : undefined"
    :mode="!isGrouped ? props.mode : undefined"
    :tag="isGrouped ? props.tag : undefined"
    @before-enter="isGrouped && layoutAnimation.record()"
    @enter="onEnter"
    @after-enter="() => onChangeComplete()"
    @before-leave="isGrouped && layoutAnimation.record()"
    @leave="onLeave"
  >
    <slot />
  </component>
</template>
