import { db } from './connect'
/**
 * Category object.
 */
export type Category = {
  id?: string
  name: string
  description: string
}

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

export const getCategory = async (id: string): Promise<Category | null> => {
  try {
    const [category] = await db.select<Category>(id)
    return category
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await db.select<Category>('Categories')
    return categories
  } catch (e) {
    console.error(e)
    return []
  }
}

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
