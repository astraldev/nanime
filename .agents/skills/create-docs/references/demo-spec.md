# Demo Component Spec

Applies to every live demo in `docs/app/components/content/examples/`
(composables, components, misc, comparison).

Readers see the demo's source in the code preview. `useCodeBlockPreview`
strips the `<ExampleWrapper>` tag, its import, the top-level
`const actions = ...` declaration and any top-level `function <name>Action`
helper. Everything else in the script is shown as the example code. Write
every demo as the smallest idiomatic usage a reader could paste, and keep
`actions` and its helpers top-level with indented bodies so the strip
matches.

## Controls go through ExampleWrapper

- Every button is an entry in `ExampleWrapper`'s `actions` prop:
  `{ label, run, active? }`.
- Pickers (mode, style, variant) are actions too, one per option, with
  `active` marking the current choice. Use the `status` prop to print the
  current choice when it helps.
- Never hand-write `<button class="demo-button">` or a `<select>` inside the
  demo. `ExampleWrapper` renders its actions row inside a `text-xs`
  container, so hand-made controls come out a different size from every
  other demo.
- A slider uses the `slider` prop.
- Every action must show something the moment it's clicked. A picker that
  only changes what the next click will do reads as broken. For styles,
  picking one replays the animation (e.g. bump a `:key`).

## Handlers are named functions

- Logic lives in named functions (`add`, `remove`, `shuffle`, `toggle`).
  The actions reference them: `{ label: 'Shuffle', run: shuffle }`.
- No logic inline in the `actions` array. The preview strips the array, so
  logic written there would vanish from the code readers see.

```ts
// wrong
const actions = [
  { label: 'Shuffle', run: () => (items.value = [...items.value].sort(() => Math.random() - 0.5)) },
]

// right
import { random, shuffle as shuffled } from '#nanime/utils'

function add() {
  items.value.splice(random(0, items.value.length), 0, nextId++)
}

function shuffle() {
  items.value = shuffled([...items.value])
}

const actions: ExampleAction[] = [
  { label: 'Add', run: add },
  { label: 'Shuffle', run: shuffle },
]
```

## Use Anime.js helpers, not hand-rolled code

- Randomness comes from `#nanime/utils`, which re-exports `animejs/utils`:
  `random(min, max)`, `randomPick(array)`, `shuffle(array)`. Check the
  signatures in `node_modules/animejs/dist/modules/utils/` before use.
- No `Math.random()` sorts. No lodash: it isn't installed.
- Stagger, easings and proxies come from `#nanime/utils`,
  `#nanime/easings` and `#nanime/proxies`.

## Visuals

- Solid filled boxes: `rounded-lg bg-primary`. Theme tokens only. Never a
  hex colour, an arbitrary colour class, `bg-elevated` cards or borders.
- Compact. Fixed small sizes (`size-10`, `size-12`) in a `flex flex-wrap`
  or `w-fit` row. Never stretched grid cells that fill the full width.
- A number or label inside a box only when the demo needs it to show order,
  as in a list shuffle.
- Centre content the way a user would: `flex items-center justify-center`
  or `grid place-items-center`. If centring breaks mid-animation, that is a
  library bug. Report it; never work around it in the demo.

## Code

- No comments.
- Strict TypeScript: no `any`, no `as`.
- Auto-imports work (`ref`, `useTemplateRef`, composables, components).
  Import only `#nanime/*` helpers and `ExampleAction` types.
- Descriptive names. Short templates.
- One idea per demo. A page carries few demos: one per section, and only
  where the section needs something to see.
