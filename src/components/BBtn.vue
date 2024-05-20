<script setup lang="ts">
interface Props {
  label: string
}

defineProps<Props>()
</script>

<template>
  <button
    class="px-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 hover:bg-main-600 text-white font-bold py-2 rounded-xl focus:outline-none focus:ring focus:ring-main-300 dark:bg-main-600 dark:hover:bg-main-700"
  >
    {{ label }}
  </button>
</template>
