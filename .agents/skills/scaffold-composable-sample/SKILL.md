---
name: scaffold-composable-sample
description: Scaffolds a documentation sample for a new composable using the project's standard structure.
---

# Scaffold Composable Sample

## Purpose

Standardize the creation of documentation samples for Nuxt AnimeJS composables. Ensures consistent structure including Type Definitions, Arguments, Usage (Script + Template), and Return Values.

## When to Use

- Creating documentation for a new composable.
- Updating an existing composable's documentation to match the project standard.
- "Scaffold a sample for [composable name]"

## Core Structure

### 1. Frontmatter
Standard Docus frontmatter with title, Description, and **navigation icon** (pick a unique semantic icon from Phosphor icons, e.g., `i-ph-lightning` for WAAPI).

**Instant Play Badge**: If the composable supports being called outside a Vue instance (after mounting), include the following badge linked to the composables index:
```markdown
::nuxt-link{to="/composables#instant-play"}
:badge{icon="mage:zap-fill" label="Instant Play" size="md" variant="soft"}
::
```

### 2. Type Definition & Arguments
**Type Definition**: Include **ONLY** the function signature at the top.
**Arguments**: Use `::field-group` and `::field` components. Use specific types extracted from `src/runtime/app/utils/normalize-targets.ts` (e.g., `AnimeTargets`, `WaapiTargets`) to ensure accuracy.

### 3. Usage Section
Use `::render-code-block-preview` component pointing to a demo component in `examples/composables/`.
```markdown
::render-code-block-preview{src="examples/composables/MyDemo.vue"}
::
```

### 4. Return Value
- Describe the returned object (e.g., "Returns a `ProxyReturns<Draggable>` object").
- **Property Table**: ONLY include a markdown table if the output value is **NOT** returned by `createProxy`, `reactive`, or `ref`.
- **Caution**: If using `ProxyReturns`, add a `::caution` block about properties being `undefined` until initialization.

### 5. API Section
Add an `## API` section with a `### Types` sub-section at the bottom of the file. This is where all detailed type aliases and helper types should live.

## Workflow

1.  **Analyze Source**: Read the composable source file to determine input types and return structure.
2.  **Determine Targets**: Check `normalize-targets.ts` for accepted target types.
3.  **Draft Content**:
    - **Frontmatter**: Include semantic `icon`.
    - **Type Definition**: Function signature only.
    - **Usage**: reference a demo component.
    - **Return Value**: Summary of return type + optional caution.
    - **API**: Detailed types at the bottom.
4.  **Review**: Ensure no generic types (like `Object`) are used where specific types exist.

## Examples

### Input
"Scaffold sample for `useMyAnimation`"

### Output
```markdown
---
title: useMyAnimation
description: Documentation for useMyAnimation.
navigation:
  icon: i-ph-star
---

# useMyAnimation

Brief description.

## Type Definition

\`\`\`ts
function useMyAnimation(target: MyAnimationTargets, options: Options): ReturnType
\`\`\`

### Arguments

::field-group
  ::field{name="target" type="MyAnimationTargets" required}
  Description.
  ::
  ::field{name="options" type="Options"}
  Description.
  ::
::

## Usage

::render-code-block-preview{src="examples/composables/MyAnimationDemo.vue"}
::

## Return Value

Returns a `ReturnType` object.

## API

### Types

\`\`\`ts
type MyAnimationTargets = ... // from normalize-targets.ts
type Options = ...
\`\`\`
```
