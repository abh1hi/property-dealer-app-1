import { defineStore } from 'pinia'
import { authApi, userApi } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isVendor: (state) => state.user?.role === 'vendor',
    isUser: (state) => state.user?.role === 'user',
    userInitials: (state) => {
      if (!state.user?.name) return 'U'
      return state.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
  },

  actions: {
    async login(credentials) {
      try {
        const response = await authApi.login(credentials)
        this.setAuthData(response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await authApi.register(userData)
        this.setAuthData(response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async adminLogin(credentials) {
      try {
        const response = await authApi.adminLogin(credentials)
        this.setAuthData(response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async vendorLogin(credentials) {
      try {
        const response = await authApi.vendorLogin(credentials)
        this.setAuthData(response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },

    setAuthData(data) {
      this.user = data.user || data
      this.token = data.token
      this.isAuthenticated = true
      
      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      // Store user data
      if (this.user) {
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // Clear favorites store
      try {
        const { useFavoritesStore } = require('@/store/favorites')
        const favoritesStore = useFavoritesStore()
        favoritesStore.clearFavorites()
      } catch (error) {
        console.error('Error clearing favorites on logout:', error)
      }
    },

    async checkAuth() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        try {
          this.token = token
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          this.logout()
        }
      } else {
        this.isAuthenticated = false
      }
    }
  }
})
