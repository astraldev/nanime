---
name: create-composable
description: Workflow for creating SSR-safe, memory-safe, version-adaptive composables wrapping anime.js utilities.
---

## Overview

Every composable in `src/runtime/app/composables/` wraps an anime.js utility with Vue 3 reactivity. Each composable must be:

1. **SSR safe** — never touches DOM or browser APIs during server render
2. **Memory safe** — cleans up all anime instances, watchers, and DOM mutations
3. **Version adaptive** — gracefully handles anime.js APIs that may not exist in older supported versions (minimum: `4.3.5`)

---

## Step 0: Check Version Availability

Before writing any code, determine whether the anime.js API you're wrapping exists across the supported version range.

**Supported range**: `animejs >=4.3.5` (from `peerDependencies` in `package.json`)

**Reference — API availability by version:**

| API | Module path | Available since |
|---|---|---|
| `animate()` | `animejs/animation` | 4.0.0 |
| `createAnimatable()` | `animejs/animatable` | 4.0.0 |
| `createDraggable()` | `animejs/draggable` | 4.0.0 |
| `splitText()` | `animejs/text` | 4.0.0 |
| `waapi.animate()` | `animejs/waapi` | 4.0.0 |
| `createLayout()` | `animejs/layout` | 4.3.0 |
| `scrambleText()` | `animejs/text` (scramble) | 4.4.0 |
| `globals`, `forEachChildren`, `addChild`, `removeChild` | `animejs` | 4.4.0 |

**To verify against the submodule directly:**
```sh
cd anime-core/anime
git log --oneline --all -- src/<module>/<feature>.js
git tag --contains <first-commit-hash> | sort -V | head -1
```

Or check the [anime.js GitHub releases](https://github.com/juliangarnier/anime/releases) for the changelog.

### Version-adaptive pattern

If the API was added **after** 4.3.5, the composable must handle its absence at runtime:

```ts
// Dynamic import with availability check
async function resolveAnimeModule<T>(modulePath: string): Promise<T | null> {
  try {
    return await import(modulePath)
  }
  catch {
    return null
  }
}
```

Use this for any API added in 4.3.6+. The composable should:
- Return a **no-op stub** or **warn once** when the API is unavailable
- Never throw — the app should still work, just without that feature
- Document the minimum version in the composable's JSDoc and its docs page

```ts
/**
 * @since animejs 4.4.0
 * @remarks Returns a no-op instance when scrambleText is unavailable (animejs < 4.4.0)
 */
export function useScrambleText(...) {
  // ...
}
```

For APIs available since 4.3.5 or earlier, use static imports — no version check needed.

---

## Step 1: Scaffold the File

Create `src/runtime/app/composables/use<Name>.ts`.

No registration needed — `addImportsDir` in `src/module.ts:60-62` auto-imports everything in the directory.

If the composable wraps a new anime submodule path (e.g., `animejs/text` for scramble), add it to the Vite `optimizeDeps` list in `src/module.ts:37-44`.

---

## Step 2: SSR Safety

Anime.js operates on DOM elements. On the server there is no DOM. Every composable **must** guard all DOM access.

### Required guards

```ts
import { useMounted } from '@vueuse/core'

const mounted = useMounted() // false on server, true after client mount
```

**Rules:**
- **Never** call anime functions at the top level of the composable. Always gate behind `mounted.value`.
- **Never** access `document`, `window`, `Element`, or any browser global outside a mounted guard.
- In `watchEffect` / `watch` callbacks, early-return when `!mounted.value`.
- In static (non-watchable) mode, use `nextTick()` which only executes client-side.
- Initialize `shallowRef` with a safe default (empty object, `null`, or a no-op anime instance that doesn't touch DOM).

### SSR-safe initialization patterns

```ts
// Pattern A: null init (preferred for version-adaptive composables)
const instance = shallowRef<SomeAnimeType | null>(null)

// Pattern B: no-op instance (for composables returning toReactive — needs a non-null seed)
const instance = shallowRef(animate({}, {}))
```

Pattern B is used by `useAnimate`, `useAnimatable`, `useWaapiAnimate` — the empty `animate({}, {})` creates a lightweight no-op. Use this when the composable returns `toReactive(instance)` since `toReactive(null)` would break.

Pattern A is used by `useDraggable`, `useLayout`, `useSplitText` — they return custom objects, so `null` is safe as the initial value.

---

## Step 3: Memory Safety

Every anime instance holds references to DOM nodes, tween state, and requestAnimationFrame handles. Leaking these causes:
- DOM nodes retained after component unmount
- Orphaned animation loops ticking in the background
- Memory growth on repeated navigation (SPA route changes)

### Required cleanup

```ts
import { tryOnScopeDispose } from '@vueuse/core'

// Always revert the anime instance when the composable's scope ends
tryOnScopeDispose(() => {
  instance.value?.revert()
  instance.value = null  // release reference
})
```

### Cleanup on re-creation

When a watchable composable re-creates the anime instance (target changed, params changed), **revert the old one first**:

```ts
watchEffect(() => {
  if (!mounted.value) return
  const targets = normalizeAnimeTarget(target)

  // Clean up previous instance before creating new one
  if (instance.value) instance.value.revert()

  instance.value = someAnimeFactory(targets, toValue(parameters) || {})
})
```

### Cleanup checklist

- [ ] `tryOnScopeDispose` calls `.revert()` on the instance
- [ ] Old instances are `.revert()`-ed before replacement in watch callbacks
- [ ] `shallowRef` arrays (like `useSplitText`'s `lines/words/chars`) are reset to `[]` on dispose
- [ ] No `setInterval` / `setTimeout` / `requestAnimationFrame` left without cleanup

---

## Step 4: Reactivity Pattern

### Dual-mode composables (Watchable vs Instant)

Some composables support two modes based on whether they're called inside a Vue component instance:

```ts
import { AnimationComponentFlags, getAnimationComponentFlag } from '../utils/normalizers/instance-management'

const flag = getAnimationComponentFlag()

if (flag === AnimationComponentFlags.Watchable) {
  // Inside a component: use watchEffect for reactive re-creation
  watchEffect(() => { ... })
  tryOnScopeDispose(() => { ... })
}
else {
  // Outside a component (e.g., in a utility): one-shot via nextTick
  nextTick(() => { ... })
}
```

Used by: `useAnimate`, `useAnimatable`, `useWaapiAnimate`
Not used by: `useDraggable`, `useLayout`, `useSplitText` (always watchable)

Use dual-mode when the composable wraps a simple animate-like call. Skip it when the composable manages complex state (drag controllers, layout engines, text splitters).

### Return types

| When returning | Pattern | Used by |
|---|---|---|
| The anime instance directly | `return toReactive(shallowRef)` | `useAnimate`, `useAnimatable`, `useWaapiAnimate` |
| A proxy with methods | `return createProxy(shallowRef)` | `useDraggable` |
| A custom object with refs | Return `{ ref1, ref2, computed1 }` | `useSplitText`, `useLayout` |

### Target normalization

Always normalize targets through the helpers in `../utils/normalize-targets`:

- `normalizeAnimeTarget` — for standard anime targets (string, ref, element)
- `normalizeWaapiAnimeTarget` — for WAAPI targets
- `normalizeLayoutTarget` — for layout/single-element targets
- `normalizeSplitTextTarget` — for text splitting targets
- `normalizeDraggableContainer` — for draggable containers

Add a new normalizer if the API expects a different target shape.

### Reffable props

For composables where individual options should be reactive (like `useDraggable`), use the `makeReffable` pattern from `../utils/normalizers/make-reffable.ts`:

```ts
import { normalizeReffable, type MakeRefable } from '../utils/normalizers/make-reffable'

type Options = MakeRefable<OriginalParams, 'prop1' | 'prop2', InstanceType>
```

This lets users pass either a raw value or a `Ref`/getter for those props.

---

## Step 5: Integrate

1. **Vite optimizeDeps** — If wrapping a new anime submodule, add to `src/module.ts:37-44`
2. **Types** — Export any shared types from `src/runtime/app/utils/types.ts`
3. **Docs** — Create a page in `docs/content/2.composables/` (use the `scaffold-composable-sample` skill)
4. **Playground** — Create a test page in `playground/pages/` (use the `create-playground-page` skill)
5. **Tests** — Write utility tests in `test/suites/utilities/` (use the `create-utility-tests` skill)

---

## Step 6: Validate

```sh
pnpm test:types    # Must pass — no any, no unsafe casts
pnpm test          # All 4 vitest projects must pass
pnpm dev           # Verify in playground — SSR + client navigation
```

Test SSR explicitly: load the playground page via full page refresh (server render), then navigate to it via client-side link (client render). Both must work without errors.

---

## Checklist

### SSR
- [ ] All DOM access gated behind `useMounted()` or `nextTick()`
- [ ] No browser globals (`document`, `window`, `Element`) at module/composable top level
- [ ] Safe initial value for `shallowRef` (null or no-op instance)

### Memory
- [ ] `tryOnScopeDispose` reverts and nullifies the instance
- [ ] Old instances reverted before replacement in watch callbacks
- [ ] No leaked intervals, timeouts, or animation frames

### Version Adaptivity
- [ ] Checked API availability against anime.js version range (>=4.3.5)
- [ ] APIs from 4.3.6+ use dynamic import with fallback
- [ ] Composable returns a no-op/warns when API unavailable — never throws
- [ ] Minimum version documented in JSDoc `@since` tag

### Code Quality
- [ ] Strict TypeScript — no `any`, no `as` casts
- [ ] Targets normalized via `normalize-targets` helpers
- [ ] Follows existing naming: `use<Name>.ts` exporting `function use<Name>`
- [ ] New anime submodule added to Vite `optimizeDeps` if needed

### Deliverables
- [ ] Composable in `src/runtime/app/composables/`
- [ ] Docs page in `docs/content/2.composables/`
- [ ] Playground page in `playground/pages/`
- [ ] Tests in `test/suites/utilities/`
- [ ] `pnpm test:types` and `pnpm test` pass
