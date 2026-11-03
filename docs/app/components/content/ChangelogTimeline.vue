<template>
  <div
    class="relative mt-12 ps-10 before:absolute before:inset-y-2 before:start-[5px] before:w-px before:bg-(--ui-border-accented)
      [&>h2]:relative [&>h2]:mt-16 [&>h2]:mb-1 [&>h2]:border-0 [&>h2]:pt-0 [&>h2:first-child]:mt-0 [&>h2+p]:mt-0 [&>h2+p]:mb-6
      [&>h2]:before:absolute [&>h2]:before:top-1/2 [&>h2]:before:-start-[calc(2.5rem-1px)] [&>h2]:before:size-[9px] [&>h2]:before:-translate-y-1/2 [&>h2]:before:rounded-full [&>h2]:before:border [&>h2]:before:border-accented [&>h2]:before:bg-default
      [&>h2:first-child]:before:border-primary [&>h2:first-child]:before:bg-primary"
  >
    <slot />
  </div>
</template>
