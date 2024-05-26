import { type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { getItemFromLocalStorage } from '@/utils/localStorage'
import { getMyUser } from '@/api/users'

/**
 * Middleware function to check if the user is authenticated as an admin.
 * If not authenticated or not an admin, redirects to appropriate routes.
 * @param to - Route that the user is navigating to.
 * @param from - Route that the user is navigating from.
 * @param next - Function to call to resolve the navigation guard.
 */
const adminMiddleware = async (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = getItemFromLocalStorage<string>('auth')

  if (!token) {
    // No token found, redirect to unauthorized page
    next('/403')
  } else {
    try {
      // Attempt to fetch user information using the token
      const user = await getMyUser(token)
      if (user) {
        // User found, check if the user role is admin
        if (user.role && user.role === 'roles:admin') {
          // User is admin, allow navigation
          next()
        } else {
          // User is not admin, redirect to unauthorized page
          next('/403')
        }
      }
    } catch (error) {
      // Error occurred during user retrieval, redirect to login page
      console.error('Error fetching user:', error)
      next('/login')
    }
  }
}

export default adminMiddleware
