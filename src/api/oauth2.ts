import { db } from './connect'

/**
 * Registers a user with the provided email, sub (subject), and provider information for OAuth2 authentication in the SurrealDB database.
 *
 * @param {string} sub The subject identifier for the user provided by the OAuth2 provider.
 * @param {string} email The email of the user to register.
 * @param {string} provider The OAuth2 provider used for authentication.
 * @returns {Promise<string | null>} A promise that resolves with a token upon successful registration, or null if an error occurs.
 */
export const oAuthRegister = async (
  sub: string,
  email: string,
  provider: string
): Promise<string | null> => {
  try {
    const token = await db.signup({
      namespace: 'blog',
      database: 'blog',
      scope: 'OAuth2',
      email: email,
      sub: sub,
      provider: provider
    })

    return token
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Logs in a user with the provided email and sub (subject) for OAuth2 authentication in the SurrealDB database.
 *
 * @param {string} email The email of the user to log in.
 * @param {string} sub The subject identifier for the user provided by the OAuth2 provider.
 * @returns {Promise<string | null>} A promise that resolves with a token upon successful login, or null if an error occurs.
 */
export const oAuthLogin = async (email: string, sub: string): Promise<string | null> => {
  try {
    const token = await db.signin({
      namespace: 'blog',
      database: 'blog',
      scope: 'OAuth2',
      email: email,
      sub: sub
    })

    return token
  } catch (e) {
    console.error(e)
    return null
  }
}
