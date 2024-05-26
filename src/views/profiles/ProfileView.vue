<script setup lang="ts">
import { getProfile, type Profile } from '@/api/profiles'
import { onBeforeMount, ref } from 'vue'
import BSimpleCard from '@/components/BSimpleCard.vue'
import BBtn from '@/components/BBtn.vue'
import { useRoute } from 'vue-router'
import { ProfileStore } from '@/stores/profile'
import { type User, getMyUser } from '@/api/users'
import { AuthStore } from '@/stores/auth'

const route = useRoute()
const profile = ref<Profile | null>(null)
const user = ref<User | null>(null)
const imageApi = import.meta.env.VITE_IMAGEAPI
const profileStore = ProfileStore()
const authStore = AuthStore()

const profileId = ref<string | undefined>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)

onBeforeMount(async () => {
  profile.value = await getProfile(profileId.value || '')
  user.value = await getMyUser(authStore.token || '')
})
</script>

<template>
  <BSimpleCard class="max-w-md mx-auto mt-6 p-6">
    <div v-if="profile" class="flex flex-col items-center">
      <div class="relative w-32 h-32 mb-4">
        <img
          v-if="profile.oauth"
          :src="profile.avatar"
          alt="Profile Picture"
          class="w-full h-full object-cover rounded-full border-4 border-white dark:border-zinc-800 shadow-md"
        />
        <img
          v-else
          :src="`${imageApi}/api/v1/${profile.avatar}`"
          alt="Profile Picture"
          class="w-full h-full object-cover rounded-full border-4 border-white dark:border-zinc-800 shadow-md"
        />
      </div>
      <h1 class="mb-4 text-3xl font-semibold text-gray-800 dark:text-white text-center">
        {{ profile.username }}
      </h1>
      <div
        v-if="profile.id == profileStore.profile?.id || user?.role == 'roles:admin'"
        class="flex flex-col items-center"
      >
        <RouterLink :to="`/editprofile/${profile.id || ''}`" class="w-full">
          <BBtn label="Edit" v-if="!profile?.oauth" class="w-full" />
          <BBtn label="Edit" disabled v-else class="w-full" />
        </RouterLink>
        <p v-if="profile?.oauth" class="text-gray-600 mt-4">OAuth2 User</p>
      </div>
    </div>
  </BSimpleCard>
</template>
