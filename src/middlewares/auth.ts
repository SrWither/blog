import { type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { authenticate } from '@/api/auth'
import { getItemFromLocalStorage } from '@/utils/localStorage'

/**
 * Middleware function to handle authentication checks for protected routes.
 * Redirects users based on their authentication status and route permissions.
 * @param to - Route that the user is navigating to.
 * @param from - Route that the user is navigating from.
 * @param next - Function to call to resolve the navigation guard.
 */
const authMiddleware = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const token = getItemFromLocalStorage<string>('auth')

  if (token && (to.path === '/login' || to.path === '/register')) {
    // If token exists and user is trying to access login page, check authentication status
    try {
      const isAuth = await authenticate(token)
      if (isAuth) {
        // If authenticated, redirect to home page
        next('/')
      } else {
        // If authentication fails, allow access to login page
        next()
      }
    } catch (error) {
      // Handle authentication error, redirect to login page
      console.error('Authentication error:', error)
      next('/login')
    }
  } else if (
    !token &&
    (to.path === '/createpost' ||
      to.path.includes('/editpost') ||
      to.path.includes('/profile') ||
      to.path.includes('/myprofile'))
  ) {
    // If no token and trying to access createpost or updatepost routes, redirect to home page
    next('/')
  } else {
    // For all other cases, proceed with navigation
    next()
  }
}

export default authMiddleware
