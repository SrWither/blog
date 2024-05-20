<script setup lang="ts">
interface Props {
  name: string
  type: 'email' | 'password' | 'text'
  placeholder: string
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const el = event.target as HTMLInputElement
  emit('update:modelValue', el.value)
}
</script>

<template>
  <input
    :id="name"
    class="w-full p-3 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 dark:bg-zinc-700 dark:text-white"
    :type="type"
    :name="name"
    :value="modelValue"
    @input="updateValue"
    :placeholder="placeholder"
  />
</template>
