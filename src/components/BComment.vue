<script setup lang="ts">
import { type Comment } from '@/api/comments'
import { getProfileByUserId, type Profile } from '@/api/profiles'
import { ref, onBeforeMount } from 'vue'
import BSimpleCard from './BSimpleCard.vue'

const imageApi = import.meta.env.VITE_IMAGEAPI
const profile = ref<Profile | null>(null)

interface Props {
  comment: Comment
}

const props = defineProps<Props>()

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

onBeforeMount(async () => {
  profile.value = await getProfileByUserId(props.comment.user || '')
})
</script>

<template>
  <BSimpleCard class="mt-2 p-4 bg-white dark:bg-zinc-800 shadow-md rounded-lg" v-if="profile">
    <div class="flex items-start space-x-4">
      <div class="w-12 h-12 flex-shrink-0">
        <img
          v-if="profile.oauth"
          :src="profile.avatar"
          alt="Profile Picture"
          class="w-full h-full object-cover rounded-full border-2 border-gray-300 dark:border-zinc-700 shadow-sm"
        />
        <img
          v-else
          :src="`${imageApi}/api/v1/${profile.avatar}`"
          alt="Profile Picture"
          class="w-full h-full object-cover rounded-full border-2 border-gray-300 dark:border-zinc-700 shadow-sm"
        />
      </div>
      <div class="flex flex-col flex-1">
        <RouterLink :to="`/profile/${profile.id}`">
          <h1 class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ profile.username }}
          </h1>
        </RouterLink>
        <p class="text-gray-600 dark:text-gray-300">
          {{ comment.body }}
        </p>
        <span class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ formatDate(comment.created_at || new Date()) }}
        </span>
      </div>
    </div>
  </BSimpleCard>
</template>
