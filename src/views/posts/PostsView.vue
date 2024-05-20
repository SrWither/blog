<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { getPosts, type Post } from '@/api/posts'
import BCard from '@/components/BCard.vue'

const posts = ref<Post[]>([])

onBeforeMount(async () => {
  posts.value = await getPosts()
})
</script>

<template>
  <div class="h-[calc(100vh-7rem)] dark:bg-zinc-900 transition-all">
    <div
      class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4"
    >
      <BCard v-for="post in posts" :key="post.id" :post="post" class="col-span-2" />
    </div>
  </div>
</template>
