# Accessibility: reduced motion

Docs: https://nanimejs.netlify.app/guides/accessibility

`nanime.reducedMotion` in `nuxt.config.ts` takes `'never'` (default),
`'system'` (follows `prefers-reduced-motion`) or `'always'`. When motion is
reduced, animations from the composables, transitions and groups jump to
their end state. `useDraggable` and `useAnimeScroll` are not affected. To
let visitors choose, call `updateAppConfig({ nanime: { reducedMotion } })`.
Don't add your own `prefers-reduced-motion` checks around nanime calls.
