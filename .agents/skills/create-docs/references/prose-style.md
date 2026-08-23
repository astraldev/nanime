# Prose Style

How the prose in this project's docs is written. Applies to every page
under `docs/content/`: getting-started guides, composable pages, showcase
examples. Structural conventions (frontmatter, MDC components, page
shapes) live in `writing-guide.md`, `mdc-components.md` and each skill's
own SKILL.md. This file is only about the sentences.

The target voice: explaining what you built to a colleague who just asked
how it works. Not copy trying to sell it, and not a spec.

## Punctuation

- **No em dashes, no semicolons.** A sentence reaching for one is usually
  holding two thoughts. Split it. A colon before a list is fine.
- Parentheses are fine for a genuine aside, not as a second em dash.

## Words to cut

- **Filler**: *just*, *really*, *actually*, *simply*, *exactly*, *finally*
  as an intensifier. Delete the word and reread. The sentence almost
  always still works.
- **Hype adjectives**: *powerful*, *seamless*, *effortless*, *robust*,
  *silky*, *buttery*. Say what the thing does instead of asserting that
  it is good.
- **Ceremony**: *It is important to note that*, *Keep in mind that*,
  *As you can see*. Start with the fact.

## Sentence shapes to avoid

- **Reveal sentences.** "X is what turns Y into Z", "this is what makes it
  so fast". Advert cadence, not explanation. State the fact plainly:
  "staggering the offsets makes the cards start one after another" beats
  "staggering the offsets is what turns four cards into a sequence."
- **Closing tails.** Don't end a section by restating it or congratulating
  the reader. End on the last real point.
- **Figurative verbs where a plain one exists.** *buys*, *unlocks*,
  *powers*, *taps into*, *hands you*. "It costs more, and buys what WAAPI
  cannot express" makes the reader decode a metaphor to reach a plain
  fact. Say what to do instead: "reach for it when you need something
  WAAPI has no way to express".
- **Rule-without-reason.** "Always use template refs" tells the reader
  nothing they can transfer. Give the mechanism: a selector string
  resolves against the whole document, so a component rendered twice picks
  up its sibling's elements.

## What to include

- **The boring reasoning.** "The goal was to test each card's routine on
  its own, so each one gets its own timeline" is worth more than a list of
  API calls with no motive attached, even when the motive is unglamorous.
- **Only claims you have checked.** Before writing "we do X instead of Y
  because Y would break", go read the source and confirm Y breaks. An
  unverified *why* is worse than no *why*, because it reads as
  authoritative and is wrong. A past version of the showcase skill's own
  page asserted that splitting a card into two elements was required to
  stop two animations overwriting each other's `transform`. That turned
  out to be false once someone read Anime.js's transform-caching code.
  See `../../create-showcase-doc/references/verify-ai-prompt.md` for the
  full history.
- **Links to the pages that own a topic.** Composable mentions link to
  `/composables/<name>`, examples link to `/examples/<name>`, external
  links carry `{target="_blank"}`. Generic web-platform material (render
  pipeline, layout thrashing, `prefers-reduced-motion`) gets linked out
  rather than re-explained. This project's docs are about `nanime`.

## Lists and prose

Prose is the default. A set of parallel items is a list. If three or four
clauses in a row answer the same question about different things, joining
them with commas and an *and* forces the reader to hold the pattern in
their head while the grammar keeps shifting under it:

> Installation adds `nanime` to a project. Performance covers which
> composable to reach for. Each composable page carries a live demo, and
> the examples put several composables together.

Four destinations, four different sentence shapes, and the composables
index buried mid-paragraph. As a list, each line answers the same question
in the same shape:

> - [Installation](/getting-started/installation) to add the module.
> - [Composables](/composables/introduction) for each API, with a live demo on every page.
> - [Examples](/examples/introduction) for full sequences built from several composables.

Keep the entries parallel. Once one starts with a verb, they all do. The
reverse case is also worth watching: a list whose items only make sense
read in order, each depending on the one before it, is usually a
paragraph, or a numbered set of steps.

## Headings

Name the reader's question or the reader's action, not a bare noun.
"Choosing between the two engines" and "How it's built" work. "Engine
comparison" and "Implementation" do not. See `writing-guide.md` for the
action-verb vocabulary and per-section title styles.

## Code samples

- Comments in samples are lowercase-plain and explain a decision, not the
  syntax. `// loses reactivity` earns its place. `// create a ref` does
  not.
- No ✅/❌ emoji, no `Bad:` / `Good:` code-block titles. If two samples
  contrast, the prose above them says which is which and why.
- Prefer one correct sample over a wrong-then-right pair. Show the wrong
  one only when readers are actively likely to write it.
- Callout blocks (`::tip`, `::warning`, `::caution`) are for information
  that is genuinely out of the reading flow, most often a real footgun. A
  callout wrapped around a sentence that belongs in the paragraph above it
  is noise.

## Length

Say it once, in the fewest sentences that still carry the reason. A
paragraph that restates the sentence before it, or an example that makes
the same point as the one above it, comes out. Two sentences with the
mechanism in them beat five that circle it.

## Landing pages

`index.md` and section index pages are allowed a punchier register than a
guide: short card descriptions, sentence fragments, a title that names the
product rather than the reader's task. The punctuation rules still hold,
and so does the ban on hype adjectives. "Animate Nuxt with AnimeJS" is a
headline. "Effortless animations with AnimeJS" is a claim about quality
the reader has not verified yet.

## Line width

Hard-wrap prose at roughly 76 characters. Keeps diffs to the sentence that
changed instead of the whole paragraph. Frontmatter, tables, code blocks
and link-only list items are left alone.
