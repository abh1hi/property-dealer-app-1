<template>
  <div class="filter-bar bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <!-- Mobile Filter Toggle -->
      <div class="md:hidden">
        <button 
          @click="showMobileFilters = !showMobileFilters"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
          </svg>
          Filters
        </button>
      </div>

      <!-- Desktop Filters -->
      <div class="hidden md:flex items-center gap-4 flex-wrap">
        <!-- Property Type -->
        <div class="relative">
          <select 
            v-model="filters.type" 
            @change="applyFilters"
            class="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="short-stay">Short Stay</option>
          </select>
          <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Price Range -->
        <div class="relative">
          <select 
            v-model="filters.priceRange" 
            @change="applyFilters"
            class="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Prices</option>
            <option value="0-100000">Under $100K</option>
            <option value="100000-300000">$100K - $300K</option>
            <option value="300000-500000">$300K - $500K</option>
            <option value="500000-1000000">$500K - $1M</option>
            <option value="1000000+">$1M+</option>
          </select>
          <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Bedrooms -->
        <div class="relative">
          <select 
            v-model="filters.bedrooms" 
            @change="applyFilters"
            class="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Beds</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
          </select>
          <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Bathrooms -->
        <div class="relative">
          <select 
            v-model="filters.bathrooms" 
            @change="applyFilters"
            class="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Baths</option>
            <option value="1">1+ Baths</option>
            <option value="2">2+ Baths</option>
            <option value="3">3+ Baths</option>
          </select>
          <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Sort By -->
        <div class="relative ml-auto">
          <select 
            v-model="filters.sortBy" 
            @change="applyFilters"
            class="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Clear Filters -->
        <button 
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear All
        </button>
      </div>
    </div>

    <!-- Mobile Filter Modal -->
    <div 
      v-if="showMobileFilters" 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
      @click="showMobileFilters = false"
    >
      <div 
        class="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-6 max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Filters</h3>
          <button 
            @click="showMobileFilters = false"
            class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Property Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select 
              v-model="filters.type" 
              class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="short-stay">Short Stay</option>
            </select>
          </div>

          <!-- Price Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select 
              v-model="filters.priceRange" 
              class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Prices</option>
              <option value="0-100000">Under $100K</option>
              <option value="100000-300000">$100K - $300K</option>
              <option value="300000-500000">$300K - $500K</option>
              <option value="500000-1000000">$500K - $1M</option>
              <option value="1000000+">$1M+</option>
            </select>
          </div>

          <!-- Bedrooms -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <select 
              v-model="filters.bedrooms" 
              class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Beds</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          <!-- Bathrooms -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <select 
              v-model="filters.bathrooms" 
              class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Baths</option>
              <option value="1">1+ Baths</option>
              <option value="2">2+ Baths</option>
              <option value="3">3+ Baths</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button 
            @click="clearFilters"
            class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
          >
            Clear All
          </button>
          <button 
            @click="applyMobileFilters"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['filtersChanged'])

const showMobileFilters = ref(false)

const filters = ref({
  type: '',
  priceRange: '',
  bedrooms: '',
  bathrooms: '',
  sortBy: 'newest'
})

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value && value !== 'newest')
})

const applyFilters = () => {
  emit('filtersChanged', { ...filters.value })
}

const applyMobileFilters = () => {
  applyFilters()
  showMobileFilters.value = false
}

const clearFilters = () => {
  filters.value = {
    type: '',
    priceRange: '',
    bedrooms: '',
    bathrooms: '',
    sortBy: 'newest'
  }
  applyFilters()
}

// Watch for filter changes
watch(filters, applyFilters, { deep: true })
</script>