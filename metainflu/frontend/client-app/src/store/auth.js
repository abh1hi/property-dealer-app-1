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
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    },

    async checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        try {
          // Verify token by making a request (you might need to adjust this endpoint)
          // For now, we'll just set the token and assume it's valid
          this.isAuthenticated = true
        } catch (error) {
          this.logout()
        }
      }
    }
  }
})