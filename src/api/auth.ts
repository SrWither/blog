import { db } from './connect'

/**
 * Registers a user with the provided email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<string | null>} A promise that resolves to a token string on success,
 *                                   or null if registration fails.
 */
export const register = async (email: string, password: string): Promise<string | null> => {
  try {
    const token = await db.signup({
      namespace: 'blog',
      database: 'blog',
      scope: 'Auth',
      email: email,
      password: password
    })

    return token
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Logs in a user with the provided email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<string | null>} A promise that resolves to a token string on success,
 *                                   or null if login fails.
 */
export const login = async (email: string, password: string): Promise<string | null> => {
  try {
    const token = await db.signin({
      namespace: 'blog',
      database: 'blog',
      scope: 'Auth',
      email: email,
      password: password
    })

    return token
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Authenticates a user with the provided token.
 *
 * @param {string} token - The authentication token.
 * @returns {Promise<boolean>} A promise that resolves to true if authentication succeeds,
 *                             otherwise false.
 */
export const authenticate = async (token: string): Promise<boolean> => {
  try {
    const isAuthenticated = await db.authenticate(token)
    return isAuthenticated
  } catch {
    return false
  }
}
