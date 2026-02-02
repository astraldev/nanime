---
name: Create Playground Pages
description: Guide for creating pages in the playground for the module
---

# When to use

Use this skill when you need to create a page in the playground for testings


# How to create a page

Playground pages reflect the same structure of files at

```
src/runtime/app
```

1. Confirm the structure of the composable or component you want to create a page for
   e.g useSplitText which is at `src/runtime/app/composables/useSplitText.ts`
2. Create a page (a vue file) at the `playground/pages` directory, under the `composables` route
   e.g `playground/app/pages/composables/useSplitText.vue`
3. Use the premade components at `playground/app/components` to create the page. The components
   are already styled and ready to use. You do not need to import them. you can use it as PWrapper, PButton, ...etc
4. For module components, i.e components at the `src/runtime/app/components` directory, they should be imported based on their
   file name `playground/.nuxt/components.d.ts` as you see in this file. The format is A + file folder + file name. 
   e.g the component at `src/runtime/app/components/transition/Slide.vue` should be imported as `ATransitionSlide`
5. Depending on the component or composable being created, read from the anime-core/anime directory to see examples
   and how they are created

   Do not however use examples with utilites not created, or provided in the modules. thus, the only valid examples
   that can be created are those that use utilities already used in the module directory, i.e text, animate, animatable, layout.

   createTimeline, create scope in examples ...etc can not be used


# IMPORTANT RULES TO FOLLOW

1. **IMPORTANT** Ensure that "as" is not being used for props and data and composable returns and no data is casted
2. Do not modify the structure of the already created composable and component
3. After a page is created, add a section to the index.vue file at `playground/app/pages/index.vue`
4. Ensure that no components are created multiple times, always use the components from the `playground/app/components` directory or create one there
   if it doesn't exist and is absolutely needed
5. When creating the page for components and composables, ensure that the examples are fully structured, and cover the special props in the used component

# Best Practices

## VueUse Composables
- Prefer VueUse composables over manual event handling when available
- Common use cases: `useMouseInElement`, `useElementSize`, `useIntersectionObserver`, `useResizeObserver`
- Use reactive properties like `isOutside` for conditional logic

## TypeScript Safety
- Always use optional chaining (`?.()`) when calling methods on dynamically created objects
- Avoid using `as` type assertions unless absolutely necessary (e.g., edge cases with library type definitions)
- Let TypeScript infer types when possible

## Reactive Patterns
- Use `watchEffect` for side effects that depend on multiple reactive values
- Guard reactive effects with early returns when conditions aren't met
- Example: `if (isOutside.value) return` to limit execution scope

## Example: Mouse Tracking Pattern
```vue
const containerRef = useTemplateRef('container')
const { elementX, elementY, isOutside } = useMouseInElement(containerRef)

watchEffect(() => {
  if (isOutside.value) return
  // Your logic here using elementX.value, elementY.value
})
```

# Verification

1. ensure `pnpm test:types` passes
2. ensure `pnpm test` passes
