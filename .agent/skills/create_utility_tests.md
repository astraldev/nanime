---
name: Create Utility Tests
description: Guide for creating utility tests in this project using Nuxt test utils and component mounting.
---
# AI Guide: Creating Utility Tests

This guide outlines the established patterns and best practices for creating utility tests in this project. Follow these guidelines to ensure consistency, type safety, and reliability.

## 1. Environment Setup

Tests are organized into projects within `vitest.config.ts`. The `suites` project is specifically configured for Nuxt utilities.

- **Location**: Place utility tests in `test/suites/utilities/`.
- **Environment Tag**: The `suites` project handles the environment, but you may see `// @vitest-environment nuxt` in older files.

## 2. Component-Based Testing

Do **not** use mocks for DOM elements or Vue instances. Instead, use **real components**.

### Pattern
1.  **Create a Test Component**: Create a `.vue` file (e.g., `test-component.vue`) in the test suite directory.
    - Use `<script setup lang="ts">` and `useTemplateRef` for type-safe refs.
    - Explicitly `defineExpose` any refs needed for testing.

    ```vue
    <!-- test-component.vue -->
    <script setup lang="ts">
    import { useTemplateRef } from 'vue'

    const myRef = useTemplateRef('myRef')
    defineExpose({ myRef })
    </script>

    <template>
      <div ref="myRef"></div>
    </template>
    ```

2.  **Mount with `mountSuspended`**: specific to Nuxt, handles the environment correctly.

    ```typescript
    import { mountSuspended } from '@nuxt/test-utils/runtime'
    import TestComponent from './test-component.vue'

    const wrapper = await mountSuspended(TestComponent)
    // Access exposed refs via wrapper.vm, casting to the Component instance type if needed
    const vm = wrapper.vm
    ```

## 3. Strict Typing

The project enforces strict TypeScript. **Avoid `any`**.

- **Explicit Casts**: When accessing `wrapper.element` or `find()`, cast to the specific DOM type.
    ```typescript
    const div = wrapper.find('.target').element as HTMLElement
    const svg = wrapper.find('svg').element as SVGElement
    ```
- **Type Imports**: Import types from `@vueuse/core` or other libraries as needed.

## 4. Test Structure

### Grouping logic
If testing multiple functions with similar signatures (e.g., variations of a utility), use a data-driven approach to share common tests.

```typescript
const variants = [
  { name: 'variantA', fn: funcA },
  { name: 'variantB', fn: funcB }
]

describe('Common Behavior', () => {
  variants.forEach(({ name, fn }) => {
    describe(name, () => {
       // Shared tests
    })
  })
})
```

### Separating Specifics
Create separate `describe` blocks for behaviors unique to specific functions or edge cases.

```typescript
describe('funcA (Specific)', () => {
  it('should handle edge case X', () => { ... })
})
```

## 5. Do Not Mock Core Utils

- **Avoid**: `vi.mock('vue')`, `vi.mock('#imports')`.
- **Use**: Real imports from `#imports` or relative paths to `src/runtime`.

## Summary Checklist
- [ ] No `any` casts.
- [ ] No `vi.mock` for DOM/Vue basics.
- [ ] Uses `mountSuspended`.
- [ ] Uses a real `.vue` component with `useTemplateRef` and `defineExpose`.
- [ ] Tests grouped by behavior (Common vs Specific).
