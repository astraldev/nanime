<script setup lang="ts">
import type { CompareColumn, TuningSlider } from '~/utils/playground'

useSeoMeta({ title: 'AnimeTransitionGroup defaults playground', robots: 'noindex, nofollow' })

const tuning = ref({
  enterDuration: 250,
  leaveDuration: 150,
  moveDuration: 350,
})

type TuningKey = keyof typeof tuning.value

const sliders: TuningSlider<TuningKey>[] = [
  { key: 'enterDuration', label: 'Enter duration', min: 50, max: 800, step: 10, unit: 'ms' },
  { key: 'leaveDuration', label: 'Leave duration', min: 50, max: 800, step: 10, unit: 'ms' },
  { key: 'moveDuration', label: 'Move duration', min: 50, max: 800, step: 10, unit: 'ms' },
]

const columns = computed<CompareColumn[]>(() => {
  const t = tuning.value
  return [
    {
      badge: 'Old default',
      name: 'fade, ease-out move',
      lines: ['enter: opacity 300ms out(3)', 'leave: opacity 200ms in(3)', 'move: 400ms out(3)'],
      defaults: {
        transitionGroup: {
          enterAnimation: { opacity: [0, 1], duration: 300, ease: 'out(3)' },
          leaveAnimation: { opacity: 0, duration: 200, ease: 'in(3)' },
          moveAnimation: { duration: 400, ease: 'out(3)' },
        },
      },
    },
    {
      badge: 'New default',
      name: 'faster fade, ease-out move',
      lines: [
        `enter: opacity ${t.enterDuration}ms out(3)`,
        `leave: opacity ${t.leaveDuration}ms in(3)`,
        `move: ${t.moveDuration}ms out(3)`,
      ],
      defaults: {
        transitionGroup: {
          enterAnimation: { opacity: [0, 1], duration: t.enterDuration, ease: 'out(3)' },
          leaveAnimation: { opacity: 0, duration: t.leaveDuration, ease: 'in(3)' },
          moveAnimation: { duration: t.moveDuration, ease: 'out(3)' },
        },
      },
    },
  ]
})

let nextId = 1000
const uid = () => nextId++
function pick<T>(list: readonly T[], fallback: T) {
  return list[Math.floor(Math.random() * list.length)] ?? fallback
}

interface Toast { id: number, text: string }
const toastTexts = ['File uploaded', 'Invite sent', 'Settings saved', 'Link copied', 'Comment posted']
const toasts = ref<Toast[]>([])

function dismissToast(id: number) {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

function notify() {
  const toast = { id: uid(), text: pick(toastTexts, 'Done') }
  toasts.value.push(toast)
  setTimeout(() => dismissToast(toast.id), 3000)
}

interface Task { id: number, text: string }
const taskTexts = ['Reply to Sam', 'Book flights', 'Review PR', 'Water plants', 'Pay invoice', 'Call the bank']
const tasks = ref<Task[]>(taskTexts.slice(0, 4).map(text => ({ id: uid(), text })))

function addTask() {
  tasks.value.unshift({ id: uid(), text: pick(taskTexts, 'New task') })
}

function completeTask(id: number) {
  tasks.value = tasks.value.filter(task => task.id !== id)
}

const tags = ref(['vue', 'nuxt', 'animation'])
const tagDraft = ref('')

function addTag() {
  const tag = tagDraft.value.trim().toLowerCase()
  if (tag && !tags.value.includes(tag)) tags.value.push(tag)
  tagDraft.value = ''
}

function removeTag(tag: string) {
  tags.value = tags.value.filter(item => item !== tag)
}

interface Product { id: number, name: string, category: 'Fruit' | 'Vegetable' | 'Bakery', price: number, rating: number }
const products: Product[] = [
  { id: 1, name: 'Apple', category: 'Fruit', price: 1.2, rating: 4.5 },
  { id: 2, name: 'Carrot', category: 'Vegetable', price: 0.6, rating: 3.9 },
  { id: 3, name: 'Baguette', category: 'Bakery', price: 2.4, rating: 4.8 },
  { id: 4, name: 'Mango', category: 'Fruit', price: 2.1, rating: 4.7 },
  { id: 5, name: 'Leek', category: 'Vegetable', price: 1.1, rating: 3.2 },
  { id: 6, name: 'Croissant', category: 'Bakery', price: 1.8, rating: 4.9 },
  { id: 7, name: 'Pear', category: 'Fruit', price: 1.4, rating: 4.1 },
  { id: 8, name: 'Kale', category: 'Vegetable', price: 2.9, rating: 3.6 },
]
const categories = ['All', 'Fruit', 'Vegetable', 'Bakery'] as const
const category = ref<typeof categories[number]>('All')
const filteredProducts = computed(() => products.filter(product => category.value === 'All' || product.category === category.value))

const search = ref('')
const people = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Linus Torvalds', 'Margaret Hamilton', 'Dennis Ritchie', 'Barbara Liskov', 'Ken Thompson']
const matchingPeople = computed(() => people.filter(name => name.toLowerCase().includes(search.value.toLowerCase())))

const sortKeys = ['name', 'price', 'rating'] as const
const sortKey = ref<typeof sortKeys[number]>('name')
const sortedProducts = computed(() => [...products].sort((a, b) => {
  if (sortKey.value === 'name') return a.name.localeCompare(b.name)
  if (sortKey.value === 'price') return a.price - b.price
  return b.rating - a.rating
}))

interface CartLine { id: number, product: Product, quantity: number }
const cart = ref<CartLine[]>([])

function addToCart(product: Product) {
  const line = cart.value.find(item => item.product.id === product.id)
  if (line) line.quantity++
  else cart.value.push({ id: uid(), product, quantity: 1 })
}

function removeFromCart(id: number) {
  cart.value = cart.value.filter(line => line.id !== id)
}

interface Message { id: number, text: string, mine: boolean }
const replies = ['Sounds good!', 'On it.', 'Can we do Friday?', 'Haha yes', '👍']
const messages = ref<Message[]>([
  { id: uid(), text: 'Are we still on for lunch?', mine: false },
])

function pushMessage(text: string, mine: boolean) {
  messages.value.push({ id: uid(), text, mine })
  if (messages.value.length > 6) messages.value.splice(0, messages.value.length - 6)
}

function send() {
  pushMessage('Yes, 12:30 works', true)
  setTimeout(() => pushMessage(pick(replies, 'Ok'), false), 700)
}

interface Note { id: number, title: string }
const notes = ref<Note[]>(['Groceries', 'Trip ideas', 'Gift list', 'Meeting notes', 'Recipes'].map(title => ({ id: uid(), title })))

function pinNote(id: number) {
  const note = notes.value.find(item => item.id === id)
  if (note) notes.value = [note, ...notes.value.filter(item => item.id !== id)]
}

const photos = ref<number[]>([])
const photoColors = ['bg-amber-500', 'bg-rose-500', 'bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500']

function loadPhotos() {
  photos.value = Array.from({ length: 6 }, uid)
}
</script>

<template>
  <UContainer class="py-10 space-y-12">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">
        AnimeTransitionGroup defaults
      </h1>
      <p class="text-sm text-muted">
        Each section is one real use case, run with the old defaults on the left and the new, 50ms faster ones on the right. The groups inside take no animation props; the column sets the defaults. Both columns share state, so one click runs both.
      </p>
    </header>

    <PlaygroundTuning
      v-model="tuning"
      :columns="columns"
      :sliders="sliders"
    />

    <PlaygroundCompare
      title="Toast stack"
      caption="Notify adds a toast at the bottom of the stack. Each one leaves after 3 seconds, or click it. Spam Notify to see many enter, leave and move at once."
      :columns="columns"
    >
      <template #controls>
        <UButton @click="notify">
          Notify
        </UButton>
      </template>
      <div class="relative h-72 overflow-hidden rounded-md bg-elevated/50">
        <AnimeTransitionGroup class="absolute bottom-3 right-3 flex w-56 flex-col gap-2">
          <button
            v-for="toast in toasts"
            :key="toast.id"
            class="flex items-center gap-2 rounded-lg border border-default bg-default px-3 py-2 text-left text-sm shadow-lg"
            @click="dismissToast(toast.id)"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="text-primary"
            />
            {{ toast.text }}
          </button>
        </AnimeTransitionGroup>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="To-do list"
      caption="Add task inserts at the top and pushes the rest down. Tick a task to complete it; the rows below close the gap."
      :columns="columns"
    >
      <template #controls>
        <UButton @click="addTask">
          Add task
        </UButton>
      </template>
      <AnimeTransitionGroup
        tag="ul"
        class="relative space-y-2"
      >
        <li
          v-for="task in tasks"
          :key="task.id"
          class="flex items-center gap-3 rounded-lg border border-default bg-default px-3 py-2 text-sm"
        >
          <button
            class="size-4 rounded-full border border-accented hover:bg-primary"
            @click="completeTask(task.id)"
          />
          {{ task.text }}
        </li>
      </AnimeTransitionGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Tag input"
      caption="Type a tag and press Enter. Remove one with its x; the chips after it reflow, sometimes onto another line."
      :columns="columns"
    >
      <template #controls>
        <UInput
          v-model="tagDraft"
          placeholder="Add a tag and press Enter"
          @keydown.enter="addTag"
        />
      </template>
      <AnimeTransitionGroup class="relative flex min-h-10 flex-wrap gap-2 rounded-md border border-default p-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="flex items-center gap-1 rounded-full bg-primary/15 py-0.5 pl-2.5 pr-1 text-sm text-primary"
        >
          {{ tag }}
          <button
            class="grid size-4 place-items-center rounded-full hover:bg-primary/25"
            @click="removeTag(tag)"
          >
            <UIcon
              name="i-lucide-x"
              class="size-3"
            />
          </button>
        </span>
      </AnimeTransitionGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Filter by category"
      caption="Pick a category. Cards leave, enter and move in the same update."
      :columns="columns"
    >
      <template #controls>
        <PlaygroundChoice
          v-model="category"
          :options="categories"
        />
      </template>
      <AnimeTransitionGroup class="relative grid min-h-48 grid-cols-3 content-start gap-2">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="rounded-lg border border-default bg-default p-2 text-sm"
        >
          <p class="font-medium">
            {{ product.name }}
          </p>
          <p class="text-xs text-muted">
            {{ product.category }}
          </p>
        </div>
      </AnimeTransitionGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Search results"
      caption="Type to filter, for example “a”, then “al”, then clear it. Every key press is an update."
      :columns="columns"
    >
      <template #controls>
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search people"
        />
      </template>
      <AnimeTransitionGroup
        tag="ul"
        class="relative min-h-72 space-y-1"
      >
        <li
          v-for="name in matchingPeople"
          :key="name"
          class="rounded-md bg-elevated/50 px-3 py-1.5 text-sm"
        >
          {{ name }}
        </li>
      </AnimeTransitionGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Sortable table"
      caption="Sort by another column. Nothing enters or leaves; every row moves to its new spot."
      :columns="columns"
    >
      <template #controls>
        <PlaygroundChoice
          v-model="sortKey"
          :options="sortKeys"
          :label="key => `Sort by ${key}`"
        />
      </template>
      <div class="text-sm">
        <div class="grid grid-cols-3 border-b border-default px-2 py-1 text-xs text-muted">
          <span>Name</span>
          <span>Price</span>
          <span>Rating</span>
        </div>
        <AnimeTransitionGroup class="relative">
          <div
            v-for="product in sortedProducts"
            :key="product.id"
            class="grid grid-cols-3 border-b border-default bg-default px-2 py-1.5"
          >
            <span>{{ product.name }}</span>
            <span>€{{ product.price.toFixed(2) }}</span>
            <span>{{ product.rating }}</span>
          </div>
        </AnimeTransitionGroup>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Shopping cart"
      caption="Add products to the cart. Adding one twice only bumps its quantity. Remove lines with their x."
      :columns="columns"
    >
      <template #controls>
        <UButton
          v-for="product in products.slice(0, 4)"
          :key="product.id"
          size="sm"
          color="neutral"
          variant="outline"
          icon="i-lucide-plus"
          @click="addToCart(product)"
        >
          {{ product.name }}
        </UButton>
      </template>
      <div class="space-y-2">
        <p
          v-if="!cart.length"
          class="text-sm text-muted"
        >
          Your cart is empty.
        </p>
        <AnimeTransitionGroup
          tag="ul"
          class="relative space-y-2"
        >
          <li
            v-for="line in cart"
            :key="line.id"
            class="flex items-center justify-between rounded-lg border border-default bg-default px-3 py-2 text-sm"
          >
            <span>{{ line.product.name }} × {{ line.quantity }}</span>
            <span class="flex items-center gap-2">
              €{{ (line.product.price * line.quantity).toFixed(2) }}
              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                @click="removeFromCart(line.id)"
              />
            </span>
          </li>
        </AnimeTransitionGroup>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Chat"
      caption="Send adds your message, and a reply arrives 0.7 seconds later. The oldest messages leave once there are more than six."
      :columns="columns"
    >
      <template #controls>
        <UButton
          icon="i-lucide-send"
          @click="send"
        >
          Send
        </UButton>
      </template>
      <div class="flex h-80 flex-col justify-end overflow-hidden rounded-md bg-elevated/50 p-3">
        <AnimeTransitionGroup class="relative flex flex-col gap-2">
          <p
            v-for="message in messages"
            :key="message.id"
            class="max-w-[75%] rounded-2xl px-3 py-1.5 text-sm"
            :class="message.mine ? 'self-end bg-primary text-inverted' : 'self-start bg-default'"
          >
            {{ message.text }}
          </p>
        </AnimeTransitionGroup>
      </div>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Pin to top"
      caption="Pin a note to move it to the top. One item jumps several places and the rest shift down one."
      :columns="columns"
    >
      <AnimeTransitionGroup
        tag="ul"
        class="relative space-y-2"
      >
        <li
          v-for="note in notes"
          :key="note.id"
          class="flex items-center justify-between rounded-lg border border-default bg-default px-3 py-2 text-sm"
        >
          {{ note.title }}
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-pin"
            @click="pinNote(note.id)"
          />
        </li>
      </AnimeTransitionGroup>
    </PlaygroundCompare>

    <PlaygroundCompare
      title="Load and clear a batch"
      caption="Load fills the gallery with six photos at once; Clear removes them all at once."
      :columns="columns"
    >
      <template #controls>
        <UButton @click="loadPhotos">
          Load
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          @click="photos = []"
        >
          Clear
        </UButton>
      </template>
      <AnimeTransitionGroup class="relative grid min-h-40 grid-cols-3 content-start gap-2">
        <div
          v-for="(photo, index) in photos"
          :key="photo"
          class="aspect-square rounded-lg"
          :class="photoColors[index % photoColors.length]"
        />
      </AnimeTransitionGroup>
    </PlaygroundCompare>
  </UContainer>
</template>
