# Verify Showcase AI Prompt

Load this reference during Step 4 (the AI build prompt) of `create-showcase-doc`,
and any time the user asks to verify, re-verify, or fix an existing page's
AI build prompt on its own.

## Why this exists

Every page in `docs/content/5.examples/` ends with a collapsible block:

```markdown
::collapsible{name="AI build prompt"}
```text
... prompt text ...
```
::
```

This is a prompt a reader can paste into any AI coding agent to build that
demo from scratch. It is only as good as its worst ambiguity. A prompt that
reads fine to a human can still send an AI agent down a wrong path — wrong
API convention, inverted condition, invented method name — and the agent
often won't notice, because it will confidently fill the gap with something
plausible instead of flagging it.

The only reliable way to catch that is to actually run the prompt through an
independent agent and watch what it does with the gaps. Reading the prompt
carefully is necessary but not sufficient — the bugs that matter are exactly
the ones invisible to a careful read, because they're invisible to the
person who wrote the prompt too. That's why this workflow exists as a
two-agent loop rather than a single-pass review: one agent (you) writes and
owns the prompt, a second, independent agent tries to execute it faithfully
and is explicitly told to report every place it had to guess. A report of
"no guesses, all verified" from the test agent is a `PASS` value, not a
`PASS` proof — see Step 3 for why it must always be independently
spot-checked.

## Choosing a test agent

Any agent that is genuinely independent works — the mechanism isn't tied to
one tool. What matters is that the test agent:

- **Starts cold.** It must not carry context from the conversation that
  wrote the prompt. If it already "knows" the intended answer, it can't
  tell you where the prompt itself was ambiguous — it'll silently fill gaps
  from context you didn't put in the prompt, which is exactly the failure
  mode this workflow exists to catch.
- **Has repo access**, so it can (and is told to) explore real source
  instead of guessing from general knowledge of similar libraries.
- **Can write a scratch file** somewhere outside `docs/` and `src/`.

Two options in this environment, either is fine:

- **`agy-bridge`** (`mcp__agy-bridge__delegate` / `mcp__agy-bridge__follow_up`)
  — a separate CLI agent with its own repo access. If the tools are
  deferred, load them first:
  `ToolSearch("select:mcp__agy-bridge__delegate,mcp__agy-bridge__follow_up")`.
  Use `delegate` for the first pass and `follow_up` (same `session_id`) for
  re-verification, so it doesn't redo its repo exploration each round.
- **A subagent** via the `Agent` tool (e.g. `general-purpose`) — spawn it
  fresh for step 2, and continue the *same* spawned agent for step 5's
  re-verification if your subagent tooling supports resuming a prior agent
  by name/id, so its earlier exploration carries over the same way a
  `follow_up` call would.

Either way, the rest of this workflow is identical — "the test agent" below
means whichever you picked.

## Prerequisites

- Whichever test-agent tool you're using (see above), loaded and ready.
- A scratchpad directory to write test output to (never `docs/` or `src/`).

## The workflow

### 1. Read the target page and its real implementation

Read the showcase page (`docs/content/5.examples/<n>.<name>.md`), specifically:

- The `::collapsible{name="AI build prompt"}` block — this is what gets tested.
- The real demo component it's describing:
  `docs/app/components/content/examples/showcase/<name>/*.vue`.
- Any composables the demo (and the prompt) reference:
  `src/runtime/app/composables/*.ts`.

You need the real implementation in your own head before you can judge
whether the test agent's output — or its excuses for deviating — are
actually correct.

### 2. Hand the raw prompt to the test agent

Dispatch to your chosen test agent, with the working directory set to the
repo root. Give it:

- The exact prompt text from the collapsible block, verbatim — don't polish
  it on the way in, that would test a different prompt than the one on the
  page.
- Explicit instructions to explore the repo the way a real coding agent
  would: read the actual composable source under `src/runtime/app/composables/`,
  and (for Anime.js-level APIs like easing names or timer semantics) the
  real package at `node_modules/animejs/dist/modules/**` — not guess from
  memory of other animation libraries.
- An instruction to write the resulting Vue SFC to a scratch path (e.g.
  `<scratchpad>/<PageName>Build.vue`), and an explicit "do NOT touch any
  file inside docs/ or src/".
- A request for it to self-report, after writing the file: (a) the full file
  contents, (b) every place the prompt was ambiguous or forced it to guess
  an API shape, being specific about what it guessed and why, (c) whether
  each API call was verified against real source or assumed.
- Tell it plainly that this tests the *prompt*, not its own output quality —
  it should be honest about guesses rather than defensive about them.

Consider telling it not to peek at the real showcase demo file until after
its first draft, so its guesses reflect what the prompt alone provides,
not what it can copy from the answer key.

### 3. Independently verify the self-report — do not trust it at face value

This is the step that actually catches real bugs, and it's the one that's
easiest to skip when the report reads confidently. Do not skip it.

For every specific verification claim in the test agent's report ("I
verified X against source"), check it yourself:

- If it names a composable option or return value, grep the actual
  `src/runtime/app/composables/*.ts` file for that name.
- If it names an Anime.js-level value — an easing string, a property name, a
  callback argument shape — grep the real, installed package at
  `node_modules/animejs/dist/modules/**` (types, `.js`, or `.d.ts` files).
  Do not assume the agent's claimed convention is right just because it
  cites a plausible-sounding source; open the source and read the actual
  list of valid values yourself.
- Run the project's real linter against the file it wrote:
  `npx eslint <path-to-written-file>`. Separate real correctness errors from
  pure style noise (`@stylistic/*`, `comma-dangle`, `vue/max-attributes-per-line`,
  attribute ordering) — the style findings don't matter here, but an
  undefined-variable, wrong-import, or type error does.

This is exactly how the historical bug was caught: the test agent claimed
it had verified an easing name against the real demo file, but had actually used a
plausible-looking convention from a different animation library
(`easeOutQuad`) instead of Anime.js's real one (`outQuad`). Anime.js's
`parseEaseString` returns a no-op easing on any unrecognized string — no
error, no warning, just silently wrong motion. That class of bug is
precisely what a trusting read of "verified" would miss, and precisely what
grepping the real source catches.

### 4. If you find a real bug, fix the root cause

Two shapes of bug tend to show up:

- **The prompt is missing a fact the AI has no way to know**, so it fills
  the gap with a plausible guess from general knowledge (a naming
  convention from another library, an invented callback shape). Fix: add
  one precise, concrete sentence stating the actual rule — not "be careful
  with easing names," but "use these exact names: `outQuad`, `outBounce`,
  ... — not the `easeOutQuad` convention some other libraries use."
- **The page's own prose is wrong**, and the prompt just inherited that
  error. This happened too: a page described a 40%-progress threshold
  backwards relative to the real `if (anim.progress < 0.4) return` check in
  the source. In this case, fix the prose sections of the page as well as
  the prompt — a wrong prompt sourced from wrong prose is a symptom, and
  fixing only the prompt leaves the underlying misunderstanding live
  elsewhere on the same page.

When you rewrite a corrective sentence, prefer stating the literal condition
over a paraphrase of it (e.g. spell out `progress < 0.4` rather than
"hasn't yet mostly finished") — Step 5 exists because paraphrases have a way
of being just as ambiguous as what they replaced.

### 5. Re-verify with the fixed prompt

Continue the *same* test-agent session from step 2 rather than starting
fresh (`mcp__agy-bridge__follow_up` with the same `session_id`, or the
equivalent "resume this agent" call for whichever subagent tooling you
used) — it already has the repo context loaded, so continuing is faster and
keeps the comparison apples-to-apples.

Don't assume your new wording fixed it. Ask the test agent directly: does
the corrected sentence map unambiguously to the real code condition, with
no room for misreading? Ask for an explicit yes/no and its reasoning. If it
says "still ambiguous," ask it for the exact phrasing it would use instead —
an agent that just tried to execute the old wording is a good source for
what phrasing would have actually been clear to it.

### 6. Repeat until clean, then report

Repeat steps 2–5 until the test agent reports no remaining guesses and
`eslint` shows no correctness issues (style-only findings are fine). Then
tell the user, in plain terms:

- What was tested (which page, which prompt).
- What was found, if anything (the specific wrong guess or wrong assumption,
  and why it would have silently misbehaved rather than errored).
- What was changed, and where (prompt text, and page prose if that was also
  wrong).
- Confirmation that the fix was independently re-verified, not just
  asserted.

## Notes

- Don't run this against a page whose demo component doesn't exist yet —
  there's nothing to compare the test agent's output against. Build or
  point at the real demo first.
- If a page's prompt checks out clean on the first pass, say so plainly and
  stop. Not every prompt has a bug; manufacturing one to look thorough isn't
  the goal, an honest "verified, no issues found" is a complete and useful
  result.
- This workflow is specific to this repo's layout (nanime composables under
  `src/runtime/app/composables/`, the Anime.js v4 package at
  `node_modules/animejs`, and showcase pages under `docs/content/5.examples/`
  paired with demos under `docs/app/components/content/examples/showcase/`).
  If any of those paths move, update the paths above rather than treating
  the workflow itself as stale.
