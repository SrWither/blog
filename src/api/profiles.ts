import { authenticate } from './auth'
import { db } from './connect'
import { getMyUser } from './users'

export type Profile = {
  id?: string
  username: string
  avatar: string
  oauth?: boolean
}

/**
 * Creates a new profile for the authenticated user.
 *
 * @param {string} token The authentication token of the user.
 * @param {Profile} data The username for the new profile.
 * @returns {Promise<Profile | null>} A promise that resolves with the created profile upon success, or null if an error occurs.
 */
export const createProfile = async (token: string, data: Profile): Promise<Profile | null> => {
  try {
    // Authenticate the user with the provided token
    const isAuthenticated = await db.authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }

    // Create a new profile in the 'Profiles' table
    const [profile] = await db.create<Profile>('Profiles', data)

    return profile // Return the created profile
  } catch (e) {
    console.error(e)
    return null // Return null if profile creation fails
  }
}

export const updateProfile = async (
  token: string,
  id: string,
  data: Profile
): Promise<Profile | null> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    const [post] = await db.merge<Profile>(id, data)

    return post
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Retrieves a post by ID.
 * @param id - ID of the post to retrieve.
 * @returns A promise that resolves to the post object or null if not found.
 */
export const getProfile = async (id: string): Promise<Profile | null> => {
  try {
    const [post] = await db.select<Profile>(id)
    return post
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Retrieves the profile of the authenticated user.
 *
 * @param {string} token The authentication token of the user.
 * @returns {Promise<Profile | null>} A promise that resolves with the user's profile upon success, or null if an error occurs.
 */
export const getMyProfile = async (token: string): Promise<Profile | null> => {
  try {
    // Authenticate the user with the provided token
    const isAuthenticated = await db.authenticate(token)
    if (!isAuthenticated) {
      return null // Return null if user is not authenticated
    }

    // Retrieve the user information
    const user = await getMyUser(token)
    if (!user) {
      return null // Return null if user information cannot be retrieved
    }

    // Query the 'Profiles' table for the user's profile
    const [[profile]] = await db.query<[Profile[]]>(
      `SELECT * FROM Profiles WHERE user = ${user.id}`
    )

    return profile // Return the user's profile
  } catch {
    return null // Return null if an error occurs
  }
}

export const getProfileByUserId = async (id: string): Promise<Profile | null> => {
  try {
    // Query the 'Profiles' table for the user's profile
    const [[profile]] = await db.query<[Profile[]]>(`SELECT * FROM Profiles WHERE user = ${id}`)

    return profile // Return the user's profile
  } catch {
    return null // Return null if an error occurs
  }
}
