<script setup lang="ts">
import { AuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

const authStore = AuthStore()

interface Props {
  title: string
  isAuth: boolean
  isAdmin: boolean
}

defineProps<Props>()

const handleLogout = async () => {
  authStore.clearToken()
  location.reload()
}
</script>

<template>
  <nav
    class="p-4 flex justify-between items-center shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 text-white"
  >
    <RouterLink to="/" class="font-bold text-xl">{{ title }}</RouterLink>
    <div class="flex items-center space-x-4">
      <RouterLink class="space-x-2 flex items-center" to="/posts">
        <i class="pi pi-file"></i>
        <span>Posts</span>
      </RouterLink>

      <!--Create post-->
      <RouterLink class="space-x-2 flex items-center" to="/createpost" v-if="isAuth">
        <i class="pi pi-file-plus"></i>
        <span>Create Post</span>
      </RouterLink>

      <!--Admin-->
      <RouterLink class="space-x-2 flex items-center" to="/admin" v-if="isAdmin">
        <i class="pi pi-user-plus"></i>
        <span>Admin</span>
      </RouterLink>

      <!--Login-->
      <RouterLink class="space-x-2 flex items-center" to="/login" v-if="!isAuth">
        <i class="pi pi-sign-in"></i>
        <span>Login</span>
      </RouterLink>

      <!--Register-->
      <RouterLink class="space-x-2 flex items-center" to="/register" v-if="!isAuth">
        <i class="pi pi-user-plus"></i>
        <span>Register</span>
      </RouterLink>

      <!--Logout-->
      <button class="space-x-2 flex items-center" v-else @click="handleLogout">
        <i class="pi pi-sign-out"></i>
        <span>Logout</span>
      </button>
    </div>
  </nav>
</template>
