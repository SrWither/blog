import { db } from './connect'

export type Comment = {
  id?: string
  body: string
  created_at?: Date
  updated_at?: Date
  post: string
  user?: string
}

export const createComment = async (token: string, data: Comment): Promise<Comment | null> => {
  try {
    const isAuthenticated = await db.authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    const [comment] = await db.create<Comment>('Comments', data)

    return comment
  } catch (e) {
    console.error(e)
    return null
  }
}

export const updateComment = async (
  token: string,
  id: string,
  data: Comment
): Promise<Comment | null> => {
  try {
    const isAuthenticated = await db.authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    const [comment] = await db.merge<Comment>(id, data)

    return comment
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getComment = async (id: string): Promise<Comment | null> => {
  try {
    const [comment] = await db.select<Comment>(id)
    return comment
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getCommentsFromPost = async (pid: string): Promise<Comment[]> => {
  try {
    const [comments] = await db.query<[Comment[]]>(
      `SELECT * FROM Comments WHERE post = ${pid} ORDER BY created_at DESC`
    )
    return comments
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getComments = async (): Promise<Comment[]> => {
  try {
    const comments = await db.select<Comment>('Comments')
    return comments
  } catch (e) {
    console.error(e)
    return []
  }
}

export const deleteComment = async (token: string, id: string): Promise<boolean> => {
  try {
    const isAuthenticated = await db.authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return false
    }

    await db.delete<Comment>(id)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
