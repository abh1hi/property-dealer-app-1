<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Find Your Dream Property
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
          Buy, Rent, or Sell with confidence
        </p>
        
        <!-- Quick Search -->
        <div class="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-lg">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Enter location, property type..." 
                class="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div class="flex gap-2">
              <select 
                v-model="searchType"
                class="px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
                <option value="short-stay">Short Stay</option>
              </select>
              <button 
                @click="performSearch"
                class="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Property Categories -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Browse by Category</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <router-link 
            to="/buy" 
            class="category-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
          >
            <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L22 12L20 14L12 6L4 14L2 12L12 2M5 15H19V22H5V15M7 17V20H9V17H7M11 17V20H13V17H11M15 17V20H17V17H15Z"/>
              </svg>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">Buy Properties</h3>
              <p class="text-gray-600">Find your perfect home to purchase</p>
            </div>
          </router-link>

          <router-link 
            to="/rent" 
            class="category-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
          >
            <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 7H16V6A4 4 0 0 0 8 6V7H5A1 1 0 0 0 4 8V18A4 4 0 0 0 8 22H16A4 4 0 0 0 20 18V8A1 1 0 0 0 19 7M10 6A2 2 0 0 1 14 6V7H10V6M18 18A2 2 0 0 1 16 20H8A2 2 0 0 1 6 18V9H8V10A1 1 0 0 0 10 10A1 1 0 0 0 10 8V9H14V10A1 1 0 0 0 16 10A1 1 0 0 0 16 8V9H18V18Z"/>
              </svg>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">Rent Properties</h3>
              <p class="text-gray-600">Discover rental opportunities</p>
            </div>
          </router-link>

          <router-link 
            to="/tourist/short-stay" 
            class="category-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
          >
            <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2M18 20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">Short Stay</h3>
              <p class="text-gray-600">Vacation rentals and short-term stays</p>
            </div>
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
            View All →
          </router-link>
        </div>
        
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-300 h-48 rounded-lg mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-4 rounded w-3/4"></div>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard 
            v-for="property in featuredProperties" 
            :key="property._id" 
            :property="property" 
          />
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Us</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22.82L12 19.77L5.82 22.82L7 14L2 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Trusted Platform</h3>
            <p class="text-gray-600">Verified properties and trusted agents</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M12 6A6 6 0 0 0 6 12A6 6 0 0 0 12 18A6 6 0 0 0 18 12A6 6 0 0 0 12 6M12 8A4 4 0 0 1 16 12A4 4 0 0 1 12 16A4 4 0 0 1 8 12A4 4 0 0 1 12 8Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Easy Search</h3>
            <p class="text-gray-600">Advanced filters to find exactly what you need</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4M20 8L12 13L4 8V6L12 11L20 6V8Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">24/7 Support</h3>
            <p class="text-gray-600">Get help whenever you need it</p>
          </div>
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
const searchType = ref('buy')
const featuredProperties = ref([])
const loading = ref(true)

const performSearch = () => {
  router.push({
    path: '/search', 
    query: { 
      q: searchQuery.value, 
      type: searchType.value 
    }
  })
}

const fetchFeaturedProperties = async () => {
  try {
    loading.value = true
    await propertyStore.fetchFeaturedProperties()
    featuredProperties.value = propertyStore.featuredProperties
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

<style scoped>
/* Additional custom styles if needed */
.hero-section {
  background-image: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.category-card:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}
</style>