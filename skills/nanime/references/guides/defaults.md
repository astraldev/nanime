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

## Composable defaults

`nanime.composables` sets default params for `useAnimate` (`animate`) and
`useDraggable` (`draggable`). A key passed in the call replaces the same key
in the default, and a key passed as `undefined` keeps the default.
`nanime.rebuild` sets the default `rebuild`. Both also go in
`provideAnimeDefaults({ composables, rebuild })`.

## Presets

A preset bundles transition styles, component defaults and composable
defaults. Pass the imported object, not a name:

```ts
import formal from 'nanime/presets/formal'

export default defineAppConfig({
  nanime: { preset: formal },
})
```

Built-in: `nanime/presets/formal`, `nanime/presets/elegant`,
`nanime/presets/playful`. Each redefines the built-in style names and adds a
`list` style that `<AnimeTransitionGroup>` uses by default.
`provideAnimeDefaults({ preset })` replaces the preset for the calling
component's subtree. Type a custom preset with `AnimationPreset` from
`#nanime/types`. It needs `components` (all three entries, each may be `{}`)
and `composables`, with optional `shared` styles.

Docs: https://nanimejs.netlify.app/guides/presets

## Which value wins

Each setting comes from the first of these that sets it: the prop or
parameter passed, `provideAnimeDefaults()`, `app.config.ts`, the preset, the
built-in value. A style name is looked up in `nanime.transitions`, then the
preset's `shared` styles, then the built-ins.
