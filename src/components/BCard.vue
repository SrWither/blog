<script setup lang="ts">
import { type Post } from '@/api/posts'
import { useRouter } from 'vue-router'
import { getCategory, type Category } from '@/api/categories'
import { onBeforeMount, ref } from 'vue'

interface Props {
  post: Post
}

const props = defineProps<Props>()
const router = useRouter()

const category = ref<Category | null>(null)

onBeforeMount(async () => {
  category.value = await getCategory(props.post.category)
})

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleString('en-US', options)
}

const handlePostClick = () => {
  router.push(`/post/${props.post.id}`)
}
</script>

<template>
  <div
    class="p-6 relative rounded-2xl shadow-lg flex flex-col bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 transform hover:scale-105 cursor-pointer transition-all"
    @click="handlePostClick"
  >
    <h1 class="text-2xl font-bold text-white mb-2">{{ props.post.title }}</h1>
    <p class="text-gray-100 mb-4">{{ props.post.description }}</p>
    <div class="flex justify-between items-center mt-auto">
      <p class="text-sm text-gray-100">{{ formatDate(props.post.created_at || new Date()) }}</p>
      <p v-if="!props.post.published" class="text-sm px-2 py-1 rounded-full bg-white text-pink-500">
        Unpublished
      </p>
    </div>
    <div class="absolute right-5">
      <p class="text-sm text-white bg-purple-700 bg-opacity-50 rounded-full px-3 py-1 inline-block">
        {{ category?.name }}
      </p>
    </div>
  </div>
</template>
