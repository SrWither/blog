<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onBeforeMount } from 'vue'
import { type Category, getCategory } from '@/api/categories'
import BSimpleCard from '@/components/BSimpleCard.vue'
import BBtn from '@/components/BBtn.vue'

const category = ref<Category | null>(null)
const route = useRoute()
const router = useRouter()

onBeforeMount(async () => {
  const catId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  category.value = await getCategory(catId)
})
</script>

<template>
  <div class="max-w-md mx-auto mt-8 dark:bg-zinc-900">
    <BSimpleCard class="relative">
      <div class="absolute right-6">
        <button @click="router.back()">
          <i class="pi pi-arrow-left"></i>
        </button>
      </div>
      <div v-if="category" class="flex flex-col">
        <h2 class="text-2xl font-bold mb-4">Category Details</h2>
        <p><span class="font-semibold">ID:</span> {{ category.id }}</p>
        <p><span class="font-semibold">Name:</span> {{ category.name }}</p>
        <p><span class="font-semibold">Description:</span> {{ category.description }}</p>
        <RouterLink class="mt-4" :to="`/admin/editcategorie/${category.id || ''}`">
          <BBtn label="Edit" />
        </RouterLink>
      </div>
    </BSimpleCard>
  </div>
</template>
