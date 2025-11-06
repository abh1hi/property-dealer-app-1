import { defineStore } from 'pinia'
import { propertyApi, transformPropertyData } from '@/services/api'

export const usePropertyStore = defineStore('property', {
  state: () => ({
    properties: [],
    featuredProperties: [],
    currentProperty: null,
    loading: false,
    error: null,
    filters: {
      type: '',
      priceRange: '',
      bedrooms: '',
      bathrooms: '',
      location: '',
      sortBy: 'newest'
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasMore: false
    }
  }),

  getters: {
    filteredProperties: (state) => {
      let filtered = [...state.properties]
      
      // Apply filters
      if (state.filters.type) {
        filtered = filtered.filter(p => p.type?.toLowerCase().includes(state.filters.type.toLowerCase()))
      }
      
      if (state.filters.bedrooms) {
        filtered = filtered.filter(p => p.bedrooms >= parseInt(state.filters.bedrooms))
      }
      
      if (state.filters.bathrooms) {
        filtered = filtered.filter(p => p.bathrooms >= parseInt(state.filters.bathrooms))
      }
      
      if (state.filters.priceRange) {
        const [min, max] = state.filters.priceRange.split('-')
        filtered = filtered.filter(p => {
          const price = p.price || 0
          if (max === '+') return price >= parseInt(min)
          return price >= parseInt(min) && price <= parseInt(max)
        })
      }
      
      // Apply sorting
      switch (state.filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
          break
        case 'price-high':
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
          break
        case 'oldest':
          filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break
        default:
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
      
      return filtered
    }
  },

  actions: {
    async fetchProperties(params = {}) {
      try {
        this.loading = true
        this.error = null
        
        const response = await propertyApi.getProperties({
          page: this.pagination.currentPage,
          limit: 12,
          ...this.filters,
          ...params
        })
        
        const transformedProperties = response.data.map(transformPropertyData)
        
        if (params.append) {
          this.properties.push(...transformedProperties)
        } else {
          this.properties = transformedProperties
        }
        
        this.pagination.totalItems = response.data.length
        this.pagination.hasMore = response.data.length === 12
        
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch properties:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchFeaturedProperties() {
      try {
        const response = await propertyApi.getProperties({ limit: 6, featured: true })
        this.featuredProperties = response.data.map(transformPropertyData)
      } catch (error) {
        console.error('Failed to fetch featured properties:', error)
      }
    },

    async fetchProperty(id) {
      try {
        this.loading = true
        this.error = null
        
        const response = await propertyApi.getProperty(id)
        this.currentProperty = transformPropertyData(response.data)
        
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch property:', error)
      } finally {
        this.loading = false
      }
    },

    async createProperty(propertyData) {
      try {
        this.loading = true
        this.error = null
        
        const response = await propertyApi.createProperty(propertyData)
        const newProperty = transformPropertyData(response.data)
        
        this.properties.unshift(newProperty)
        return newProperty
        
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProperty(id, propertyData) {
      try {
        this.loading = true
        this.error = null
        
        const response = await propertyApi.updateProperty(id, propertyData)
        const updatedProperty = transformPropertyData(response.data)
        
        const index = this.properties.findIndex(p => p._id === id)
        if (index !== -1) {
          this.properties[index] = updatedProperty
        }
        
        if (this.currentProperty?._id === id) {
          this.currentProperty = updatedProperty
        }
        
        return updatedProperty
        
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProperty(id) {
      try {
        this.loading = true
        this.error = null
        
        await propertyApi.deleteProperty(id)
        
        this.properties = this.properties.filter(p => p._id !== id)
        this.featuredProperties = this.featuredProperties.filter(p => p._id !== id)
        
        if (this.currentProperty?._id === id) {
          this.currentProperty = null
        }
        
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
      this.pagination.currentPage = 1
      this.fetchProperties()
    },

    clearFilters() {
      this.filters = {
        type: '',
        priceRange: '',
        bedrooms: '',
        bathrooms: '',
        location: '',
        sortBy: 'newest'
      }
      this.fetchProperties()
    },

    loadMore() {
      this.pagination.currentPage += 1
      this.fetchProperties({ append: true })
    }
  }
})