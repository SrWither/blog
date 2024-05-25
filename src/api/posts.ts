import { authenticate } from './auth'
import { db } from './connect'

export type Post = {
  id?: string
  title: string
  description: string
  content: string
  published: boolean
  created_at?: Date
  updated_at?: Date
  user?: string
  category: string
  tags?: string[]
}

export const createPost = async (token: string, data: Post): Promise<Post | null> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    const [post] = await db.create<Post>('Posts', data)

    return post
  } catch (e) {
    console.error(e)
    return null
  }
}

export const updatePost = async (token: string, id: string, data: Post): Promise<Post | null> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    const [post] = await db.merge<Post>(id, data)

    return post
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getPost = async (id: string): Promise<Post | null> => {
  try {
    const [post] = await db.select<Post>(id)
    return post
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getPostsByCat = async (id: string): Promise<Post[]> => {
  try {
    const [posts] = await db.query<[Post[]]>(`SELECT * FROM Posts WHERE category = ${id}`)
    return posts
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getLastsPosts = async (): Promise<Post[]> => {
  try {
    const [posts] = await db.query<[Post[]]>(`SELECT * FROM Posts ORDER BY created_at DESC LIMIT 3`)
    return posts
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getPostsByFilters = async (category: string, filter: string): Promise<Post[]> => {
  try {
    let query = 'SELECT * FROM Posts'
    const conditions = []

    if (category && category !== 'all') {
      conditions.push(`category = '${category}'`)
    }

    if (filter && filter.trim() !== '') {
      conditions.push(
        `(title CONTAINS '${filter}' OR description CONTAINS '${filter}' OR tags CONTAINS '${filter}')`
      )
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY created_at DESC'

    const [posts] = await db.query<[Post[]]>(query)

    return posts
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    const posts = await db.select<Post>('Posts')
    return posts
  } catch (e) {
    console.error(e)
    return []
  }
}

export const deletePost = async (token: string, id: string): Promise<boolean> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return false
    }

    await db.delete<Post>(id)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
