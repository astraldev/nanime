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
Standard Docus frontmatter with title, description, and **navigation icon** (`i-ph-file-ts` for composables).

### 2. Type Definition & Arguments
**CRITICAL**: Extract exact types from `src/runtime/app/utils/normalize-targets.ts` (e.g., `AnimeTargets`, `WaapiTargets`) to ensure accuracy. Do not use loose types like `Object` or `Array`.

### 3. Usage Section
Must include `::code-group`:
- `ts` block with `[script]` filename/modifier showing setup.
- `vue` block with `[template]` filename/modifier showing the DOM structure.
- Clear, single example focusing on the primary use case.

### 4. Return Value
Detailed list of properties and methods returned by the composable.

## Workflow

1.  **Analyze Source**: Read the composable source file to determine input types and return structure.
2.  **Determine Targets**: Check `normalize-targets.ts` for accepted target types.
3.  **Draft Content**:
    - **Frontmatter**: Include `icon: i-ph-file-ts`.
    - **Type Definition**: TypeScript signature with mapped types.
    - **Usage**:
        ```markdown
        ::code-group
        \`\`\`ts [script]
        // script content
        \`\`\`
        \`\`\`vue [template]
        <!-- template content -->
        \`\`\`
        ::
        ```
    - **Return Value**: List of refs/methods.
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
  icon: i-ph-file-ts
---

# useMyAnimation

Brief description.

## Type Definition

\`\`\`ts
type MyAnimationTargets = ... // from normalize-targets.ts

function useMyAnimation(target: MyAnimationTargets, options: Options): ReturnType
\`\`\`

### Arguments
- **target**: Description.
- **options**: Description.

## Usage

::code-group
\`\`\`ts [script]
const { play } = useMyAnimation('.box', { duration: 1000 })
\`\`\`

\`\`\`vue [template]
<template>
  <div class="box" />
</template>
\`\`\`
::

## Return Value
- **play()**: method description.
```
