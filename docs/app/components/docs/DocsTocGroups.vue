<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

const props = defineProps<{
  title: string
  links: TocLink[]
}>()

const { activeHeadings, updateHeadings } = useScrollspy()

const ids = computed(() => props.links.flatMap(group => [group.id, ...(group.children ?? []).map(child => child.id)]))

function observe() {
  updateHeadings(ids.value.flatMap((id) => {
    const el = document.getElementById(id)
    return el ? [el] : []
  }))
}

onMounted(() => nextTick(observe))
watch(ids, () => nextTick(observe))

const active = computed(() => props.links
  .flatMap(group => group.children ?? [])
  .find(child => activeHeadings.value.includes(child.id))?.id)

const closed = ref<string[]>([])

function toggle(id: string) {
  closed.value = closed.value.includes(id)
    ? closed.value.filter(item => item !== id)
    : [...closed.value, id]
}

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(history.state, '', `#${id}`)
}
</script>

<template>
  <nav
    :aria-label="props.title"
    class="sticky top-(--ui-header-height) flex max-h-[calc(100vh-var(--ui-header-height))] flex-col gap-4 overflow-y-auto py-8"
  >
    <p class="px-2 text-sm font-semibold text-highlighted">
      {{ props.title }}
    </p>
    <ul class="flex flex-col gap-1">
      <li
        v-for="group in props.links"
        :key="group.id"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] font-semibold text-muted transition-colors hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
          :aria-expanded="!closed.includes(group.id)"
          @click="toggle(group.id)"
        >
          <span>{{ group.text }}</span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-3.5 shrink-0 transition-transform"
            :class="{ 'rotate-90': !closed.includes(group.id) }"
          />
        </button>
        <ul
          v-show="!closed.includes(group.id)"
          class="ms-2.5 mt-1 mb-2 flex flex-col gap-0.5 border-s border-default"
        >
          <li
            v-for="link in group.children"
            :key="link.id"
          >
            <a
              :href="`#${link.id}`"
              class="-ms-px flex border-s py-1.5 ps-3 pe-2 text-sm transition-colors"
              :class="active === link.id
                ? 'border-primary font-medium text-primary'
                : 'border-transparent text-muted hover:border-accented hover:text-highlighted'"
              :aria-current="active === link.id ? 'location' : undefined"
              @click.prevent="go(link.id)"
            >{{ link.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
