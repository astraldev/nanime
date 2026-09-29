# Composable Doc Page Spec

Applies to every page in `docs/content/2.composables/`.

One definition per type. Expanded in place. Ordered concrete -> abstract.

## Section order

No other top-level headings.

- Frontmatter
- Badge row
- Intro
- `## Usage` (required)
- `## Signature` (required)
- `## Parameters` (required)
- `## Returns` (required)
- `## Caveats` (omit only if there are genuinely none)
- `## Type reference` (appendix; omit if page owns no Nanime types)
- `## See also` (required, always last)

## Frontmatter

- `title`: exact export name, camelCase
- `description`: verb-first, one line, ends with a period, names the AnimeJS fn
- `navigation.icon`: `i-ph-*` only

## What a page documents

A page documents the `nanime` layer: what the composable accepts that
AnimeJS does not (refs, getters, template refs), when it builds, rebuilds
and reverts, what the returned proxy changes, and the gotchas `nanime`
causes. Everything AnimeJS already documents (its options, their defaults,
its methods, its properties) is linked, never copied. A reader who needs
`dragSpeed` or `stretch()` reads the AnimeJS page for it.

## Badge row

- `Instant play` -> composable supports instant mode, linked to
  `/composables/introduction#instant-play`
- `Buffered` -> composable returns a buffered proxy, linked to
  `/composables/introduction#buffered`
- Both, in that order, when both apply. No badge row when neither does.
- One markup for every badge:

  ```md
  ::nuxt-link{to="/composables/introduction#instant-play"}
  :badge{icon="mage:zap-fill" label="Instant play" size="md" variant="soft"}
  ::
  ::nuxt-link{to="/composables/introduction#buffered"}
  :badge{icon="ph:stack" label="Buffered" size="md" variant="soft"}
  ::
  ```
- No `Client only` or `Reactive params` badge. Both were true on nearly every
  page, so they carried no signal. Those two facts are stated once on
  `docs/content/2.composables/0.introduction.md` instead.
- Omission is meaningful. Never drop a badge by oversight.

## Intro

- Two paragraphs max
- P1: "`useX` wraps [animeFn](url){target="_blank"} from AnimeJS" + one
  sentence on what the composable does in Vue terms. Not a list of AnimeJS
  features.
- P2 (optional): lifecycle — when it rebuilds, when it reverts
- No example links here

## `## Usage`

- Single `:render-code-block-preview{src="examples/composables/<Name>Demo.vue"}`,
  written to [demo-spec.md](demo-spec.md)
- At most one paragraph after, only for behaviour the demo cannot show
- Everything else belongs in Caveats

## `## Signature`

- One `ts` code block, the full function signature, nothing else
- No prose in this section
- Never folded — it is the page's contract, not an appendix
- Every type named here must resolve in Parameters, Returns, or Type reference

## `## Parameters`

- One top-level `::field` per signature argument, in signature order
- Never nest `::field` inside `::field`. MDC flattens the child blocks, so the
  members render level with the argument and the page reads as one flat list.
- An argument that takes AnimeJS params reads as plain prose: what it
  accepts, when a change rebuilds, and the link. "Accepts a plain object, a
  `ref` or a getter. The timeline rebuilds when it changes. See the
  [AnimeJS timeline documentation](url){target="_blank"} for the options."
  No table of AnimeJS options or their defaults.
- Anything `nanime` adds on top of those options (options that also accept
  refs, a composable's return value accepted where AnimeJS wants an
  instance, options read only once) goes in a `::::note` inside the same
  `:::field`, after the sentence. Keep the sentence itself short.
- A members table (Option | Type | Default) is for an argument `nanime`
  owns outright, such as `NanimeInstanceOptions` (`keepTime`)
- `required` flag only on non-optional args — must match the `?` in the signature
- Type strings copied verbatim from source, never paraphrased in prose
- Defaults stated last in the description, as: Defaults to `true`.

## `## Returns`

One shape for every page that returns an AnimeJS instance:

1. One sentence naming the proxy kind and the AnimeJS type, with a link
   to its AnimeJS page for methods and properties. "Returns a reactive
   proxy around the AnimeJS `JSAnimation`{lang="ts-type"}. Its methods and
   properties are in the [AnimeJS animation documentation](url){target="_blank"}."
2. When `nanime` adds or changes members, a table of those members only
   (Member | Type | Notes), introduced by "The members `nanime` changes:".
   Examples: `patch()` on useAnimeLayout, `add()` taking template refs and
   replaying on rebuild on useAnimeTimeline, `link()` taking another
   composable's return value on useAnimeScroll. The Notes cell says what
   changed, not what the method does in AnimeJS.
3. Proxy behaviour that is not about one member (queued before mount,
   `undefined` before mount, destructuring) goes in one or two sentences of
   prose, never a list.

Linking to a caveat: put the link on the phrase it explains, inside the
sentence. "Call methods on the returned object, because a
[destructured method throws](#...)." Never end a sentence with a "See
[caveat name](#...)" tail, in prose, notes or table cells.

Never list AnimeJS members `nanime` leaves unchanged. When `nanime` owns
the returned object outright, as with `useSplitText`, the table lists all
of it.

Proxy kinds, from the source:

- `toReactive(...)` (useAnimate, useWaapiAnimate, useAnimatable,
  useScrambleText): a `reactive` proxy over a `shallowRef`. Never call it
  a `shallowReactive` wrapper. Methods come back without their instance.
- `createBufferedProxy(...)` (useDraggable, useAnimeTimeline,
  useAnimeScroll, useAnimeLayout): chainable methods are queued before
  mount and look up the current instance on each call. Other members read
  `undefined` until the instance exists.

## `## Caveats`

- Gotchas only — silent failures and expectation-breakers. Not tips, not feature tours.
- Only gotchas `nanime` causes. A gotcha that happens with plain AnimeJS
  too (CSS transitions on a dragged `transform`, WAAPI not animating plain
  objects) is not a caveat. At most it is one sentence at the point of use.
- A caveat shared across pages uses the same heading everywhere, so its
  anchor is the same:
  - `### Do not destructure the returned instance` on every `toReactive`
    page
  - `### Properties do not update templates` on every page whose returned
    instance has `progress`
  - `### Read properties after mount` on every
    buffered page
- Each caveat is an `###` heading, imperative or symptom form
- Code block first, then one paragraph: symptom, cause, fix
- Wrong -> right, in that order, when showing both
- One idea per heading; split rather than stack
- Silent-failure caveats before cosmetic ones
- A caveat may open with a `::warning` or `::caution` one-liner stating the
  consequence, before its code block
- `::tip` and `::note` never appear here — if it is not a failure, it is not a caveat

## `## Type reference`

Appendix rules.

- Sits second-to-last, after `## Caveats`, before `## See also`
- Always folded: exactly one `::collapsible{name="Types"}` per page, closed by default
- Nothing on the page depends on opening it — Signature, Parameters and Returns
  already carry every type the reader needs inline
- Contains only Nanime-owned aliases appearing in this page's signature
- AnimeJS-owned types are linked, never re-declared
- Shared aliases (`AnimeTargets`, `BufferedProxyReturns`, `NanimeInstanceOptions`)
  are copied verbatim from `src/runtime/app/public/types.ts` (the `#nanime/types`
  alias) or `src/runtime/app/utils/targets.ts`

## `## See also`

- Flat list, this order: related composables, examples, upstream AnimeJS
- Upstream links appear only in the intro sentence, the Parameters link to
  AnimeJS options, the Returns link to AnimeJS methods, a caveat whose fix
  rests on an AnimeJS method, and See also
- Every upstream link carries `{target="_blank"}`

## Callouts — severity ladder

Pick the weakest one that is true.

- `::tip` — optional improvement. Reader is fine ignoring it.
- `::note` — side information. Explains, never warns.
- `::warning` — silent failure. Wrong output, no error raised.
- `::caution` — data loss, leaked listener, or unrecoverable state.

## Callouts — size rule

Decides callout vs Caveat. Applies to all four levels.

- One or two sentences, no code block, no heading -> callout, inline at the point of use
- Needs a code block, or a paragraph of symptom + cause + fix -> `## Caveats`

## Callouts — placement

- Sits immediately after the thing it qualifies: the `::field` it constrains, the
  Returns row it contradicts, the Usage snippet it guards
- Never at the top of a page as a preamble
- Max one callout per section — two means the content is a Caveat

## Callouts — hard warnings get both halves

- `::warning` or `::caution` at the point of use, one sentence, linking to the
  caveat by anchor
- The full symptom/cause/fix in `## Caveats`
- Example: the Returns list item for `progress` says scrolling re-renders
  nothing and links to `#properties-do-not-update-templates`. No second
  `::warning` repeating it.

## Callouts — banned

- `::note` used to smuggle a warning past the severity ladder
- Stacked callouts
- A callout restating a type already present in a `type=` attribute or signature

## Cross-page invariants

- Heading text identical across all pages; "Example", "Arguments", "API" are retired
- A type name appears in prose at most once per page; elsewhere it is in a `type=`
  attribute, a signature, or a table cell
- `{lang="ts-type"}` on every inline type in prose
- No `|` inside a table cell, escaped or not. Nuxt Studio strips `\|` on save
  and splits the cell. Write unions as code spans joined by "or"
- Prose wraps at 80 columns; code blocks unwrapped
- Second person, present tense
- No "simply", "just", "easily"; no emoji
