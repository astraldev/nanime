# Prose Style

How the prose in this project's docs is written. Applies to every page
under `docs/content/`: getting-started guides, composable pages, guides. Structural conventions (frontmatter, MDC components, page
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

- **Pointing at the page layout.** "The AnimeJS tab calls", "the other two
  tabs", "as above" make the reader find a UI element before the sentence
  means anything. Name the thing: "the AnimeJS version", "the
  `@hypernym/nuxt-anime` version", or the method itself.

## Rejected sentences and their replacements

Real sentences the maintainer rejected, with what replaced them. Each one
passed the rules above and still read badly. Check new prose against these
patterns too.

- **A count instead of the content.** "`nanime` runs with no
  configuration. Three options exist if the defaults do not fit." The
  reader learns a number, not where anything goes. Replaced with:
  "Everything on this page is optional. The module options go in
  `nuxt.config.ts`. Transition styles and component defaults go in
  `app.config.ts`."
- **A benefit the reader cannot picture.** "The skill teaches the agent the
  composables, the transition components, and the mistakes that animate the
  wrong element without an error." Replaced with a before and after in real
  API names: "The skill teaches your coding agent the `nanime` composables
  and transition components. With it, the agent calls `useAnimate()`
  instead of calling `animate()` inside `onMounted`."
- **A fact with nothing to do with it.** "The npm package also ships it,
  under `node_modules/nanime/skills/nanime`." Three rewordings in, the
  sentence was deleted. If the reader cannot act on a fact, cut it rather
  than reword it.
- **Several facts stacked into one paragraph.** "Nuxt auto-imports the
  composables and registers `<AnimeTransition>` and
  `<AnimeTransitionGroup>` from here, so there is nothing else to
  configure. The `composables` and `components` options turn either off,
  and `app.config.ts` holds custom transition styles." Replaced with the
  outcome first and one link for the rest: "No other setup is needed. The
  composables, `<AnimeTransition>`, `<AnimeTransitionGroup>` and
  `<AnimeLayoutGroup>` now work in every component without an import.
  [Configuration] covers turning auto-imports off and adding your own
  transition styles."
- **A definition with no example.** "A proxy is not called on its own. It
  returns a value that goes inside animation parameters, and the animation
  applies it." The maintainer could not tell what this meant. Replaced with
  one plain sentence and a code sample that uses `scrambleText` as the
  value of `innerHTML` in a timeline step. An unfamiliar concept needs a
  sample before its definition makes sense.
- **Mechanism before instruction.** "The composables return a proxy to
  their AnimeJS instance. Call methods on the proxy, as in
  `animation.play()`." Replaced with the instruction first: "Call methods
  on the object a composable returns, as in `animation.play()`.
  Destructuring that object breaks it in two ways:", followed by a
  two-item list. Explain internals only when they change what the reader
  does.
- **How the page was researched.** "The `nanime` maintainers wrote this
  page from each package's source and README as of September 2026."
  Replaced with what the page covers and when: "This page compares
  `nanime` with `vue-animejs` and `v-anime`, as of September 2026. If
  something is out of date, open an issue."
- **Setup steps as prose.** A list of bold labels, each with a sentence
  about what the item is, was "not very actionable". Replaced with one
  heading per step ("Install the agent skill", "Connect the docs MCP
  server") and the command or config file in a code block under each.
  When the reader is meant to run something, show it in a code block.
- **Selling before facts.** Comparison pages opened with a "Where does
  nanime stand out?" list before the table. The table now comes first,
  then "Which should you pick?", then the code comparisons. The selling
  list was dropped, since the table already says the same thing.
- **A sentence that describes the table.** "Each row is one entry under
  `components` or `composables` in `app.config.ts`. The second column lists
  the props that entry accepts. The third column is the value used when
  nothing else sets it." The entry names and column headers already say
  this. Deleted.
- **A longer sentence that says less.** "When two places set the same
  setting, the one that covers less of the app wins. The second column
  lists the places from the whole app to a single call or component, so
  the last place listed wins." The reader has to decode "covers less".
  Replaced with: "Some settings can be set in more than one place. The
  table lists the places in order, and the last one listed wins."
- **An example in prose next to the code that is the example.** "A
  settings panel can use its own transition animation this way", directly
  above a `SettingsPanel.vue` sample. The sample is the example. The prose
  copy was cut.
- **A section opener that gives four sentences for one purpose.** "Use
  `provideAnimeDefaults()` when one part of the app needs its own
  defaults. Call it in the `<script setup>` of a component. Everything
  rendered inside that component uses the new defaults. Components outside
  it keep the app-wide ones." Replaced with the purpose alone: "Use
  `provideAnimeDefaults()` when one part of the app needs different
  defaults from the rest." Where to call it is visible in the sample.
- **A type name used as a lead-in.** "The argument is typed
  `NanimeDefaults` and can be an object, a ref or a getter:" before a
  table. The type name gave the reader nothing to act on. The ref and
  getter fact moved to the notes after the table.
- **A note on a table cell that restates the verb.** "Replaces the same
  entry from a parent component's call. The two are not merged key by
  key." "Replaces" already says the two are not merged. Cut the second
  sentence.
- **A rule with no case.** "Each prop goes through the layers on its own."
  The reader cannot picture a result. Replaced with two headed cases that
  each end on a concrete outcome ("`<AnimeTransition
  enter-animation="fade">` fades in and still scales out").
- **A direction word in an ordered list.** "Read from the next layer
  down." Down the list, or down in priority? Name the position or the
  thing: "the first of these that sets it".
- **A lead-in that counts the table.** "`reducedMotion` takes one of three
  values:" above a three-row table. The table shows the values. Delete the
  line, and let the heading introduce the table.
- **A lead-in that restates the sample.** "To follow the visitor's system
  setting, set it to `'system'` in `nuxt.config.ts`:" above a sample whose
  file label and body say exactly that. Reduced to the instruction alone:
  "Set `reducedMotion` in `nuxt.config.ts`:". The table row for `'system'`
  already says what the value does.

## Rewording and cutting

When asked to improve a page, restructure it if it mixes jobs, cut what
adds no fact, then reword what is left so a reader who has never seen the
page can follow it. Do not call a rewrite "trimming". Run the checks below
on the whole page before handing it back. Doing this after the maintainer
points at each passage is the failure to avoid.

### Check the structure first

Rewording sentences cannot fix a page whose structure is the problem. Before
rewording, read the page as a whole and name the jobs it does. A page that
mixes several jobs, repeats another page, or buries one answer in a long
list of unrelated topics needs a restructure, and rewording it leaves the
reader as lost as before.

When a page needs a restructure, do it without asking. Restructuring means:

- Move a passage next to the section it belongs to, such as folding
  "Read properties after mount" under the Buffered section it depends on.
- Merge passages that say the same thing, keeping the one with the sample.
- Turn a paragraph that lists separate facts into a list, one fact per
  item.
- Reorder sections so the task or the example comes before the rule.
- Keep every anchor other pages link to. Grep for inbound links and fix
  any heading that changes.

Ask first only when the fix is to split the page into two, because that
adds a page, a nav entry and links in other files. Propose the split with
the outline and the list of links it changes.

When a maintainer says a page is "still bad" without naming a passage,
assume the structure is the problem and diagnose that before editing more
sentences.

### Touch only what was asked

Reword or cut only the passages the maintainer pointed at, or the page
they asked you to improve. A restructure of a page they asked you to
improve is part of that job. Wording they wrote or approved stays as
written, even when a cut or a rewrite elsewhere on the page goes through
the same text. A rewrite that removes a clause the maintainer approved counts as
an unrequested change. Report other problems you find instead of fixing
them.

### Cut without asking

Run this test on every sentence, list item and heading of a page you were
asked to improve: does it add a fact the heading, table, sample or
neighbouring sentence does not, and would the reader do anything
differently because of it? If not, delete it. Do not wait for the
maintainer to point at each one. The maintainer has had to say "so many
irrelevant statements there" and "the list items, how useful are they?"
on page after page.

- A sentence that adds no fact beyond the heading, table or code sample
  next to it. This covers sentences that describe the page itself ("this
  page covers those rules once", "the second column lists..."), restate a
  sample in prose, or repeat the previous paragraph.
- A list item that restates the rule above it. If most items of a list say
  "same as the rule", reduce the list to the exceptions. A five-item list
  of how each composable treats a changed callback became the three
  composables that do rebuild.
- A fact that belongs to a different topic than the section's. "Composables
  run on the client only" does not belong under a section about rebuilds.
- Internals the reader cannot act on: why a prop is declared with
  `default: undefined`, how a watcher compares callbacks.

When a cut removes the only statement of a fact, move the fact instead.

### Propose, do not apply

- Content another page owns, when cutting it removes information from
  this page. Link to the owner and propose the cut.
- A whole section that serves a different job, such as a hidden-tab note on
  a performance page. Propose it, and do not apply it without a yes.
- Anything that changes a heading another page links to.

### What stays, even when the page is long

- A concrete case for every rule, as a sample or a one-line example. The
  case is part of the rule and does not count as extra length.
- The one sentence that states the page's or section's purpose.
- A fact the reader needs and cannot see in the code, such as which
  settings a function does not accept, or what applies only to
  composables created afterwards.
- Every anchor other pages link to. If a heading changes, fix the links.

When a cut loses a fact, move the fact. The ref and getter sentence moved
under the table when its lead-in line was removed.

### Check each rewrite as a cold reader

Before handing a page back, read every changed passage as someone who has
not seen the page or the code:

- Does every "it", "this" and "its" point at a clear thing in the same
  sentence? ("Its siblings and its parents" pointed at nothing.)
- Is a direction word ("down", "above", "below", "lower", "outer", "next
  layer") used in a list where it could mean either way?
- Is a term used before it is defined, or defined by a word that is
  itself jargon ("layer", "entry", "supplies", "covers")? Use the plain
  word or the real name.
- Is the rule stated before an example? Put the example first.
- Is the rewrite longer or more abstract than the original? A rewrite that
  removes ambiguity by adding abstraction fails.
- Does the same kind of problem exist elsewhere on the page? Fix the whole
  page, not only the passage that was pointed at.
- Did the edit itself add a sentence? Moving a table above a sample, or
  adding a line to introduce it, adds prose. Every added sentence goes
  through the same checks as an old one. An edit that reorders and then
  adds a lead-in counting the table or restating the sample has
  reintroduced the fault it was meant to fix.
- Does a lead-in line sit above a table or a code sample? Keep it only if
  it states a fact the table, the sample and the heading do not. Otherwise
  the heading introduces them and the line goes.

## Opening a section

The opener of an `##` section is one plain statement of what the section
is for or what to do. Leave out the sentences that restate where to call
it, what is affected or what the sample shows, because the sample and the
table carry those. A page's own intro under the title may be longer, since
it also says what the page covers and where to go next.

## Naming

Always "AnimeJS" in prose and in AI build prompts, never "Anime.js" or
"anime.js". (The npm package name `animejs` and import paths like
`animejs/animation` are the one exception. Those stay as written in
code.) Search-facing text is the other exception: `seo.title`,
`seo.description` and the homepage `<h1>` write "Anime.js", because that
is what people search for. Always `` `nanime` `` (lowercase, backticked) as a sentence
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
  authoritative and is wrong. A past docs page asserted that splitting a
  card into two elements was required to stop two animations overwriting
  each other's `transform`. That turned out to be false once someone read
  AnimeJS's transform-caching code.
- **Links to the pages that own a topic.** Composable mentions link to
  `/composables/<name>`, guides link to `/guides/<name>`, external
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
> the guides cover options and defaults.

Four destinations, four different sentence shapes, and the composables
index buried mid-paragraph. As a list, each line answers the same question
in the same shape:

> - [Installation](/getting-started/installation) to add the module.
> - [Composables](/composables/introduction) for each API, with a live demo on every page.
> - [Guides](/guides/configuration) for module options and defaults.

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
- [ ] No sentence points at the layout ("the X tab", "the other two tabs",
      "as above"). Name the version or thing instead.
- [ ] Every sentence passes the patterns in "Rejected sentences and their
      replacements": no counts in place of content, no benefit without a
      concrete before and after, no fact the reader cannot act on, no new
      concept without a sample, instruction before mechanism, no
      research-provenance line, setup steps as code blocks.

**Naming**
- [ ] "AnimeJS" is spelled the same way everywhere in prose and in AI
      build prompts (never "Anime.js" or "anime.js"), except the SEO
      frontmatter and the homepage `<h1>`, which write "Anime.js".
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
- [ ] No sentence describes a table or heading instead of stating a fact.
- [ ] No prose sentence restates the code sample or table next to it.
- [ ] No lead-in line above a table or sample counts its rows or says what
      its code already shows.
- [ ] Every sentence the edit itself added passed the same checks as the
      sentences it replaced.

**Rewording and cutting**
- [ ] The page's jobs were named before any sentence was reworded, and a
      page that mixes jobs or repeats another page was restructured, not
      only reworded. A split was proposed, not made.
- [ ] Only passages the maintainer pointed at were reworded or cut.
      Approved wording is unchanged, and other problems were reported.
- [ ] Every sentence, list item and heading passed the cut test: it adds a
      fact the neighbouring heading, table or sample does not, and the
      reader acts on it. A list whose items mostly restate the rule was
      reduced to its exceptions.
- [ ] Every rule has a concrete case, and the case comes first.
- [ ] No direction word ("down", "above", "below", "lower", "outer") in an
      ordered list, and no undefined jargon ("layer", "entry").
- [ ] Every "it", "this" and "its" points at a clear thing.
- [ ] Each section opener is one plain statement of purpose.
- [ ] The whole page was reread as a cold reader, not only the passage
      that was being fixed.
