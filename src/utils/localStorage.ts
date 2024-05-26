/**
 * Retrieves an item from the browser's localStorage and parses it into the specified type.
 * @param key - The key under which the item is stored in localStorage.
 * @returns The parsed item of type `T` if found, or `null` if the item doesn't exist or cannot be parsed.
 */
export const getItemFromLocalStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}
