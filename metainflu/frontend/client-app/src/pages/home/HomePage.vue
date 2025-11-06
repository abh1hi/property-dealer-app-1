<template>
  <div class="home-page bg-white">
    <!-- Hero Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Find Your Next Home with Apna Aashiyanaa
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-gray-600">
          The best place to find your dream property.
        </p>
        
        <!-- Quick Search -->
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Enter a location, property type, or keyword"
              class="w-full px-6 py-4 border border-gray-300 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="performSearch"
            >
            <button 
              @click="performSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Property Categories -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <router-link 
            to="/buy" 
            class="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </div>
            <span class="font-semibold">Buy</span>
          </router-link>

          <router-link 
            to="/rent" 
            class="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <span class="font-semibold">Rent</span>
          </router-link>

          <router-link 
            to="/sell" 
            class="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <span class="font-semibold">Sell</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Properties -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <router-link 
            to="/property" 
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </router-link>
        </div>
        
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div class="bg-gray-200 h-4 rounded mb-2"></div>
            <div class="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PropertyCard 
            v-for="property in featuredProperties" 
            :key="property._id" 
            :property="property" 
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PropertyCard from '@/components/PropertyCard.vue'
import { usePropertyStore } from '@/store/property'

const router = useRouter()
const propertyStore = usePropertyStore()

const searchQuery = ref('')
const featuredProperties = ref([])
const loading = ref(true)

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search', 
      query: { 
        q: searchQuery.value
      }
    })
  }
}

const fetchFeaturedProperties = async () => {
  try {
    loading.value = true
    await propertyStore.fetchFeaturedProperties()
    featuredProperties.value = propertyStore.featuredProperties.slice(0, 3) // Show only 3 featured properties
  } catch (error) {
    console.error('Failed to fetch featured properties:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFeaturedProperties()
})
</script>