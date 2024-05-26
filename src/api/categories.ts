import { db } from './connect'

export type Category = {
  id?: string
  name: string
  description: string
}

/**
 * Creates a new category.
 * @param token - Authentication token for authorization.
 * @param data - Data object containing category details.
 * @returns A promise that resolves to the created category or null if authentication fails.
 */
export const createCategory = async (token: string, data: Category): Promise<Category | null> => {
  try {
    const isAuthenticated = await db.authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    const [category] = await db.create<Category>('Categories', data)

    return category
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Updates an existing category.
 * @param token - Authentication token for authorization.
 * @param id - ID of the category to update.
 * @param data - Updated data for the category.
 * @returns A promise that resolves to the updated category or null if authentication fails.
 */
export const updateCategory = async (
  token: string,
  id: string,
  data: Category
): Promise<Category | null> => {
  try {
    const isAuthenticated = await db.authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    const [category] = await db.merge<Category>(id, data)

    return category
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Retrieves a category by ID.
 * @param id - ID of the category to retrieve.
 * @returns A promise that resolves to the category object or null if not found.
 */
export const getCategory = async (id: string): Promise<Category | null> => {
  try {
    const [category] = await db.select<Category>(id)
    return category
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Retrieves all categories.
 * @returns A promise that resolves to an array of categories.
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await db.select<Category>('Categories')
    return categories
  } catch (e) {
    console.error(e)
    return []
  }
}

/**
 * Deletes a category by ID.
 * @param token - Authentication token for authorization.
 * @param id - ID of the category to delete.
 * @returns A promise that resolves to true if deletion is successful, false otherwise.
 */
export const deleteCategory = async (token: string, id: string): Promise<boolean> => {
  try {
    const isAuthenticated = await db.authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return false
    }

    await db.delete<Category>(id)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
