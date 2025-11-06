import { defineStore } from 'pinia'
import { favoritesApi } from '@/services/api'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
    loading: false,
    error: null
  }),

  getters: {
    favoritesCount: (state) => state.favorites.length,
    isFavorite: (state) => (propertyId) => {
      return state.favorites.some(fav => fav._id === propertyId)
    }
  },

  actions: {
    async fetchFavorites() {
      try {
        this.loading = true
        this.error = null
        
        const response = await favoritesApi.getFavorites()
        this.favorites = response.data.items || []
        
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch favorites:', error)
      } finally {
        this.loading = false
      }
    },

    async addToFavorites(propertyId) {
      try {
        await favoritesApi.addToFavorites(propertyId)
        // Refresh favorites to get updated list
        await this.fetchFavorites()
        
      } catch (error) {
        this.error = error.message
        console.error('Failed to add to favorites:', error)
        throw error
      }
    },

    async removeFromFavorites(propertyId) {
      try {
        await favoritesApi.removeFromFavorites(propertyId)
        this.favorites = this.favorites.filter(fav => fav._id !== propertyId)
        
      } catch (error) {
        this.error = error.message
        console.error('Failed to remove from favorites:', error)
        throw error
      }
    },

    async toggleFavorite(property) {
      try {
        if (this.isFavorite(property._id)) {
          await this.removeFromFavorites(property._id)
        } else {
          await this.addToFavorites(property._id)
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
        throw error
      }
    }
  }
})