<script setup lang="ts">
import BBtn from '@/components/BBtn.vue'
import BInput from '@/components/BInput.vue'
import BSimpleCard from '@/components/BSimpleCard.vue'
import BInputLabel from '@/components/BInputLabel.vue'

import { ref } from 'vue'
import { register } from '@/api/auth'
import { oAuthRegister } from '@/api/oauth2'
import { createProfile } from '@/api/profiles'
import { useRouter } from 'vue-router'
import { AuthStore } from '@/stores/auth'

import { googleAuth } from '@/api/oauth2/google'
import { getCode, exchangeCodeForToken, getUserData } from '@/api/oauth2/discord'
import { uploadImage } from '@/api/images'

// Reactive references for user input
const email = ref<string>('')
const password = ref<string>('')
const username = ref<string>('')
const profilePicture = ref<string>('')
const profilePictureFile = ref<File | null>(null)

const imageApi = import.meta.env.VITE_IMAGEAPI

// Initialize Pinia store and Vue Router
const authStore = AuthStore()
const router = useRouter()

// State to manage registration and profile creation flow
let showCreateProfile = ref<boolean>(false)

// Handler for user registration
const handleNextStep = () => {
  showCreateProfile.value = true
}

const handleRegister = async () => {
  const token = await register(email.value, password.value)
  if (token) {
    authStore.setToken(token)
    await handleCreateProfile(username.value, profilePicture.value, token)
  } else {
    email.value = ''
    password.value = ''
  }
}

// Handler for creating user profile
const handleCreateProfile = async (username: string, profilePicture: string, token: string) => {
  const profile = await createProfile(token, username, profilePicture)
  if (profile) {
    router.push('/')
  }
}

const handleProfilePictureChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = (target.files as FileList)[0]
  if (file) {
    profilePictureFile.value = file
    profilePicture.value = await uploadImage(file)
  }
}

// Handler for OAuth registration data
const handleOAuthData = async (userData: any, provider: string) => {
  const token = await oAuthRegister(userData.sub, userData.email, provider)
  if (token) {
    // Set token and move to profile creation step
    authStore.setToken(token)
  }
}

// Handler for Google OAuth registration
const handleGoogle = () => {
  googleAuth(handleOAuthData, 'google')
}

// Handler for Discord OAuth registration
const handleDiscord = async () => {
  const code = await getCode()
  const access_token = await exchangeCodeForToken(code)
  const userData = await getUserData(access_token)

  const avatar = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
  await handleOAuthData(
    {
      sub: userData.id,
      email: userData.email,
      name: userData.global_name,
      picture: avatar
    },
    'discord'
  )
}
</script>

<template>
  <div class="overflow-hidden">
    <!-- Main container with background and theme toggle button -->
    <div
      class="flex justify-center items-center bg-gray-100 dark:bg-zinc-900 transition-colors"
      style="height: calc(100vh - 7rem)"
    >
      <!-- Conditional rendering based on registration and profile creation -->
      <!-- Login form -->
      <BSimpleCard
        class="lg:w-full lg:max-w-md w-96"
        v-if="!showCreateProfile"
        v-motion
        :initial="{ opacity: 0, scale: 0 }"
        :enter="{ opacity: 1, scale: 1 }"
        :delay="200"
        :duration="1200"
      >
        <!-- Registration form -->
        <div class="flex justify-center mb-4">
          <h1 class="text-gray-800 dark:text-white text-3xl font-bold">Register</h1>
        </div>

        <div class="flex justify-center my-4">
          <span class="text-gray-500 dark:text-gray-400"
            >Sign up with your social media account</span
          >
        </div>

        <div class="flex space-x-2 mb-6">
          <button
            @click="handleGoogle"
            class="w-full bg-red-600 text-white hover:bg-red-700 rounded-full py-2 px-4 flex items-center justify-center"
          >
            <span class="mr-2">Google</span>
            <i class="pi pi-google"></i>
          </button>
          <button
            @click="handleDiscord"
            class="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full py-2 px-4 flex items-center justify-center"
          >
            <span class="mr-2">Discord</span>
            <i class="pi pi-discord"></i>
          </button>
        </div>

        <div class="flex justify-center my-4">
          <span class="text-gray-500 dark:text-gray-400">or with your email address</span>
        </div>

        <form @submit.prevent="handleNextStep">
          <!-- Email input -->
          <div class="mb-4">
            <BInputLabel text="Email" />
            <BInput type="email" name="email" v-model="email" placeholder="Enter your email" />
          </div>

          <!-- Password input -->
          <div class="mb-6">
            <BInputLabel text="Password" />
            <BInput
              type="password"
              name="password"
              v-model="password"
              placeholder="Enter your password"
            />
          </div>

          <!-- Sign up link -->
          <div class="text-sm text-gray-700 dark:text-gray-300 mb-4">
            <p>
              You have an account?
              <RouterLink to="/login" class="text-purple-500 dark:text-purple-400"
                >Sign In</RouterLink
              >
            </p>
          </div>

          <!-- Sign in button -->
          <div class="flex justify-center">
            <BBtn label="Sign up" class="w-full" />
          </div>
        </form>
      </BSimpleCard>

      <!-- Create Profile form -->
      <BSimpleCard
        class="lg:w-full lg:max-w-md w-96"
        v-if="showCreateProfile"
        v-motion
        :initial="{ opacity: 0, scale: 0 }"
        :enter="{ opacity: 1, scale: 1 }"
        :delay="200"
        :duration="1200"
      >
        <!-- Title -->
        <div class="flex justify-center mb-4">
          <h1 class="text-gray-800 dark:text-white text-3xl font-bold">Create Profile</h1>
        </div>
        <div class="flex justify-center">
          <div v-if="profilePictureFile" class="rounded-full overflow-hidden w-32 h-32 mb-4">
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

        <!-- Back button -->
        <div class="absolute top-8 right-4">
          <button
            @click="showCreateProfile = false"
            class="text-black dark:text-white flex items-center"
          >
            <i class="pi pi-arrow-left mr-2"></i>
          </button>
        </div>

        <!-- Create Profile button -->
        <div class="flex justify-center">
          <BBtn label="Create Profile" class="w-full" @click="handleRegister" />
        </div>
      </BSimpleCard>
    </div>
  </div>
</template>
