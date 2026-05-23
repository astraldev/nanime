# Code Quality Rules

- **TypeScript**: Strict mode. No `any` types. No `as` type assertions.
- **Vue**: Composition API only. No Options API.
- **Reactivity**: Prefer `@vueuse/core` utilities (`useMounted`, `tryOnScopeDispose`, `toReactive`)
- **Testing**: Real components via `mountSuspended` — no mocks. All tests must pass alongside `pnpm test:types`.
- **Linting**: ESLint enforced via lefthook pre-commit. Run `pnpm lint` before submitting.
- **Components**: Prefix with module prefix (default `A`). Global registration. Place in `src/runtime/app/components/`.
