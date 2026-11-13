# How the tracked-layout patch works

The patch changes `AutoLayout`'s measure/walk pass in
`dist/modules/layout/layout.js`. It is seven hunks:

| Hunk | What it adds |
|---|---|
| `LayoutSnapshot` fields | `this.branch = new Set()` — the elements whose children must be walked. |
| `shouldWalkChildren($el)` | Returns `true` when tracking is off, otherwise only for elements in `branch`. |
| Three walk sites | `lastElementChild` becomes `this.shouldWalkChildren($current) ? $current.lastElementChild : null` in the snapshot walk. |
| `setup()` | After parsing `children`, add each target and its ancestors to `branch` with `addBranch()`. |
| `AutoLayout` constructor | `this.trackTargetsOnly = !!params.trackTargetsOnly`. |
| Grid handling | A grid target with no recorded children keeps `display: grid` instead of being forced to `display: block`. |

`LayoutSnapshot.addBranch($el)` walks up from a target, adding each ancestor until it
reaches the root (and stops early when it finds an ancestor already in the set). Walked
elements are therefore: the targets, every ancestor between a target and the root, and
the siblings encountered on the way.

The second patch only adds `trackTargetsOnly?: boolean` to `LayoutOptions` in
`layout.d.ts`. nanime's `AnimeLayoutGroupProps.layoutOptions` is
`Omit<AutoLayoutParams, 'children'>`, so the flag reaches the prop type from there.

## Moving the patch to another Anime.js version

The hunks are anchored on code that Anime.js changes rarely, but line numbers move:

1. Diff the installed `dist/modules/layout/layout.js` against the version the patch was
   written for (`4.5.0`). The relevant methods are `LayoutSnapshot.setup`,
   `LayoutSnapshot.record` (the three `lastElementChild` sites), the `AutoLayout`
   constructor, and the grid branch in `render()`.
2. Port the seven hunks by hand, keeping the same semantics:
   - one `branch` set per snapshot,
   - `shouldWalkChildren()` gate before every downward walk,
   - ancestors added in `setup()` from the parsed `children`,
   - `trackTargetsOnly` read from params,
   - grid guard.
3. Regenerate both diffs against the installed version and replace the two files here.
4. Re-run the verification steps in `SKILL.md`.

## Limits

- Every target is still measured. The gain is proportional to how much of the subtree
  is *not* a target.
- Content inside a target reflows instead of animating; mark it as another target if it
  must move.
- Tables lose table layout when rows leave flow (Anime.js behaviour).
- `children: '*'` (the default) has no targets, so enabling the flag without `elements`
  or `children` leaves the snapshot empty. nanime's `elements` prop exists to set it.
- The patch touches module-private code; treat it as a fork and re-check it on every
  Anime.js upgrade. Prefer an upstream fix in Anime.js if one lands.
