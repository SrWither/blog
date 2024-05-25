<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import BInput from '@/components/BInput.vue'
import BBtn from '@/components/BBtn.vue'
import { type Category, createCategory, getCategories } from '@/api/categories'
import { AuthStore } from '@/stores/auth'

const authStore = AuthStore()

const categories = ref<Category[]>([])
const newCategory = reactive<{
  name: string
  description: string
}>({
  name: '',
  description: ''
})

const reloadData = async () => {
  categories.value = await getCategories()
}

onBeforeMount(async () => {
  await reloadData()
})

const handleCategory = async () => {
  if (authStore.token) {
    await createCategory(authStore.token, newCategory)
    await reloadData()
    newCategory.name = ''
    newCategory.description = ''
  }
}
</script>

<template>
  <div class="container mx-auto mt-2 p-4 md:p-6 lg:p-8 dark:bg-zinc-900">
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Existing Categories:</h1>
      <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 md:p-6">
        <div class="flex flex-wrap gap-2">
          <RouterLink
            v-for="category in categories"
            :key="category.id"
            :to="`/admin/categorias/${category.id || ''}`"
            class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
          >
            {{ category.name }}
          </RouterLink>
        </div>
      </div>
    </div>
    <h1 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Create Category</h1>
    <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 md:p-6 space-y-4">
      <BInput
        name="createCategory"
        placeholder="Category name"
        type="text"
        v-model="newCategory.name"
        class="mb-2"
      />
      <BInput
        name="createCategoryDescription"
        placeholder="Category description"
        type="text"
        v-model="newCategory.description"
        class="mb-2"
      />
      <BBtn label="Create Category" @click="handleCategory" class="w-full" />
    </div>
  </div>
</template>
