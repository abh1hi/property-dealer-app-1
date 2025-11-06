<template>
  <div class="property-list-page min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-900">Browse Properties</h1>
        <p class="text-gray-600 mt-1">{{ totalProperties }} properties found</p>
      </div>
    </div>

    <!-- Filter Bar -->
    <FilterBar @filtersChanged="handleFiltersChanged" />

    <!-- Property Grid -->
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
      <div v-else-if="properties.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L22 12L20 14L12 6L4 14L2 12L12 2M5 15H19V22H5V15Z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
        <p class="text-gray-600 mb-4">Try adjusting your search criteria</p>
        <button 
          @click="clearFilters"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Clear Filters
        </button>
      </div>

      <!-- Property Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PropertyCard 
          v-for="property in properties" 
          :key="property._id" 
          :property="property" 
        />
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import PropertyCard from '@/components/PropertyCard.vue'
import FilterBar from '@/components/FilterBar.vue'
import { usePropertyStore } from '@/store/property'

const route = useRoute()
const propertyStore = usePropertyStore()

const loadingMore = ref(false)

const properties = computed(() => propertyStore.properties)
const loading = computed(() => propertyStore.loading)
const hasMore = computed(() => propertyStore.pagination.hasMore)
const totalProperties = computed(() => propertyStore.pagination.totalItems)

const handleFiltersChanged = (newFilters) => {
  propertyStore.setFilters(newFilters)
}

const loadMore = async () => {
  loadingMore.value = true
  await propertyStore.loadMore()
  loadingMore.value = false
}

const clearFilters = () => {
  propertyStore.clearFilters()
}

// Watch for route changes (e.g., from search)
watch(() => route.query, () => {
  // Apply route query parameters as filters
  const routeFilters = { ...route.query }
  if (Object.keys(routeFilters).length > 0) {
    propertyStore.setFilters(routeFilters)
  }
}, { deep: true, immediate: true })

onMounted(() => {
  // If no route filters, fetch all properties
  if (Object.keys(route.query).length === 0) {
    propertyStore.fetchProperties()
  }
})
</script>