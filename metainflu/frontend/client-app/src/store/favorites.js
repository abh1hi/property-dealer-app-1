import { defineStore } from 'pinia'
import favoriteService from '@/services/favoriteService'
import { useAuthStore } from '@/store/auth'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
    loading: false,
    error: null
  }),

  getters: {
    favoritesCount: (state) => state.favorites.length,
    isFavorite: (state) => (propertyId) => {
      return state.favorites.some(fav => fav.property?._id === propertyId || fav._id === propertyId)
    }
  },

  actions: {
    async fetchFavorites() {
      // Check if user is authenticated before fetching
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        console.log('User not authenticated, skipping favorites fetch')
        this.favorites = []
        return
      }

      try {
        this.loading = true
        this.error = null
        
        const response = await favoriteService.getFavorites()
        // Handle both array response and object with data property
        this.favorites = Array.isArray(response) ? response : (response.favorites || response.data || [])
        
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch favorites:', error)
        // Don't throw, just log - favorites are not critical
        this.favorites = []
      } finally {
        this.loading = false
      }
    },

    async addToFavorites(propertyId) {
      try {
        this.loading = true
        await favoriteService.addToFavorites(propertyId)
        // Refresh favorites to get updated list
        await this.fetchFavorites()
        
      } catch (error) {
        this.error = error.message
        console.error('Failed to add to favorites:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeFromFavorites(propertyId) {
      try {
        this.loading = true
        await favoriteService.removeFromFavorites(propertyId)
        this.favorites = this.favorites.filter(fav => {
          const favId = fav.property?._id || fav._id
          return favId !== propertyId
        })
        
      } catch (error) {
        this.error = error.message
        console.error('Failed to remove from favorites:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleFavorite(property) {
      try {
        const propertyId = property._id || property
        if (this.isFavorite(propertyId)) {
          await this.removeFromFavorites(propertyId)
        } else {
          await this.addToFavorites(propertyId)
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
        throw error
      }
    },

    // Clear favorites on logout
    clearFavorites() {
      this.favorites = []
      this.error = null
    }
  }
})
