<script setup lang="ts">
import { ref, onBeforeMount, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost } from '@/api/posts'
import { type User, getMyUser } from '@/api/users'
import { AuthStore } from '@/stores/auth'
import BMarkdown from '@/components/BMarkdown.vue'
import BSimpleCard from '@/components/BSimpleCard.vue'
import BBtn from '@/components/BBtn.vue'

const route = useRoute()
const router = useRouter()
const authStore = AuthStore()

const postId = ref<string | undefined>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)
const user = ref<User | null>(null)
const post = reactive({
  title: '',
  description: '',
  content: '',
  published: false,
  updated_at: new Date(),
  user: '',
  tags: []
})

const showLightbox = ref<boolean>(false)
const lightboxImageUrl = ref<string>('')

onBeforeMount(async () => {
  user.value = await getMyUser(authStore.token || '')
  if (postId.value) {
    const postData = await getPost(postId.value)
    if (!postData) {
      router.push('/404')
      return
    }

    Object.assign(post, postData)
  }
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

const canEditPost = computed(() => {
  return user.value && (post.user === user.value.id || user.value.role === 'roles:admin')
})

const handleLightbox = (imageUrl: string) => {
  lightboxImageUrl.value = imageUrl
  showLightbox.value = true
}

const closeLightbox = () => {
  showLightbox.value = false
  lightboxImageUrl.value = ''
}
</script>

<template>
  <div
    id="post-container"
    class="bg-gray-100 p-4 sm:p-6 dark:bg-zinc-900 dark:text-white min-h-screen transition-all"
  >
    <BSimpleCard class="py-4 sm:py-6 shadow-lg relative mx-auto">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">{{ post.title }}</h1>

      <div class="flex justify-center mb-4 absolute top-4 left-4">
        <router-link v-if="canEditPost" :to="`/editpost/${postId}`">
          <BBtn label="Edit Post" />
        </router-link>
      </div>

      <p class="mb-2 text-center text-zinc-500">{{ formatDate(post.updated_at) }}</p>

      <div class="flex justify-center mb-4 flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 text-white rounded-lg text-sm"
        >
          {{ tag }}
        </span>
      </div>

      <div class="px-2 sm:px-4 md:px-10 lg:px-20 text-lg">
        <div v-if="!post.published" class="text-red-600 font-semibold text-center mb-4">
          <i class="pi pi-times"></i> Not Published
        </div>
        <div class="text-[1rem]">
          <BMarkdown :content="post.content" @click-image="handleLightbox" />
        </div>
      </div>
    </BSimpleCard>

    <transition name="lightbox">
      <div
        v-if="showLightbox"
        class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 lg:p-10"
      >
        <div class="max-w-full max-h-full flex">
          <i
            class="pi pi-times text-white text-2xl absolute top-4 right-4 cursor-pointer"
            @click="closeLightbox"
          ></i>
          <img
            :src="lightboxImageUrl"
            alt="lightbox image"
            class="object-contain lg:object-scale-down max-w-full max-h-full rounded-lg"
            v-motion
            :initial="{ opacity: 1, scale: 0 }"
            :enter="{ opacity: 1, scale: 1 }"
            :duration="1200"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.1s;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
