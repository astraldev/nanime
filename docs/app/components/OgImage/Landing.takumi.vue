<script lang="ts" setup>
const { title, description } = defineProps<{ title?: string, description?: string }>()

const logo = '<svg xmlns="http://www.w3.org/2000/svg" width="112" height="120" viewBox="84 74 344 367"><path d="M124 401 V230 C124 144 186 114 256 114 C326 114 388 144 388 230 V304" fill="none" stroke="#f6f4f2" stroke-width="80" stroke-linecap="round" stroke-linejoin="round"/><rect x="348" y="358" width="80" height="80" rx="12" fill="#ff4b4b"/></svg>'

const palette = ['#ff4b4b', '#ff7d36', '#ffa828', '#ffcc2a', '#f9f640', '#b7ff54', '#8dff55', '#00ffaa', '#26f2d5', '#05dbe9', '#33b3f1', '#4d9cff', '#7c85ff', '#a369ff', '#c06ddf', '#e962bf']
const dots = palette.map((color, index) => ({ color, offset: Math.round(Math.sin(index / 2.5) * 14) }))
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center bg-[#252423] px-[80px] py-[64px]">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      class="flex w-[112px] h-[120px] mb-10"
      v-html="logo"
    />
    <h1
      v-if="title"
      class="m-0 mb-6 max-w-[1000px] text-center text-[60px] font-bold leading-[1.1] text-[#f6f4f2]"
    >
      {{ title?.slice(0, 60) }}
    </h1>
    <p
      v-if="description"
      class="m-0 max-w-[920px] text-center text-[26px] leading-[1.4] text-[#9ca3af]"
    >
      {{ description?.slice(0, 160) }}
    </p>
    <div class="flex items-center h-[44px] mt-12">
      <div
        v-for="dot in dots"
        :key="dot.color"
        class="w-[14px] h-[14px] mx-[5px] rounded-full"
        :style="{ backgroundColor: dot.color, transform: `translateY(${dot.offset}px)` }"
      />
    </div>
  </div>
</template>
