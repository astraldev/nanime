# Component Doc Page Spec

Applies to every page in `docs/content/3.components/`.

Components mirror the composable pages in order and tone, but stay leaner.
One page per component: `<AnimeTransition>` on `1.transition.md`,
`<AnimeTransitionGroup>` on `2.transition-group.md`. How defaults resolve
belongs to `/guides/configuration`, linked, never re-explained.

## Section order

- Frontmatter, with an `seo:` title and description like every page
- Intro: two sentences max
- One `##` task section with one demo, headed with a verb. Nothing else
  comes before the API
- `## API`: one `::field-group`, one `::field` per prop
- Further `##` sections, each with at most one demo. Extra snippets go in
  `::collapsible`
- Styles get their own page (`3.transition-styles.md`)
- `## See also`: at most 3 links, always last

No Events, Slots, Caveats or Type reference sections. Say in one
sentence that the underlying Vue events pass through. Fold a rule like
"one child only" into a sentence that links the right component.

Aim for about 60–100 lines. A page that reads as "everything at once" has
too many demos or too many sections.

## Props

```markdown
::field-group
  :::field{name="enterAnimation" type="AnimeTransitionStyleName | AnimationParams"}
  How the element appears: a style name, or AnimeJS params. Defaults to `'fade'`.
  :::
::
```

- Always a `::field-group` under `## API`, never a table and never headings
  that group the props.
- The type goes in the `type` attribute, written as the source writes it.
- State the default last in the description: "Defaults to `x`."
- Put the rule a prop needs inside its own field, not in a paragraph after
  the group.
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
