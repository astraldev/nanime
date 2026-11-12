# Transition styles

Docs: https://nanimejs.netlify.app/components/transition-styles

## Styles

Built-ins: `fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`,
`scale`, `swap`. Inline params beat a name. An unknown name logs a warning
and falls back to the component's own default: `fade` on `<AnimeTransition>`,
the group's defaults on `<AnimeTransitionGroup>`. The same goes for a style
that lacks the part asked for: no built-in style has a `move`, so
`move-animation="fade"` moves with the group's 350ms `out(3)`.

Define your own in `app.config.ts`, never `nuxt.config.ts`. A style can set
`enter`, `leave` and `move`, and a style named like a built-in replaces it.

```ts
export default defineAppConfig({
  nanime: {
    transitions: {
      pop: {
        enter: { opacity: [0, 1], scale: [0.4, 1], duration: 500, ease: 'outBack(3)' },
        leave: { opacity: 0, scale: 0.4, duration: 250 },
        move: { duration: 300, ease: 'out(3)' },
      },
    },
  },
})
```

Inline params take any Anime.js param, including `keyframes`:

```vue
<AnimeTransition :leave-animation="{ keyframes: [{ x: -8, duration: 80 }, { x: 8, duration: 80 }, { opacity: 0, scale: 1.6, duration: 300 }] }">
  <div v-if="visible" />
</AnimeTransition>
```
