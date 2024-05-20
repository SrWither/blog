<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<template>
  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"> {{ text }} </label>
</template>
