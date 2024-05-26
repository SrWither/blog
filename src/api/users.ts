import { authenticate } from './auth'
import { db } from './connect'

export type User = {
  id: string
  email: string
  role: string
  password: string
}

/**
 * Retrieves the authenticated user's information based on the provided token.
 * @param token - Authentication token for authorization.
 * @returns A promise that resolves to the authenticated user object or null if authentication fails or user information is not available.
 */
export const getMyUser = async (token: string): Promise<User | null> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      return null
    }

    const user = await db.info<User>()
    if (!user) {
      return null
    }

    return user
  } catch {
    return null
  }
}
