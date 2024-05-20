<script setup lang="ts">
import BBtn from '@/components/BBtn.vue'
import BInput from '@/components/BInput.vue'
import BSimpleCard from '@/components/BSimpleCard.vue'
import BInputLabel from '@/components/BInputLabel.vue'
import { ref } from 'vue'
import { login } from '@/api/auth'
import { useRouter } from 'vue-router'
import { AuthStore } from '@/stores/auth'

const email = ref<string>('')
const password = ref<string>('')

const authStore = AuthStore()
const router = useRouter()

const handleLogin = async () => {
  const token = await login(email.value, password.value)
  if (token) {
    authStore.setToken(token)
    router.push('/')
  } else {
    email.value = ''
    password.value = ''
  }
}

// const toggleDarkMode = () => {
//   document.body.classList.toggle('dark')
// }
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
        class="lg:w-full lg:max-w-md w-96 bg-gradient-to-b"
        v-motion
        :initial="{ opacity: 0, scale: 0 }"
        :enter="{ opacity: 1, scale: 1 }"
        :delay="200"
        :duration="1200"
      >
        <form @submit.prevent="handleLogin">
          <!-- Title -->
          <div class="flex justify-center mb-6">
            <h1 class="text-gray-800 dark:text-white text-3xl font-bold">Login</h1>
          </div>

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
          <!-- Sign in button -->
          <div class="flex justify-center">
            <BBtn label="Sign in" class="w-full" />
          </div>
        </form>
      </BSimpleCard>
    </div>
  </div>
</template>
