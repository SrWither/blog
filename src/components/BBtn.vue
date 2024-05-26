<script setup lang="ts">
interface Props {
  label: string
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <button
    v-if="!disabled"
    class="px-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 hover:bg-main-600 text-white font-bold py-2 rounded-xl focus:outline-none focus:ring focus:ring-main-300 dark:bg-main-600 dark:hover:bg-main-700"
  >
    {{ label }}
  </button>
  <button
    v-else
    disabled
    class="px-4 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-400 dark:to-pink-400 hover:bg-main-600 text-white font-bold py-2 rounded-xl focus:outline-none focus:ring focus:ring-main-300 dark:bg-main-600 dark:hover:bg-main-700"
  >
    {{ label }}
  </button>
</template>
