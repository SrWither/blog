import { Surreal } from 'surrealdb.js'

export const db = new Surreal()
const dbUrl: string = import.meta.env.VITE_SURREALDB

/**
 * Initializes the SurrealDB connection with the specified URL and options.
 * This function must be called before performing any database operations.
 * @returns {Promise<void>} A promise that resolves when the database is successfully connected.
 */
export const initDB = async (): Promise<void> => {
  await db.connect(dbUrl, {
    namespace: 'blog',
    database: 'blog'
  })
}
