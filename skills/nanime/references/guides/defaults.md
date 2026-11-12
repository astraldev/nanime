# Defaults

Docs: https://nanimejs.netlify.app/guides/defaults

## Component defaults

Default props for `<AnimeTransition>`, `<AnimeTransitionGroup>` and
`<AnimeLayoutGroup>` go in `app.config.ts` under `nanime.components`, keyed
`transition`, `transitionGroup` and `layoutGroup`:

```ts
export default defineAppConfig({
  nanime: {
    components: {
      transition: { enterAnimation: 'slide-up' },
      transitionGroup: { moveAnimation: { duration: 300 } },
    },
  },
})
```

`provideAnimeDefaults({ ... })` takes the same shape and applies to the
calling component's subtree. A prop passed to the component always wins. A
provider's entry for a component replaces an outer call's entry for it
whole, and is merged per prop over the one in app config. In app config,
`layoutGroup.elements` takes selectors only.
