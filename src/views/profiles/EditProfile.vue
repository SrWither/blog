<script setup lang="ts">
import BSimpleCard from '@/components/BSimpleCard.vue'
import BInput from '@/components/BInput.vue'
import BInputLabel from '@/components/BInputLabel.vue'
import BBtn from '@/components/BBtn.vue'
import { onBeforeMount, ref } from 'vue'
import { getProfile, updateProfile, type Profile } from '@/api/profiles'
import { useRoute, useRouter } from 'vue-router'
import { ProfileStore } from '@/stores/profile'
import { AuthStore } from '@/stores/auth'
import { uploadImage } from '@/api/images'
import { type User, getMyUser } from '@/api/users'

const profile = ref<Profile | null>(null)
const username = ref<string>('')
const profilePicture = ref<string>('')
const profilePictureFile = ref<File | null>(null)

const route = useRoute()
const router = useRouter()
const profileStore = ProfileStore()
const authStore = AuthStore()
const user = ref<User | null>(null)

const profileId = ref<string | undefined>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)

const imageApi = import.meta.env.VITE_IMAGEAPI

onBeforeMount(async () => {
  profile.value = await getProfile(profileId.value || '')
  user.value = await getMyUser(authStore.token || '')
  if (!user.value) {
    router.push('/403')
    return
  }
  if (!profile.value) {
    router.push('/404')
    return
  }
  if (profile.value.oauth) {
    router.push('/')
    return
  }
  if (!(profile.value.id == profileStore.profile?.id) && user.value.role == 'roles:user') {
    router.push('/403')
    return
  }
  profilePicture.value = profile.value.avatar
  username.value = profile.value.username
})

const handleProfilePictureChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = (target.files as FileList)[0]
  if (file) {
    profilePictureFile.value = file
    profilePicture.value = await uploadImage(file)
  }
}

const handleUpdateProfile = async () => {
  const profile = await updateProfile(authStore.token || '', profileId.value || '', {
    username: username.value,
    avatar: profilePicture.value
  })

  if (profile) {
    if (profileStore.profile?.id == profile.id) {
      profileStore.setProfile(profile)
    }
    router.push('/')
  }
}
</script>

<template>
  <div class="overflow-hidden">
    <!-- Main container with background and theme toggle button -->
    <div
      class="flex justify-center items-center bg-gray-100 dark:bg-zinc-900 transition-colors"
      style="height: calc(100vh - 7rem)"
      v-if="profile"
    >
      <BSimpleCard
        class="lg:w-full lg:max-w-md w-96"
        v-motion
        :initial="{ opacity: 0, scale: 0 }"
        :enter="{ opacity: 1, scale: 1 }"
        :delay="200"
        :duration="1200"
      >
        <!-- Title -->
        <div class="flex justify-center mb-4">
          <h1 class="text-gray-800 dark:text-white text-3xl font-bold">Update Profile</h1>
        </div>
        <div class="flex justify-center">
          <div v-if="profilePicture" class="rounded-full overflow-hidden w-32 h-32 mb-4">
            <img
              :src="`${imageApi}/api/v1/${profilePicture}`"
              alt="Profile Preview"
              class="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <!--  -->
        <!-- Username input -->
        <div class="mb-4">
          <BInputLabel text="Username" />
          <BInput
            type="text"
            name="username"
            v-model="username"
            placeholder="Enter your username"
          />
        </div>

        <!-- Profile Picture input -->
        <div class="mb-6">
          <BInputLabel text="Profile Picture" />
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            @change="handleProfilePictureChange"
            class="w-full p-3 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 dark:bg-zinc-700 dark:text-white bg-white"
          />
        </div>

        <!-- Create Profile button -->
        <div class="flex justify-center">
          <BBtn label="Update Profile" class="w-full" @click="handleUpdateProfile" />
        </div>
      </BSimpleCard>
    </div>
  </div>
</template>
