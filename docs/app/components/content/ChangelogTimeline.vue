<template>
  <div
    class="relative mt-12 ps-8 before:absolute before:inset-y-2 before:start-0 before:w-px before:bg-(--ui-border-accented)
      [&>h2]:my-16 [&>h2]:h-0 [&>h2]:overflow-hidden [&>h2]:border-0 [&>h2]:border-t [&>h2]:border-accented [&>h2]:p-0 [&>h2]:text-transparent [&>h2:first-child]:my-0 [&>h2:first-child]:border-t-0
      [&>h3]:mt-16 [&>h3]:mb-1 [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:tracking-tight [&>h2+h3]:mt-0 [&>h3+p]:mt-0 [&>h3+p]:mb-6"
  >
    <slot />
  </div>
</template>
