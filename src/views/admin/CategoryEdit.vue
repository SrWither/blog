<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import BInput from '@/components/BInput.vue'
import BBtn from '@/components/BBtn.vue'
import { type Category, getCategories, getCategory, updateCategory } from '@/api/categories'
import { AuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const authStore = AuthStore()
const route = useRoute()
const router = useRouter()

const categories = ref<Category[]>([])
const editedCategory = ref<Category | null>(null)

const reloadData = async () => {
  categories.value = await getCategories()
}

onBeforeMount(async () => {
  await reloadData()
  const catId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  if (catId) {
    editedCategory.value = await getCategory(catId)
  }
})

const handleUpdateCategory = async () => {
  if (authStore.token && editedCategory.value) {
    const catId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    await updateCategory(authStore.token, catId, editedCategory.value)
    await reloadData()
    editedCategory.value = null
    router.push(`/admin/categorias/${catId}`)
  }
}
</script>

<template>
  <div class="container mx-auto mt-8">
    <h1 class="text-3xl font-bold mb-6">Edit Category</h1>
    <div v-if="editedCategory" class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 space-y-2">
      <BInput
        name="editCategory"
        placeholder="Category name"
        type="text"
        v-model="editedCategory.name"
        class="mb-2"
      />
      <BInput
        name="editCategoryDescription"
        placeholder="Category description"
        type="text"
        v-model="editedCategory.description"
        class="mb-2"
      />
      <BBtn label="Save" @click="handleUpdateCategory" class="w-full" />
    </div>
  </div>
</template>
