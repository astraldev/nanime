<script lang="ts" setup>
// Section 1: Standard Transitions
const useWaapi_1 = ref(true)
const [showElement, toggleShowElement] = useToggle(true)

// Section 2: Element Toggling
const useWaapi_2 = ref(true)
const transitionMode = ref<'default' | 'in-out' | 'out-in'>('default')
const [showElementA, toggleShowElementA] = useToggle(true)

const modeOptions = [
  { value: 'default', label: 'Default' },
  { value: 'in-out', label: 'In-Out' },
  { value: 'out-in', label: 'Out-In' },
]

// Section 3: List Management

const elements = shallowRef(20)
function addItem() {
  elements.value++
}

function removeItem() {
  elements.value--
}
</script>

<template>
  <div class="space-y-12">
    <!-- Section 1: Standard Transitions -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold text-white">
        1. Standard Transitions
      </h2>
      <p class="text-gray-400">
        Single element toggle with useWaapi control
      </p>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-300">
          Use Waapi animation
        </h3>
        <PTabs
          v-model="useWaapi_1"
          :items="[
            { value: true, label: 'true' },
            { value: false, label: 'false' },
          ]"
        />
      </div>

      <PWrapper>
        <div class="space-y-4">
          <PButton @click="toggleShowElement()">
            {{ showElement ? 'Hide' : 'Show' }}
          </PButton>

          <ATransitionSlide
            :use-waapi="useWaapi_1"
            axis="y"
            :duration="350"
            offset="50%"
          >
            <PItem
              v-if="showElement"
              label="A"
              extra-class="bg-blue-500"
            />
          </ATransitionSlide>
        </div>
      </PWrapper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-bold text-white">
        3. List Management
      </h2>
      <p class="text-gray-400">
        Add, remove, and shuffle items with group transitions
      </p>

      <PWrapper>
        <div class="space-y-4">
          <div class="flex gap-2">
            <PButton @click="addItem">
              Add Item
            </PButton>
            <PButton
              variant="secondary"
              @click="removeItem"
            >
              Remove Item
            </PButton>
          </div>

          <ATransitionSlide
            group
            axis="x"
            tag="div"
            allow-move
            :duration="{ enter: 150, leave: 250 }"
            :offset="['-50%', '50%']"
            ease="outBack"
            class="grid grid-cols-6 gap-2.5"
          >
            <PItem
              v-for="item in elements"
              :key="`item-count-${item}`"
              :label="item.toString()"
              extra-class="bg-green-500 w-full py-1.5 px-4"
            />
          </ATransitionSlide>
        </div>
      </PWrapper>
    </section>

    <!-- Section 2: Element Toggling -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold text-white">
        2. Element Toggling
      </h2>
      <p class="text-gray-400">
        Two elements toggled with mode and useWaapi control
      </p>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-300">
          Transition Mode
        </h3>
        <PTabs
          v-model="transitionMode"
          :items="modeOptions"
        />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-300">
          UseWaapi
        </h3>
        <PTabs
          v-model="useWaapi_2"
          :items="[
            { value: true, label: 'true' },
            { value: false, label: 'false' },
          ]"
        />
      </div>

      <PWrapper extra-class="space-y-2.5">
        <PButton @click="toggleShowElementA()">
          Toggle Elements
        </PButton>

        <div class="flex gap-2.5">
          <ATransitionSlide
            :use-waapi="useWaapi_2"
            :mode="transitionMode === 'default' ? undefined : transitionMode"
            axis="x"
            :duration="[250, 500]"
            :offset="['50%', '-80px']"
          >
            <PItem
              v-if="showElementA"
              key="element-a"
              label="A"
              extra-class="bg-purple-500"
            />
            <PItem
              v-else
              key="element-b"
              label="B"
              extra-class="bg-orange-500"
            />
          </ATransitionSlide>
        </div>
      </PWrapper>
    </section>
  </div>
</template>
