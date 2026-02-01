<template>
  <div class="min-h-screen text-white mx-auto container max-w-screen-md">
    <nav
      v-if="$route.path !== '/'"
      class="rounded-xl backdrop-blur-sm sticky top-0 z-50"
    >
      <div class="mx-auto px-4">
        <div class="flex items-center h-16">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <Icon
              name="heroicons:arrow-left"
              class="w-5 h-5"
            />
            <span class="font-medium">Home</span>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main class="min-h-[calc(100vh-5rem)] flex flex-col w-full pb-12">
      <slot />
    </main>
  </div>
</template>
