# Composable Rules

Full workflow: `.agents/skills/create-composable/SKILL.md`

Key constraints (quick reference):

- **SSR**: All DOM access gated behind `useMounted()` or `nextTick()`. No browser globals at top level.
- **Memory**: `tryOnScopeDispose` must revert + nullify. Old instances reverted before replacement.
- **Version adaptivity**: Module supports `animejs >=4.3.5`. APIs added after 4.3.5 must use dynamic import with no-op fallback — never throw.
- **Naming**: `use<Feature>.ts` exporting `function use<Feature>(...)`
- **Reactivity**: `shallowRef` for anime instances, `toReactive` or `createProxy` for return values
- **Targets**: Always normalize via helpers in `src/runtime/app/utils/normalize-targets`
- **Imports**: Runtime values from submodule paths (`animejs/animation`, `animejs/utils`, etc.) — never the top-level `'animejs'` barrel. Type-only imports from `'animejs'` are fine.
- **No registration needed**: `addImportsDir` auto-imports the composables directory
