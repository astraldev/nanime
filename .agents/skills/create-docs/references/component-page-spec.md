# Component Doc Page Spec

Applies to every page in `docs/content/3.components/`.

Components mirror the composable pages in order and tone, but stay leaner.
Related components share one page: `<AnimeTransition>` and
`<AnimeTransitionGroup>` live together on `1.transitions.md`, the way Vue
documents its own transitions.

## Section order

- Frontmatter, with an `seo:` title and description like every page
- Intro: two sentences max
- `## Usage`: a short static snippet of the drop-in usage, plus one line
  on the default behaviour
- Props table
- One `##` section per real concept (for transitions: Lists), each with
  at most one demo
- Styles get their own page (`2.transition-styles.md`)

No Events, Slots, Caveats, Type reference or See-also sections. Say in one
sentence that the underlying Vue events pass through. Fold a rule like
"one child only" into a sentence that links the right component.

Aim for about 60–100 lines. A page that reads as "everything at once" has
too many demos or too many sections.

## Props table

```markdown
| Prop | Type | Default | Description |
| :--- | :--- | :------ | :---------- |
| `enterAnimation` | `AnimeTransitionStyleName`{lang="ts-type"} or `AnimationParams`{lang="ts-type"} | `'fade'` | How the element appears: a style name, or AnimeJS params. |
```

- Always a table, never a `::field-group`.
- Never put a `|` inside a table cell, escaped or not. Nuxt Studio strips
  the `\|` escape on save, and the cell splits into two columns. Write
  unions as separate code spans joined by "or", and tag each type with
  `{lang="ts-type"}`.
- One-line descriptions that match the prop's JSDoc in the source.
- A second component on the same page lists only its extra or different
  props, then one line saying the rest match the first.

## Demos

Follow [demo-spec.md](demo-spec.md).

Preview only what differs from the baseline or is an edge case. A
component that behaves like Vue's own (`<Transition>` modes, events) gets
a sentence and a link to Vue's docs, not a demo. Moves with no CSS, named
styles and inline keyframe sequences differ, so they get demos.

Use `code: false` when the demo source isn't the lesson. A style player's
source is mostly button wiring, so hide it. Don't put a static snippet
under it either: a snippet fixed to one choice (`enter-animation="slide-up"`)
contradicts the picker, and the page already shows the usage once. Add a
snippet only when it teaches something the page hasn't shown yet, such as
the `app.config.ts` shape. Keep the code visible when it is the lesson,
such as an inline keyframes config.

```markdown
::render-code-block-preview
---
code: false
src: examples/components/TransitionStylesDemo.vue
---
::
```
