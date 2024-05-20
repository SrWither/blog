<script setup lang="ts">
import BBtn from '@/components/BBtn.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div
    class="flex justify-center items-center flex-col space-y-4 dark:bg-zinc-900"
    style="height: calc(100vh - 60px)"
  >
    <h1 class="font-bold text-9xl">404</h1>
    <p class="">Page not found</p>
    <BBtn label="Home" @click="router.push('/')" />
  </div>
</template>
