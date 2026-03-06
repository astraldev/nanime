---
title: Introduction
description: Explore the available composables in nanime.
navigation:
  icon: i-lucide-box
---

`nanime` provides a set of composables that wraps [AnimeJS](https://animejs.com/) utilities.

::u-page-grid
  :::u-page-card{to="/composables/use-animate" icon="i-ph-play-circle" title="useAnimate" variant="soft"}
  #description
  Reactive wrapper for the [animate]{.text-primary} function 
  :::

  :::u-page-card{to="/composables/use-waapi-animate" icon="i-ph-lightning" title="useWaapiAnimate" variant="soft"}
  #description
  Reactive wrapper for the [waapi.animate]{.text-primary} function
  :::

  :::u-page-card{to="/composables/use-animatable" icon="i-ph-cube" title="useAnimatable" variant="soft"}
  #description
  Wrapper for the [createAnimatable]{.text-primary} function
  :::

  :::u-page-card{to="/composables/use-split-text" icon="i-ph-text-t" title="useSplitText" variant="soft"}
  #description
  Wrapper for the [splitText]{.text-primary} utility
  :::

  :::u-page-card{to="/composables/use-layout" icon="i-ph-layout" title="useLayout" variant="soft"}
  #description
  Wrapper for the [createLayout]{.text-primary} function
  :::

  :::u-page-card{to="/composables/use-draggable" icon="i-ph-hand-grabbing" title="useDraggable" variant="soft"}
  #description
  Wrapper for the [createDraggable]{.text-primary} function
  :::
::

## Instant play

Composables marked with the :badge{icon="mage:zap-fill" size="sm" variant="soft" label="Instant Play"}
badge support being called **instantly**.

This means they can be called outside of a Vue component's `setup()` block (e.g., inside an event handler or a utility function), provided the component has already been mounted.
