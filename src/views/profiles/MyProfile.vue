<script setup lang="ts">
import { AuthStore } from '@/stores/auth'
import { getMyProfile, type Profile } from '@/api/profiles'
import { onBeforeMount, ref } from 'vue'

const authStore = AuthStore()
const profile = ref<Profile | null>(null)

onBeforeMount(async () => {
  profile.value = await getMyProfile(authStore.token || '')
})
</script>

<template>
  <h1 class="text-white">{{ profile }}</h1>
</template>
