# Dependency Rules

pnpm 12, strict layout: no `shamefully-hoist`, no `.npmrc`. All pnpm settings live in `pnpm-workspace.yaml`.

- **Declare what you import**: every bare import in `docs/` (Vue, TS, and CSS `@import`) must be a direct dependency in `docs/package.json`, even when docus already brings it in. Match the version docus uses so pnpm keeps one copy.
- **Hoisting**: never turn `shamefully-hoist` back on. It put an h3 v2 prerelease (from a docs dependency) at the root; `@nuxt/test-utils` reads the root h3 version to pick its fetch implementation, took the v2 path, and failed on `import('h3-next/generic')`. No h3 override or `h3-next` alias is needed with a strict layout.
- **`publicHoistPattern`**: only for packages a Nuxt module adds to `vite.optimizeDeps.include` (warning `NUXT_B7002`). Add the exact name, never a wildcard that could catch `h3`.
- **Peer warnings**: fix by version first. Use `peerDependencyRules.allowedVersions` only for an upstream package whose own dependency misses its own peer range, with a comment naming the upstream.
- **Overrides**: only for a live `pnpm audit` advisory, with the GHSA id in a comment. Drop it once upstream catches up.
- **Build scripts**: new native deps go in `allowBuilds`; pnpm 12 fails the install on unapproved ones.
- **Release age**: pnpm 12 rejects versions published in the last 24h. If an install flags one, wait or pick the previous version; don't relax the policy.

## Symptoms of an undeclared docs dependency

- Dev server responds 500 with `IPC connection closed`; the real error is above it in the log.
- `Unable to resolve @import "tailwindcss"` or `ENOENT ... open 'tailwindcss'`.
- `NUXT_B7002 ... could not be resolved`.

## Local pnpm

`packageManager` pins pnpm 12. An older global pnpm (10.x) can't switch to it: pnpm 10 installs the new version without running scripts, and pnpm 12 needs its install script to put its native binary in place, so the switch fails with `ENOEXEC`. Update the global pnpm (`pnpm self-update`) instead. CI uses `pnpm/action-setup`, since corepack can't run pnpm 12 either.
