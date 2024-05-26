import { defineStore } from 'pinia'
import type { Profile } from '@/api/profiles'

export const ProfileStore = defineStore('profile', {
  state: (): { profile: Profile | null } => ({ profile: null }),
  actions: {
    setProfile(profile: Profile): void {
      this.profile = profile
    },

    clearProfile(): void {
      this.profile = null
    }
  }
})
