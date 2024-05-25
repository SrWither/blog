<script setup lang="ts">
import { ref, watch, defineEmits, onMounted, onUnmounted } from 'vue'

export interface Option {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: string | undefined
  options: Option[]
  label: string
}>()

const emit = defineEmits(['update:modelValue'])

const selectedOption = ref<Option | null>(null)
const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectOption = (option: Option) => {
  selectedOption.value = option
  emit('update:modelValue', option.value)
  isDropdownOpen.value = false
}

watch(
  () => props.modelValue,
  (newValue) => {
    const foundOption = props.options.find((opt) => opt.value === newValue)
    selectedOption.value = foundOption || null
  }
)

const handleOutsideClick = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('.relative')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <div class="relative w-full">
    <!-- Trigger del select -->
    <button
      type="button"
      @click="toggleDropdown"
      class="w-full px-4 py-3 text-left mt-[0.15rem] rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-700 dark:text-white focus:outline-none focus:border-purple-500 focus:ring focus:ring-purple-500"
    >
      {{ selectedOption ? selectedOption.label : label }}
      <svg
        class="w-5 h-5 absolute top-4 right-3 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Opciones del select con scroll -->
    <div
      v-show="isDropdownOpen"
      class="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-lg bg-white dark:bg-zinc-700 border border-gray-300 dark:border-gray-600 shadow-lg"
    >
      <div v-for="(option, index) in options" :key="index">
        <button
          type="button"
          @click="selectOption(option)"
          class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-gray-700 dark:text-white"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
