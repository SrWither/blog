import { defineStore } from 'pinia'
import { getItemFromLocalStorage } from '@/utils/localStorage'

type Auth = {
  token: string | null
}

export const AuthStore = defineStore('auth', {
  state: (): Auth => ({
    token: getItemFromLocalStorage<string>('auth')
  }),
  actions: {
    setToken(token: string): void {
      this.token = token
      localStorage.setItem('auth', JSON.stringify(token))
    },
    clearToken(): void {
      this.token = null
      localStorage.removeItem('auth')
    }
  }
})
