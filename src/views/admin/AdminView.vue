<script setup lang="ts">
import BBtn from '@/components/BBtn.vue'
</script>

<template>
  <div
    class="bg-gray-50 h-[calc(100vh-7rem)] dark:bg-zinc-900 dark:text-white overflow-scroll transition-all"
  >
    <div class="flex space-x-2 p-4">
      <RouterLink to="/admin/categorias">
        <BBtn label="Categories" />
      </RouterLink>
      <RouterLink to="/createpost">
        <BBtn label="Create post" />
      </RouterLink>
    </div>
    <RouterView v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0 }" />
  </div>
</template>
