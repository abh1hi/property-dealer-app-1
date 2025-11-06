<template>
  <div class="filter-bar bg-white border-b border-gray-200 sticky top-16 z-30">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <!-- Mobile Filter Toggle -->
      <div class="md:hidden">
        <button 
          @click="showMobileFilters = !showMobileFilters"
          class="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0113 18v-6.586L6.293 6.707A1 1 0 016 6V4z"/>
          </svg>
          Filters
        </button>
      </div>

      <!-- Desktop Filters -->
      <div class="hidden md:flex items-center gap-4">
        <!-- Property Type -->
        <div class="relative">
          <select 
            v-model="filters.type" 
            class="appearance-none bg-gray-100 border-transparent rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Price Range -->
        <div class="relative">
          <select 
            v-model="filters.priceRange" 
            class="appearance-none bg-gray-100 border-transparent rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Prices</option>
            <option value="0-100000">Under $100K</option>
            <option value="100000-300000">$100K - $300K</option>
            <option value="300000-500000">$300K - $500K</option>
            <option value="500000-1000000">$500K - $1M</option>
            <option value="1000000+">$1M+</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Bedrooms -->
        <div class="relative">
          <select 
            v-model="filters.bedrooms" 
            class="appearance-none bg-gray-100 border-transparent rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Beds</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Bathrooms -->
        <div class="relative">
          <select 
            v-model="filters.bathrooms" 
            class="appearance-none bg-gray-100 border-transparent rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Baths</option>
            <option value="1">1+ Baths</option>
            <option value="2">2+ Baths</option>
            <option value="3">3+ Baths</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Sort By -->
        <div class="relative ml-auto">
          <select 
            v-model="filters.sortBy" 
            class="appearance-none bg-gray-100 border-transparent rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
          </svg>
        </div>

        <!-- Clear Filters -->
        <button 
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="text-sm text-blue-600 hover:underline font-medium"
        >
          Clear
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
        class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">Filters</h3>
          <button 
            @click="showMobileFilters = false"
            class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full bg-gray-100"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Property Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <select v-model="filters.type" class="w-full border-gray-300 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <!-- Price Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select v-model="filters.priceRange" class="w-full border-gray-300 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
            <select v-model="filters.bedrooms" class="w-full border-gray-300 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Any Beds</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          <!-- Bathrooms -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
            <select v-model="filters.bathrooms" class="w-full border-gray-300 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Any Baths</option>
              <option value="1">1+ Baths</option>
              <option value="2">2+ Baths</option>
              <option value="3">3+ Baths</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <button 
            @click="clearFilters"
            class="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-semibold"
          >
            Clear
          </button>
          <button 
            @click="applyMobileFilters"
            class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Apply
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
  return filters.value.type || filters.value.priceRange || filters.value.bedrooms || filters.value.bathrooms
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

watch(filters, applyFilters, { deep: true })
</script>