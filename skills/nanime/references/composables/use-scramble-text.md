# `useScrambleText`

Docs: https://nanimejs.netlify.app/composables/use-scramble-text

## Text a composable rewrites must not re-render

`useScrambleText` writes into the element. If Vue also renders the changing
value there, they overwrite each other. Render the first value once and
hand changes to the composable:

```vue
<script setup lang="ts">
useScrambleText(title, {}, () => ({ text: track.value.title }))
</script>

<template>
  <h2 ref="title" v-once>{{ track.title }}</h2>
</template>
```

## Scramble timing goes in the third argument

AnimeJS `scrambleText()` sets its own `duration`, `delay` and `ease`, so the
same keys in the second argument are ignored. Keep the second argument for
playback and callbacks:

```ts
useScrambleText(title, { onComplete: next }, () => ({ text: text.value, duration: 2000 }))
```
