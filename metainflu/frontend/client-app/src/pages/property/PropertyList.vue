<template>
  <div class="property-list-page min-h-screen bg-background text-on-background">
    
    <!-- Sticky Header with Filters -->
    <div class="sticky top-0 z-30 bg-background/80 backdrop-blur-sm shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FilterBar @filtersChanged="handleFiltersChanged" class="py-3"/>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      <!-- Content Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-on-surface">Find Your Next Home</h1>
        <p class="text-on-surface-variant mt-1">{{ loading ? 'Searching for properties...' : `${totalProperties} properties found` }}</p>
      </div>

      <!-- Property Grid -->
      <div>
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          <div v-for="i in 6" :key="i" class="bg-surface rounded-xl shadow-md overflow-hidden animate-pulse">
            <div class="h-56 bg-surface-variant"></div>
            <div class="p-5">
              <div class="h-4 bg-surface-variant rounded w-3/4 mb-3"></div>
              <div class="h-4 bg-surface-variant rounded w-1/2 mb-4"></div>
              <div class="h-3 bg-surface-variant rounded w-full mb-2"></div>
              <div class="h-3 bg-surface-variant rounded w-full mb-4"></div>
              <div class="flex justify-between items-center">
                <div class="h-6 bg-surface-variant rounded w-1/4"></div>
                <div class="w-8 h-8 bg-surface-variant rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="properties.length === 0" class="text-center py-20">
          <div class="w-24 h-24 bg-primary-container text-primary mx-auto rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-home text-4xl"></i>
          </div>
          <h3 class="text-2xl font-semibold text-on-surface mb-2">No Properties Found</h3>
          <p class="text-on-surface-variant mb-6 max-w-md mx-auto">We couldn't find any properties matching your criteria. Try adjusting your filters for better results.</p>
          <button @click="clearFilters" class="btn-primary">
            Clear Filters
          </button>
        </div>

        <!-- Property Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          <PropertyCard 
            v-for="property in properties" 
            :key="property._id" 
            :property="property" 
          />
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore && !loading" class="text-center mt-10">
          <button 
            @click="loadMore"
            :disabled="loadingMore"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loadingMore ? 'Loading...' : 'Load More Properties' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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

// Watch for route changes (e.g., from search) and apply filters
watch(() => route.query, (query) => {
  propertyStore.setFilters({ ...query })
}, { deep: true, immediate: true })

</script>

<style scoped>
.btn-primary {
    @apply bg-primary text-on-primary font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-0.5;
}
</style>