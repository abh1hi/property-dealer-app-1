<template>
  <div class="home-page bg-gray-50 text-gray-800">

    <!-- ======================= -->
    <!-- Hero & Search Section -->
    <!-- ======================= -->
    <section class="relative min-h-[60vh] flex items-center justify-center text-center py-10">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2796&auto=format&fit=crop');"></div>
      <div class="absolute inset-0 bg-black/50"></div>

      <div class="relative z-10 w-full max-w-4xl mx-auto px-4">
        <h1 class="text-4xl sm:text-5xl font-bold text-white !leading-tight mb-3">
          Find Your Dream Home
        </h1>
        <p class="text-lg text-white/90 mb-6">
          Search from over a million properties to buy or rent.
        </p>
        
        <!-- Search Component -->
        <div class="bg-white rounded-lg p-3 shadow-2xl text-left">
          <!-- Search Tabs -->
          <div class="flex justify-start border-b mb-3">
              <button v-for="type in searchTypes" :key="type"
                      @click="activeSearchType = type"
                      :class="['px-5 py-2.5 text-sm font-semibold transition-colors duration-300 -mb-px border-b-2', 
                              {'border-blue-600 text-blue-600': activeSearchType === type, 'border-transparent text-gray-600 hover:text-blue-600': activeSearchType !== type}]">
                  {{ type }}
              </button>
          </div>
          <!-- Search Input -->
          <div class="flex items-center">
              <input type="text" placeholder="Search for locality, landmark or project" class="flex-grow bg-transparent text-gray-800 text-base px-2 focus:outline-none">
              <button class="bg-blue-600 text-white rounded-md font-semibold flex items-center justify-center transition-all duration-300 px-6 py-3">
                  <i class="fas fa-search mr-2"></i>
                  <span>Search</span>
              </button>
          </div>
        </div>
      </div>
    </section>


    <!-- ======================= -->
    <!-- Property Links -->
    <!-- ======================= -->
    <section class="bg-gray-100 py-6">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-4 gap-2 text-center">
          <div v-for="link in propertyLinks" :key="link.title" class="p-2">
            <div class="w-12 h-12 bg-white text-gray-600 rounded-lg flex items-center justify-center mx-auto mb-2 text-xl shadow-sm">
              <i :class="link.icon"></i>
            </div>
            <p class="text-xs font-semibold text-gray-700">{{ link.title }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- ======================= -->
    <!-- Owner Properties Ad -->
    <!-- ======================= -->
    <section class="py-4 mt-4">
      <div class="max-w-4xl mx-auto px-4">
        <div class="bg-white rounded-lg shadow-sm p-4 flex items-center">
          <img src="https://static.99acres.com/images/seller_check.gif" alt="Owner" class="w-16 h-16">
          <div class="ml-4">
            <h3 class="font-bold text-base text-gray-800">Post your Property for FREE!</h3>
            <p class="text-sm text-gray-600">Sell or rent your property to millions of genuine buyers</p>
          </div>
          <button class="ml-auto px-4 py-2 rounded-md bg-orange-500 text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-colors">
            Post Property
          </button>
        </div>
      </div>
    </section>

    <!-- ======================= -->
    <!-- Featured Properties -->
    <!-- ======================= -->
    <section class="py-4 mt-4 bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-lg font-bold text-gray-800">Homes by Top Brands</h2>
          <router-link to="/search" class="text-blue-600 font-semibold text-sm">View All</router-link>
        </div>
        
        <div v-if="loading" class="overflow-x-auto pb-4 -mx-4 px-4">
          <div class="flex space-x-4">
            <div v-for="i in 3" :key="i" class="w-64 animate-pulse bg-gray-200 h-72 rounded-lg flex-shrink-0"></div>
          </div>
        </div>
        
        <div v-else class="overflow-x-auto pb-4 -mx-4 px-4">
          <div class="flex space-x-4">
            <PropertyCard v-for="property in featuredProperties" :key="property._id" :property="property" class="w-64 flex-shrink-0" />
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

const activeSearchType = ref('Buy')
const searchTypes = ['Buy', 'Rent', 'PG', 'Commercial']

const propertyLinks = [
    { icon: 'fas fa-home', title: 'Flats'},
    { icon: 'far fa-building', title: 'Houses'},
    { icon: 'fas fa-chart-area', title: 'Plots'},
    { icon: 'fas fa-industry', title: 'Commercial'},
]

const featuredProperties = ref([])
const loading = ref(true)

const fetchFeaturedProperties = async () => {
  try {
    loading.value = true
    await propertyStore.fetchFeaturedProperties() 
    featuredProperties.value = propertyStore.featuredProperties.slice(0, 5)
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
/* Add any additional styles if needed */
.home-page {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.home-page::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
