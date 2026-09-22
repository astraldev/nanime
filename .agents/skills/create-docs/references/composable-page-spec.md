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

## Badge row

- One slot: mode
- `Instant play` -> composable supports instant/static mode, wrapped in
  `::nuxt-link{to="/composables/introduction#instant-play"}`
- No badge row at all on a composable without instant mode
- No `Client only` or `Reactive params` badge. Both were true on nearly every
  page, so they carried no signal. Those two facts are stated once on
  `docs/content/2.composables/0.introduction.md` instead.
- Omission is meaningful. Never drop a badge by oversight.

## Intro

- Two paragraphs max
- P1: "`useX` wraps [animeFn](url){target=_blank} from AnimeJS" + one Vue-terms sentence
- P2 (optional): lifecycle — when it rebuilds, when it reverts
- No example links here

## `## Usage`

- Single `:render-code-block-preview{src="examples/composables/<Name>Demo.vue"}`
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
- Object-typed arguments carry a members table instead: Option | Type | Default,
  inside the argument's own `::field`
- List what a Nanime user actually sets; exhaustive upstream options stay behind
  the See-also link
- `required` flag only on non-optional args — must match the `?` in the signature
- Type strings copied verbatim from source, never paraphrased in prose
- Defaults stated last in the description, as: Defaults to `true`.

## `## Returns`

- Sentence one: name the return type and its kind (reactive proxy / buffered
  proxy / plain object of refs). The composables return `toReactive(...)`, a
  `reactive` proxy over a `shallowRef` — never call it a `shallowReactive`
  wrapper.
- Then a members table: Member | Type | Notes
- Table lists what the reader reads or calls, not every upstream member
- Notes column flags anything that breaks expectation (non-reactive, buffered,
  destructuring-unsafe) and links to the matching caveat

## `## Caveats`

- Gotchas only — silent failures and expectation-breakers. Not tips, not feature tours.
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
  live in `docs/content/4.misc/` and are included once that page exists; until then
  copy verbatim from `src/runtime/app/utils/types.ts`

## `## See also`

- Flat list, this order: related composables, examples, upstream AnimeJS
- No upstream links anywhere else on the page except the intro sentence

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
- Example: the Returns row for `progress` carries a `::warning` that scrolling
  re-renders nothing, linking to `#progress-does-not-update-in-a-template`

## Callouts — banned

- `::note` used to smuggle a warning past the severity ladder
- Stacked callouts
- A callout restating a type already present in a `type=` attribute or signature

## Cross-page invariants

- Heading text identical across all pages; "Example", "Arguments", "API" are retired
- A type name appears in prose at most once per page; elsewhere it is in a `type=`
  attribute, a signature, or a table cell
- `{lang="ts-type"}` on every inline type in prose
- Prose wraps at 80 columns; code blocks unwrapped
- Second person, present tense
- No "simply", "just", "easily"; no emoji
