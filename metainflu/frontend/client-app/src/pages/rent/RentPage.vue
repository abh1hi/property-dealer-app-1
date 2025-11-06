<template>
  <div class="rent-page min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-blue-600 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Properties for Rent</h1>
        <p class="text-blue-100 text-lg">Find the perfect rental property</p>
      </div>
    </div>

    <!-- Filter Bar -->
    <FilterBar @filtersChanged="handleFiltersChanged" />

    <!-- Properties Grid -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 9" :key="i" class="animate-pulse">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-gray-300 h-48"></div>
            <div class="p-4">
              <div class="bg-gray-300 h-4 rounded mb-2"></div>
              <div class="bg-gray-300 h-4 rounded mb-2"></div>
              <div class="bg-gray-300 h-4 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="propertiesForRent.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 7H16V6A4 4 0 0 0 8 6V7H5A1 1 0 0 0 4 8V18A4 4 0 0 0 8 22H16A4 4 0 0 0 20 18V8A1 1 0 0 0 19 7M10 6A2 2 0 0 1 14 6V7H10V6M18 18A2 2 0 0 1 16 20H8A2 2 0 0 1 6 18V9H8V10A1 1 0 0 0 10 10A1 1 0 0 0 10 8V9H14V10A1 1 0 0 0 16 10A1 1 0 0 0 16 8V9H18V18Z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No rental properties found</h3>
        <p class="text-gray-600 mb-4">Try adjusting your search criteria</p>
        <button 
          @click="clearFilters"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Clear Filters
        </button>
      </div>

      <!-- Properties Grid -->
      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <p class="text-gray-600">{{ propertiesForRent.length }} rental properties available</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard 
            v-for="property in propertiesForRent" 
            :key="property._id" 
            :property="property" 
          />
        </div>
      </div>

      <!-- Load More Button -->
      <div 
        v-if="hasMore && !loading" 
        class="text-center mt-8"
      >
        <button 
          @click="loadMore"
          :disabled="loadingMore"
          class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loadingMore ? 'Loading...' : 'Load More Properties' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PropertyCard from '@/components/PropertyCard.vue'
import FilterBar from '@/components/FilterBar.vue'
import { usePropertyStore } from '@/store/property'

const propertyStore = usePropertyStore()
const loadingMore = ref(false)

const properties = computed(() => propertyStore.properties)
const loading = computed(() => propertyStore.loading)
const hasMore = computed(() => propertyStore.pagination.hasMore)

// Filter properties for rent
const propertiesForRent = computed(() => {
  return properties.value.filter(property => 
    property.type?.toLowerCase().includes('rent') ||
    property.type?.toLowerCase() === 'rental'
  )
})

const handleFiltersChanged = (newFilters) => {
  // Add 'rent' type filter to ensure we only show rental properties
  const rentFilters = { ...newFilters, type: 'rent' }
  propertyStore.setFilters(rentFilters)
}

const loadMore = async () => {
  loadingMore.value = true
  await propertyStore.loadMore()
  loadingMore.value = false
}

const clearFilters = () => {
  propertyStore.clearFilters()
  // Re-apply rent filter after clearing
  propertyStore.setFilters({ type: 'rent' })
}

onMounted(() => {
  // Initialize with rent properties filter
  propertyStore.setFilters({ type: 'rent' })
})
</script>