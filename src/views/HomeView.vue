<script setup lang="ts">
import BCard from '@/components/BCard.vue'
import { type Post, getLastsPosts } from '@/api/posts'
import { onBeforeMount, ref } from 'vue'

const posts = ref<Post[]>([])

onBeforeMount(async () => {
  posts.value = await getLastsPosts()
})
</script>

<template>
  <div
    class="bg-gray-100 min-h-screen dark:bg-zinc-900 transition-all"
    style="min-height: calc(100vh - 8rem)"
  >
    <!-- Hero Section -->
    <header class="bg-cover bg-center h-96">
      <div
        class="flex items-center justify-center h-full w-full bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-800 dark:to-pink-700 bg-opacity-75"
      >
        <div class="text-center">
          <h1 class="text-white text-4xl font-bold">Welcome to Nameless's Blog</h1>
          <p class="text-white text-lg mt-4">Explore and discover interesting content</p>
        </div>
      </div>
    </header>
    <!-- Last Posts Section -->
    <section id="posts" class="container mx-auto px-6 py-12">
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Latest posts
      </h2>
      <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        <BCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </section>
  </div>
</template>
