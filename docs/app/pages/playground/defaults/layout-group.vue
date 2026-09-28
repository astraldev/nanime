<script setup lang="ts">
import { spring } from '#nanime/easings'
import type { CompareColumn, TuningSlider } from '~/utils/playground'

useSeoMeta({ title: 'AnimeLayoutGroup defaults playground', robots: 'noindex, nofollow' })

const tuning = ref({ bounce: 0.15, duration: 300 })

const sliders: TuningSlider<'bounce' | 'duration'>[] = [
  { key: 'bounce', label: 'New default: spring bounce', min: 0, max: 0.8, step: 0.05 },
  { key: 'duration', label: 'New default: spring duration', min: 100, max: 800, step: 10, unit: 'ms' },
]

const columns = computed<CompareColumn[]>(() => [
  {
    badge: 'Old default',
    name: 'AnimeJS default',
    lines: ['350ms inOut(3.5)'],
    defaults: { layoutGroup: { layoutOptions: { duration: 350, ease: 'inOut(3.5)' } } },
  },
  {
    badge: 'Option A',
    name: 'Same as the group move',
    lines: ['350ms out(3)'],
    defaults: { layoutGroup: { layoutOptions: { duration: 350, ease: 'out(3)' } } },
  },
  {
    badge: 'New default',
    name: 'Spring',
    lines: [`spring bounce ${tuning.value.bounce} ${tuning.value.duration}ms`],
    defaults: { layoutGroup: { layoutOptions: { ease: spring({ bounce: tuning.value.bounce, duration: tuning.value.duration }) } } },
  },
])

const files = [
  { name: 'Brief.pdf', icon: 'i-lucide-file-text' },
  { name: 'Logo.svg', icon: 'i-lucide-image' },
  { name: 'Budget.xlsx', icon: 'i-lucide-sheet' },
  { name: 'Notes.md', icon: 'i-lucide-file' },
  { name: 'Demo.mp4', icon: 'i-lucide-film' },
  { name: 'Photos', icon: 'i-lucide-folder' },
]
const gridView = ref(false)

const plans = [
  { name: 'Starter', price: '€0', perks: ['1 project', 'Community support'] },
  { name: 'Pro', price: '€12', perks: ['Unlimited projects', 'Email support', 'Custom domains'] },
  { name: 'Team', price: '€40', perks: ['Everything in Pro', 'SSO', 'Audit log', 'Priority support'] },
]
const expandedPlan = ref<string | null>(null)

const faqs = [
  { question: 'Can I cancel anytime?', answer: 'Yes. Your plan stays active until the end of the billing period.' },
  { question: 'Do you offer refunds?', answer: 'Within 14 days of purchase, no questions asked.' },
  { question: 'Is there a student discount?', answer: 'Students get Pro for free with a valid school email.' },
]
const openFaq = ref<number | null>(null)

const sidebarCollapsed = ref(false)
const navItems = [
  { label: 'Home', icon: 'i-lucide-house' },
  { label: 'Inbox', icon: 'i-lucide-inbox' },
  { label: 'Reports', icon: 'i-lucide-chart-bar' },
  { label: 'Settings', icon: 'i-lucide-settings' },
]

const priorities = ['High', 'Medium', 'Low'] as const
type Priority = typeof priorities[number]
const issues = ref<{ id: number, title: string, priority: Priority }[]>([
  { id: 1, title: 'Login fails on Safari', priority: 'Medium' },
  { id: 2, title: 'Typo on pricing page', priority: 'Low' },
  { id: 3, title: 'Export times out', priority: 'High' },
  { id: 4, title: 'Dark mode flicker', priority: 'Low' },
])
const sortedIssues = computed(() => [...issues.value].sort((a, b) => priorities.indexOf(a.priority) - priorities.indexOf(b.priority)))

function cyclePriority(id: number) {
  const issue = issues.value.find(item => item.id === id)
  if (issue) issue.priority = priorities[(priorities.indexOf(issue.priority) + 1) % priorities.length] ?? 'Low'
}

const aligns = ['justify-start', 'justify-center', 'justify-end'] as const
const align = ref<typeof aligns[number]>('justify-start')

const readMore = ref(false)
</script>

<template>
  <UContainer class="py-10 space-y-12">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">
        AnimeLayoutGroup defaults
      </h1>
      <p class="text-sm text-muted">
        Each section is one real use case, run with three candidate defaults. The groups inside take no <code>layoutOptions</code>; the column sets the defaults. All columns share state, so one click runs all three.
      </p>
    </header>

    <PlaygroundTuning
      v-model="tuning"
      :columns="columns"
      :sliders="sliders"
    />

    <PlaygroundCompare
      title="List and grid view"
      caption="A file browser switching between list and grid. Every item changes position and size at once."
      :columns="columns"
    >
      <template #controls>
        <UButton
          :icon="gridView ? 'i-lucide-list' : 'i-lucide-layout-grid'"
          @click="gridView = !gridView"
        >
          {{ gridView ? 'List view' : 'Grid view' }}
        </UButton>
      </template>
      <AnimeLayoutGroup
        :deps="[gridView]"
        :class="gridView ? 'grid grid-cols-3 gap-2' : 'flex flex-col gap-1'"
      >
        <div
          v-for="file in files"
          :key="file.name"
          class="flex rounded-md border border-default bg-default text-sm"
          :class="gridView ? 'flex-col items-center gap-1 p-3' : 'items-center gap-2 px-3 py-1.5'"
        >
          <UIcon
            :name="file.icon"
            :class="gridView ? 'size-8' : 'size-4'"
          />
          <span class="truncate">{{ file.name }}</span>
        </div>
      </AnimeLayoutGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Expand a card"
      caption="Click a plan to show its perks, click again to close it. The cards below get pushed down."
      :columns="columns"
    >
      <AnimeLayoutGroup
        :deps="[expandedPlan]"
        class="flex flex-col gap-2"
      >
        <button
          v-for="plan in plans"
          :key="plan.name"
          class="rounded-lg border border-default bg-default p-3 text-left text-sm"
          @click="expandedPlan = expandedPlan === plan.name ? null : plan.name"
        >
          <span class="flex justify-between font-medium">
            {{ plan.name }}
            <span>{{ plan.price }}</span>
          </span>
          <ul
            v-if="expandedPlan === plan.name"
            class="mt-2 space-y-1 text-muted"
          >
            <li
              v-for="perk in plan.perks"
              :key="perk"
            >
              {{ perk }}
            </li>
          </ul>
        </button>
      </AnimeLayoutGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Accordion"
      caption="An FAQ where only one answer is open. Opening another closes the first, so one item grows while another shrinks."
      :columns="columns"
    >
      <AnimeLayoutGroup
        :deps="[openFaq]"
        class="divide-y divide-default rounded-lg border border-default bg-default"
      >
        <div
          v-for="(faq, index) in faqs"
          :key="faq.question"
          class="px-3 py-2 text-sm"
        >
          <button
            class="flex w-full items-center justify-between py-1 text-left font-medium"
            @click="openFaq = openFaq === index ? null : index"
          >
            {{ faq.question }}
            <UIcon
              name="i-lucide-chevron-down"
              :class="openFaq === index ? 'rotate-180' : ''"
            />
          </button>
          <p
            v-if="openFaq === index"
            class="pb-1 text-muted"
          >
            {{ faq.answer }}
          </p>
        </div>
      </AnimeLayoutGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Collapsible sidebar"
      caption="Collapse the sidebar to icons. The sidebar shrinks and the content next to it grows into the space."
      :columns="columns"
    >
      <template #controls>
        <UButton
          icon="i-lucide-panel-left"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          {{ sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar' }}
        </UButton>
      </template>
      <AnimeLayoutGroup
        :deps="[sidebarCollapsed]"
        class="flex h-48 gap-2 overflow-hidden rounded-md bg-elevated/50 p-2"
      >
        <nav
          class="flex shrink-0 flex-col gap-1 rounded-md bg-default p-1"
          :class="sidebarCollapsed ? 'w-10' : 'w-32'"
        >
          <span
            v-for="item in navItems"
            :key="item.label"
            class="flex items-center gap-2 rounded px-2 py-1.5 text-sm"
          >
            <UIcon
              :name="item.icon"
              class="size-4 shrink-0"
            />
            <span v-if="!sidebarCollapsed">{{ item.label }}</span>
          </span>
        </nav>
        <main class="flex-1 space-y-2 rounded-md bg-default p-3">
          <div class="h-3 w-1/2 rounded bg-accented" />
          <div class="h-3 w-full rounded bg-accented" />
          <div class="h-3 w-3/4 rounded bg-accented" />
        </main>
      </AnimeLayoutGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Re-sort after an edit"
      caption="Click a priority badge to change it. The list stays sorted by priority, so the issue moves to its new place."
      :columns="columns"
    >
      <AnimeLayoutGroup
        :deps="[sortedIssues]"
        class="flex flex-col gap-2"
      >
        <div
          v-for="issue in sortedIssues"
          :key="issue.id"
          class="flex items-center justify-between rounded-lg border border-default bg-default px-3 py-2 text-sm"
        >
          {{ issue.title }}
          <UBadge
            as="button"
            :label="issue.priority"
            :color="issue.priority === 'High' ? 'error' : issue.priority === 'Medium' ? 'warning' : 'neutral'"
            variant="subtle"
            @click="cyclePriority(issue.id)"
          />
        </div>
      </AnimeLayoutGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Toolbar alignment"
      caption="Change the alignment. Every button slides sideways by a different amount."
      :columns="columns"
    >
      <template #controls>
        <PlaygroundChoice
          v-model="align"
          :options="aligns"
          :label="item => item.replace('justify-', '')"
        />
      </template>
      <AnimeLayoutGroup
        :deps="[align]"
        class="flex gap-1 rounded-md bg-elevated/50 p-2"
        :class="align"
      >
        <UButton
          v-for="icon in ['i-lucide-bold', 'i-lucide-italic', 'i-lucide-underline', 'i-lucide-link']"
          :key="icon"
          size="sm"
          color="neutral"
          variant="outline"
          :icon="icon"
        />
      </AnimeLayoutGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Read more"
      caption="Expand the first post's text. The post grows and the posts below are pushed down."
      :columns="columns"
    >
      <AnimeLayoutGroup
        :deps="[readMore]"
        class="flex flex-col gap-2"
      >
        <article class="space-y-1 rounded-lg border border-default bg-default p-3 text-sm">
          <p class="font-medium">
            Shipping our new editor
          </p>
          <p
            class="text-muted"
            :class="readMore ? '' : 'line-clamp-2'"
          >
            We rebuilt the editor from scratch this quarter. It loads twice as fast, handles documents ten times larger, and finally supports real-time collaboration. This post walks through what changed, what we learned about CRDTs along the way, and what comes next for plugins and offline mode.
          </p>
          <UButton
            size="xs"
            color="neutral"
            variant="link"
            class="px-0"
            @click="readMore = !readMore"
          >
            {{ readMore ? 'Show less' : 'Read more' }}
          </UButton>
        </article>
        <article
          v-for="title in ['Q3 roadmap', 'Hiring update']"
          :key="title"
          class="rounded-lg border border-default bg-default p-3 text-sm font-medium"
        >
          {{ title }}
        </article>
      </AnimeLayoutGroup>
    </PlaygroundCompare>
  </UContainer>
</template>
