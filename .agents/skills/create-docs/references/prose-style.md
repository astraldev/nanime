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
- **LLM tells**: *delve*, *embark on a journey*, *navigate the landscape*,
  *leverage*, *empower*, *unlock*, *streamline*, *In this guide we will
  explore*, *Without further ado*, *Let's dive in*, *That's it. That's
  all you need.* These read as generated regardless of whether they were.
  Say the specific thing instead.

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
- **Rhetorical hooks.** "Nothing here plays on a clock." "None of it reads
  as depth without a `perspective` value." Negation-as-opener and
  italics-for-drama are a blog device, not this project's register. Check
  a real [AnimeJS doc page](https://animejs.com/documentation/){target="_blank"}
  before writing an opener: it states the mechanism directly, with no
  rhetorical framing. "The scroll position drives the car" beats "The
  scroll position *is* the playhead."
- **Subject switches mid-sentence.** "The panel scrolls sideways, and the
  car travels the road as you go" makes the reader track three actors in
  one clause: the panel, the car, and "you". The second half often slides
  into passive voice to fit ("a line is drawn behind it"). One cause, one
  effect, one sentence: "The car follows the road as you scroll the
  panel." If a sentence needs a second *and* to hold its clauses
  together, split it.
- **Command-then-consequence.** "Scroll back and it reverses." is a
  contrived bit of AI cadence. Say the outcome plainly: "It reverses
  when you scroll back."
- **Passive nominalization.** "The scroll being read is the panel's own"
  hides the actor. Name it: "It reads the panel's own scroll."
- **Dangling pronouns and gerund subjects.** "Testing the handle's centre
  reports a boolean" has no one doing the testing. "None of it reads as
  depth" leaves "it" for the reader to resolve. Name the subject.
- **Trailing clauses that drift from their anchor.** Chaining several
  actions or facts before landing the purpose clause makes the reader lose
  what it refers to by the time they reach it. "Wrap the trail element in
  `createDrawable`, take `[0]` from the array it returns, and pass that to
  `useAnimate` with `draw: [...]` to reveal it" buries "to reveal it" behind
  two unrelated steps, and "it" no longer has an obvious referent by then.
  One action per sentence, purpose clause right next to the action it
  explains: "Wrap the trail element in `createDrawable` and take `[0]` from
  the array it returns. Pass that to `useAnimate` with `draw: [...]` to
  reveal the trail end to end." Same failure at the paragraph level: "Only
  X is unwrapped, and AnimeJS resolves no framework refs, so passing a ref
  directly leaves Y falling back to Z" stacks two facts ahead of the
  consequence they cause. Split the facts from the consequence.

## Explanation vs. implementation

On a showcase page, "What's happening" and "How it's built" explain the
animation and the `nanime` API driving it, nothing else. Vue and DOM
plumbing that a reader doesn't need to understand the effect (`ref`,
`computed`, `setup()`, a `boolean` flag, a `ResizeObserver`, a ghost
element's layout trick) belongs only in "Building it yourself" and the AI
build prompt, which are recipes for someone actually implementing it.
Before adding a detail to an explanation section, ask whether it explains
the animation or the component wiring underneath it. Cut it if it's the
latter.

## Naming

Always "AnimeJS" in prose and in AI build prompts, never "Anime.js" or
"anime.js". (The npm package name `animejs` and import paths like
`animejs/animation` are the one exception. Those stay as written in
code.) Always `` `nanime` `` (lowercase, backticked) as a sentence
subject, never "Nanime".

## Calibrate against the real docs

Before writing an explanation, skim the equivalent page on
[animejs.com/documentation](https://animejs.com/documentation/){target="_blank"}.
It never opens on a hook, never uses italics for emphasis, and states
each fact once in plain declarative sentences, with no narrative framing:
"Animations can be added to a timeline using the `add()` method." That
register is closer to this project's target than default
"explain-it-engagingly" prose, which drifts toward blog voice and reads
as generated. This project's docs are not a blog: no first person, no
reader-address ("you'll notice"), no asides.

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
  out to be false once someone read AnimeJS's transform-caching code.
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

## Verification checklist

Run this against the actual page after writing or editing it, sentence by
sentence. Don't rely on having followed the rules while writing. Quote the
offending sentence when a check fails. "Sounds fine" is not a pass.

**Punctuation**
- [ ] No em dashes anywhere in the page.
- [ ] No semicolons anywhere in the page.

**Words to cut** (grep the page for each. Every hit needs a reason to stay)
- [ ] No filler intensifiers: *just*, *really*, *actually*, *simply*,
      *exactly* as an intensifier, *finally*.
- [ ] No hype adjectives: *powerful*, *seamless*, *effortless*, *robust*,
      *silky*, *buttery*.
- [ ] No ceremony openers: *It is important to note that*, *Keep in mind
      that*, *As you can see*.
- [ ] No LLM tells: *delve*, *embark on a journey*, *navigate the
      landscape*, *leverage*, *empower*, *unlock*, *streamline*, *In this
      guide we will explore*, *Without further ado*, *Let's dive in*,
      *That's it. That's all you need.*

**Sentence shapes** (read every sentence in isolation, then in context)
- [ ] No reveal sentences ("X is what turns Y into Z").
- [ ] No closing tails that restate the section or congratulate the reader.
- [ ] No figurative verb standing in for a plain one (*buys*, *unlocks*,
      *powers*, *taps into*, *hands you*).
- [ ] No rule stated without its mechanism ("always do X" with no "because
      Y").
- [ ] No rhetorical hook opener (a negation, a question, italics for
      emphasis) on a section or page.
- [ ] No sentence makes the reader track more than one subject, and none
      needs a second *and* to hold its clauses together.
- [ ] No command-then-consequence tic ("Do X and it Y's").
- [ ] No passive construction that hides who or what does the thing.
- [ ] Every "it" / "this" / "that" has an antecedent in the same or
      previous sentence, close enough that a reader wouldn't have to guess.
- [ ] No sentence chains more than one action or fact before its purpose
      clause. If a sentence has two purposes or two unrelated actions,
      split it.

**Explanation vs. implementation** (showcase pages only)
- [ ] "What's happening" and "How it's built" contain no Vue or DOM
      plumbing (`ref`, `computed`, `setup()`, a bare `boolean`,
      `ResizeObserver`, a ghost-element layout trick). That detail exists
      only in "Building it yourself" and the AI build prompt.

**Naming**
- [ ] "AnimeJS" is spelled the same way everywhere in prose and in AI
      build prompts (never "Anime.js" or "anime.js").
- [ ] `` `nanime` `` is lowercase and backticked everywhere it's a
      sentence subject (never "Nanime").

**Register**
- [ ] No first person ("I", "we" outside a shared-step "let's").
- [ ] No direct reader-address asides ("you'll notice", "as you can see").
- [ ] Skim the closest matching page on
      [animejs.com/documentation](https://animejs.com/documentation/){target="_blank"}.
      The page under review should read at least as plain and declarative,
      not more narrative.

**Lists**
- [ ] Every list item is parallel in shape (all start with a verb, or none
      do).
- [ ] Nothing that reads as a list got left as a comma-and-*and* run-on
      sentence, and nothing that only makes sense in order got left as a
      bullet list instead of numbered steps.

**Headings**
- [ ] Every heading names the reader's question or action, not a bare
      noun.

**Code samples**
- [ ] Every comment explains a decision, not the syntax on its own line.
- [ ] No ✅/❌ emoji, no `Bad:` / `Good:` code-block titles.

**Length**
- [ ] No paragraph restates a point the previous paragraph already made.
