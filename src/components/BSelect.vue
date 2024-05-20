<script setup lang="ts">
export interface Option {
  value: string
  label: string
}

export interface Props {
  name: string
  modelValue: string | undefined
  options: Option[]
  label: string
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const el = event.target as HTMLSelectElement
  emit('update:modelValue', el.value)
}
</script>

<template>
  <select
    :id="name"
    class="w-full p-3 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 dark:bg-zinc-700 dark:text-white bg-white"
    :name="name"
    :value="modelValue"
    @change="updateValue"
  >
    <option disabled value="">{{ label }}</option>
    <option v-for="(option, index) in options" :key="index" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
