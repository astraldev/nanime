---
name: create-showcase-doc
description: |
  End-to-end workflow for writing (or rewriting) a showcase example doc page
  in docs/content/5.examples/ — the pages that explain a full demo built from
  several nanime composables, as opposed to the single-composable API pages
  under docs/content/2.composables/. Covers the whole page: intro, the
  What's happening / How it's built prose, a numbered Building it yourself
  guide, and a collapsible AI build prompt that gets verified against a real
  independent AI agent before the page is considered done. Use this whenever
  the user asks to write, add, create, improve, or rewrite showcase
  documentation, a showcase example page, or an "examples" doc for a demo
  component (intro-sequence, timeline-storyboard, drag-to-bin,
  loading-sequence, text-scatter, or any new addition to
  docs/content/5.examples/) — including requests that only mention part of
  the page, like "write an AI prompt for this demo" or "explain how this
  showcase works," since those still belong in this page structure. Also use
  when the user asks to verify, test, or fix an existing page's AI build
  prompt on its own — that's Step 4 below, runnable standalone via
  references/verify-ai-prompt.md.
---

# Create Showcase Doc

A showcase page documents a *composition* — several composables working
together to build something a reader would actually want to ship, not a
single API in isolation (that's what `docs/content/2.composables/` is for).
The reader arrives already able to see the demo running; what they're
missing is a mental model of what's happening and the confidence to build
something like it themselves. That's what this page structure is for.

## Prerequisites

Read the actual demo component before writing a word of prose:

- `docs/app/components/content/examples/showcase/<name>/*.vue` — the real
  implementation. Every claim in the doc must trace back to something in
  this file, not to what you'd expect a demo like this to do.
- Any composables it uses, in `src/runtime/app/composables/*.ts` — read the
  real option/return shapes rather than relying on memory of similar
  composables.

If the demo component doesn't exist yet, build or scaffold it first (see
`create-playground-page` and `create-composable` for related workflows).
Writing prose to describe a demo that doesn't exist produces a page that's
wrong by construction and a broken `::render-code-block-preview`.

## Page structure

Every page follows this shape, in this order. Look at an existing page
(`docs/content/5.examples/2.drag-to-bin.md` is a solid reference) before
writing a new one from scratch.

```markdown
---
title: <Short name>
description: <One line, plain, no hype>
navigation:
  icon: i-ph-<something-semantic>
---

<2-4 sentence intro: what the reader sees when they use the demo>

::render-code-block-preview
---
code: false
src: examples/showcase/<name>/<Name>Demo.vue
---
::

## What's happening

<Pure description of the visible behavior. No composable names, no API
mentions — this section is for someone who hasn't opened a code editor yet.>

## How it's built

<The technical explanation: which composables, in what order, and why they
were combined this way. This is where composable names, option shapes, and
"the goal was to..." reasoning belong.>

## Building it yourself

1. <Numbered, imperative steps a developer could follow to build this from
   scratch, referencing real composables and their actual options.>

::collapsible{name="AI build prompt"}
```text
<A self-contained prompt someone could paste into any AI coding agent to
build this demo. See Step 4.>
```
::
```

### Writing the intro

2-4 sentences. What does the reader see, in plain terms, before any
technical framing. This sets up "What's happening" — don't duplicate it,
just orient the reader.

### Writing "What's happening"

This section is pure experience, not implementation. If you're naming a
composable or describing a callback, that content belongs in "How it's
built" instead. Aim for 3-5 sentences a non-developer could follow. A
concrete analogy (four dancers each learning their own routine, letters
acting like iron filings near a magnet) often does more work than a precise
technical description would here — precision is "How it's built"'s job.

### Writing "How it's built"

This is where the real mechanics live: which composables, what they're
each responsible for, and — when it clarifies a real design decision — the
reasoning behind why the demo is built the way it is rather than some
simpler-sounding alternative. Only include a "why not the simpler way"
explanation when you've actually verified the simpler way doesn't work; see
the note on this in `references/verify-ai-prompt.md`'s bug history — a past
version of this section asserted a false technical constraint (an "avoids
X conflict" claim that didn't survive a source-level check) before it was
caught and corrected.

### Writing "Building it yourself"

A numbered list, imperative voice, each step naming the real composable
calls involved. This is the bridge between the narrative above and the raw
AI prompt below — many prompt sentences in Step 4 are this list translated
into prose a model can act on directly.

### Prose style

Write like you're explaining what you built to a colleague who just asked
"how does this work," not like copy trying to sell the demo. Concretely:

- **No em dashes, no semicolons.** If a sentence wants one, it's usually
  trying to hold two separate thoughts — split it into two sentences
  instead. A colon before a list is fine.
- **Cut filler words on sight**: *just*, *really*, *actually*, *simply*,
  *exactly*, *finally* (as an intensifier). Delete the word, reread the
  sentence — it almost always still works.
- **No hype adjectives**: *powerful*, *seamless*, *effortless*, *robust*.
  Say what the thing does instead of asserting that it's good.
- **No "reveal" sentences.** Watch for the shape "X is what turns Y into
  Z" or "this is what makes it so [adjective]" — that's an advert
  cadence, not an explanation. State the fact plainly: "staggering the
  offsets makes the cards start one after another" beats "staggering the
  offsets is what turns four cards into a sequence."
- **No closing tails.** Don't end a section with a sentence that just
  restates what it already said, or a congratulatory wrap-up. End on the
  last real point.
- **Include the boring reasoning.** "The goal was to test each card's
  routine on its own, so each one gets its own timeline" is more useful
  than a bare list of API calls with no motive attached — even when the
  motive is unglamorous.
- **Only state a technical claim you've actually checked.** If you're
  about to write "we do X instead of Y because Z would break" (a
  because-it-would-break claim, not a because-it's-simpler-to-read
  claim), go verify Z actually breaks by reading the real source first.
  A prior version of this skill's own page asserted that splitting a
  card into two elements was required to avoid two animations
  overwriting each other's `transform` — that turned out to be false
  once someone actually read Anime.js's transform-caching code. Don't
  repeat that mistake: an unverified "why" is worse than no "why" at
  all, because it reads as authoritative and is wrong.
- **Section headers name what the reader does or sees, not a bare noun.**
  "What's happening" and "How it's built" work because they're framed as
  the reader's two questions, not "Overview" and "Implementation."

## Step 4: the AI build prompt

The collapsible block at the bottom of the page is not decoration. It's a
prompt a reader will actually paste into an AI agent, and it needs to
survive that. Two things have to be true before it's done:

1. It's self-contained — someone with no other context should be able to
   hand it to any AI coding agent and get a working demo back.
2. It's actually correct against this module's real APIs, not just
   plausible-sounding. A prompt that reads fine but nudges an AI toward a
   wrong convention (a nonexistent easing-name format, an inverted
   condition) will produce code that runs without erroring and misbehaves
   silently — the worst kind of bug, because nothing tells the reader it
   happened.

Write the first draft of the prompt as the "Building it yourself" list
translated into flowing instructions an AI agent can act on. Then **verify
it** — don't skip this — by following `references/verify-ai-prompt.md` in
full. That reference walks through handing the prompt to a second,
independent AI agent (agy-bridge, or a fresh subagent — either works, see
the reference), checking its self-reported guesses
against real source rather than trusting them, fixing whatever's actually
wrong (in the prompt, and in the page's own prose if that's where the error
started), and re-verifying the fix. A page's AI prompt isn't done until that
loop has run at least once clean.

You can also run that reference workflow standalone, any time the user asks
to verify, re-test, or fix a prompt that's already on a page — it doesn't
require redoing the rest of this skill.

## Registering the page

New pages need two more edits:

- Add a card to `docs/content/5.examples/0.introduction.md`'s
  `::u-page-grid` block, matching the existing card format (`to`, `icon`,
  `title`, one-line `#description`).
- Number the filename to slot it into reading order
  (`docs/content/5.examples/<n>.<name>.md`), renumbering neighboring files
  if you're inserting rather than appending.

## Verifying the page renders

If a docs dev server is available (`docs` in `.claude/launch.json`, port
3001), open the new page in the Browser pane and confirm: the preview
renders, the collapsible toggles and reveals the prompt text, and there are
no console errors. See the project's own verification workflow rather than
reporting the page done on markdown correctness alone.
