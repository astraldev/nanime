---
title: Introduction
description: Explore the available composables in nanime.
navigation:
  icon: i-lucide-box
---

`nanime` provides a set of composables that wraps [AnimeJS](https://animejs.com/) utilities.

::u-page-grid
  :::u-page-card
  ---
  icon: i-ph-play-circle
  title: useAnimate
  to: /composables/use-animate
  variant: soft
  ---
  #description
  Reactive wrapper for the [animate]{.text-primary} function
  :::

  :::u-page-card
  ---
  icon: i-ph-lightning
  title: useWaapiAnimate
  to: /composables/use-waapi-animate
  variant: soft
  ---
  #description
  Reactive wrapper for the [waapi.animate]{.text-primary} function
  :::

  :::u-page-card
  ---
  icon: i-ph-cube
  title: useAnimatable
  to: /composables/use-animatable
  variant: soft
  ---
  #description
  Wrapper for the [createAnimatable]{.text-primary} function
  :::

  :::u-page-card
  ---
  icon: i-ph-text-t
  title: useSplitText
  to: /composables/use-split-text
  variant: soft
  ---
  #description
  Wrapper for the [splitText]{.text-primary} utility

  #header
  :::

  :::u-page-card
  ---
  icon: i-ph-layout
  title: useLayout
  to: /composables/use-layout
  variant: soft
  ---
  #description
  Wrapper for the [createLayout]{.text-primary} function
  :::

  :::u-page-card
  ---
  icon: i-ph-hand-grabbing
  title: useDraggable
  to: /composables/use-draggable
  variant: soft
  ---
  #description
  Wrapper for the [createDraggable]{.text-primary} function
  :::
::

## Instant play

Composables marked with the :badge{icon="mage:zap-fill" label="Instant play" size="md" variant="soft"} badge
can be called **instantly** outside of a Vue component's `setup()` block (e.g., inside an event handler or utility function), provided the component has already been mounted.
