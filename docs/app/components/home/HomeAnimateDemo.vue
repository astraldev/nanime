<template>
  <div class="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
    <HomeCodeCard
      file="app.vue"
      href="https://github.com/astraldev/nanime/blob/main/docs/app/components/home/HomePreview.vue"
    >
      <slot />
    </HomeCodeCard>
    <HomePreview />
  </div>
</template>
