<script setup lang="ts">
import BNav from '@/components/BNav.vue'

import { AuthStore } from '@/stores/auth'
import { getMyUser, type User } from './api/users'
import { authenticate } from '@/api/auth'
import { onBeforeMount, ref, watch } from 'vue'

const authStore = AuthStore()
const user = ref<User | null>(null)
const isDark = ref<boolean>(false)

watch(
  () => authStore.token,
  async (token) => {
    if (token) {
      user.value = await getMyUser(token)
    }
  }
)

onBeforeMount(async () => {
  if (authStore.token) {
    const isAuth = await authenticate(authStore.token)

    if (isAuth) user.value = await getMyUser(authStore.token)
    else authStore.clearToken()
  }
})

const toggleDark = () => {
  isDark.value = !isDark.value
}
</script>

<template>
  <div
    class="flex flex-col min-h-screen transition-all bg-white dark:bg-zinc-900"
    :class="{
      dark: isDark
    }"
  >
    <header>
      <BNav
        title="Nameless"
        :is-auth="authStore.token !== null"
        :is-admin="user?.role === 'roles:admin'"
      />
    </header>
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <footer
      class="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 transition-all shadow mt-auto text-white"
    >
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <p>© 2024 Nameless</p>
        <div class="flex space-x-4">
          <p>All rights reserved</p>
          <button @click="toggleDark">Theme</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

<style>
* {
  font-family: 'Roboto', sans-serif;
}

code * {
  font-family: sans-serif;
}
</style>
