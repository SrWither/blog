import { type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { getItemFromLocalStorage } from '@/utils/localStorage'
import { getMyUser } from '@/api/users'

const adminMiddleware = async (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = getItemFromLocalStorage<string>('auth')

  if (!token) {
    next('/403')
  } else {
    try {
      const user = await getMyUser(token)
      if (user) {
        if (user.role && user.role === 'roles:admin') {
          next()
        } else {
          next('/403')
        }
      }
    } catch (error) {
      next('/login')
    }
  }
}

export default adminMiddleware
