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

// Reactive references for user input
const email = ref<string>('')
const password = ref<string>('')

// Initialize Pinia store and Vue Router
const authStore = AuthStore()
const router = useRouter()

// Handler for user registration
const handleRegister = async () => {
  const token = await register(email.value, password.value)
  if (token) {
    authStore.setToken(token)
    router.push('/')
  } else {
    email.value = ''
    password.value = ''
  }
}

// Handler for OAuth registration data
const handleOAuthData = async (userData: any, provider: string) => {
  console.log(userData.sub, userData.email, userData.name, userData.picture)
  console.log('Handle the userData', userData)
  const token = await oAuthRegister(userData.sub, userData.email, provider)
  if (token) {
    // Create user profile after OAuth registration
    const profile = await createProfile(token, userData.name, userData.picture)
    if (profile) {
      authStore.setToken(token)
      router.push('/')
    }
  }
}

// Handler for Google OAuth registration
const handleGoogle = () => {
  googleAuth(handleOAuthData, 'google')
}

// Handler for Discord OAuth registration
const handleDiscord = async () => {
  const code = await getCode()
  console.log(code)
  const access_token = await exchangeCodeForToken(code)
  console.log(access_token)
  const userData = await getUserData(access_token)
  console.log(userData)

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
      <!-- Login form -->
      <BSimpleCard
        class="lg:w-full lg:max-w-md w-96"
        v-motion
        :initial="{ opacity: 0, scale: 0 }"
        :enter="{ opacity: 1, scale: 1 }"
        :delay="200"
        :duration="1200"
      >
        <!--Title-->
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

        <form @submit.prevent="handleRegister">
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
    </div>
  </div>
</template>
