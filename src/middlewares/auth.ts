import { type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { authenticate } from '@/api/auth'
import { getItemFromLocalStorage } from '@/utils/localStorage'

const authMiddleware = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = getItemFromLocalStorage<string>('auth')

  if (token && to.path === '/login') {
    try {
      const isAuth = await authenticate(token)
      if (isAuth) {
        next('/')
      } else {
        next()
      }
    } catch (error) {
      console.error('Error de autenticación:', error)
      next('/login')
    }
  } else if (!token && (to.path === '/createpost' || to.path.includes('/updatepost'))) {
    next('/')
  } else {
    next()
  }
}

export default authMiddleware
