---
name: Create Utility Tests
description: Guide for creating utility tests in this project using Nuxt test utils and component mounting.
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


# Rules to follow

1. After a page is created, add a section to the index.vue file at `playground/app/pages/index.vue`
2. Ensure that no components are created multiple times, always use the components from the `playground/app/components` directory or create one there
   if it doesn't exist and is absolutely needed
3. When creating the page for components and composables, ensure that the examples are fully structured, and cover the special props in the used component
4. Ensure that "as any" or so, is not being used for props and data

# Verification

1. ensure `pnpm test:types` passes
2. ensure `pnpm test` passes
