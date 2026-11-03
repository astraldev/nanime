<template>
  <div
    class="relative mt-12 ps-8 before:absolute before:inset-y-2 before:start-0 before:w-px before:bg-(--ui-border-accented)
      [&>h2]:mt-16 [&>h2]:mb-1 [&>h2]:border-0 [&>h2]:pt-0 [&>h2:first-child]:mt-0 [&>h2+p]:mt-0 [&>h2+p]:mb-6"
  >
    <slot />
  </div>
</template>
