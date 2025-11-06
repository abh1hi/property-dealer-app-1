<template>
  <div class="property-card bg-white rounded-lg shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow duration-300">
    <!-- Property Image -->
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="property.images?.[0]?.url || '/placeholder-property.jpg'" 
        :alt="property.name"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      <div class="absolute top-3 right-3">
        <button 
          @click="toggleFavorite"
          class="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
        >
          <svg class="w-4 h-4" :class="isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
      <div class="absolute top-3 left-3">
        <span class="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
          {{ property.type || 'For Sale' }}
        </span>
      </div>
    </div>
    
    <!-- Property Details -->
    <div class="p-4">
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">{{ property.name }}</h3>
        <span class="text-lg font-bold text-blue-600">${{ formatPrice(property.price) }}</span>
      </div>
      
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ property.description }}</p>
      
      <!-- Property Stats -->
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 2H5C3.89 2 3 2.89 3 4V20C3 21.11 3.89 22 5 22H19C20.11 22 21 21.11 21 20V4C21 2.89 20.11 2 19 2M19 20H5V4H19V20Z"/>
          </svg>
          <span>{{ property.bedrooms || 'N/A' }} beds</span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 2V8H11V4.5H13V8H15V2H9M12 9C10.89 9 10 9.89 10 11V22H14V11C14 9.89 13.11 9 12 9M3 13V22H7V13H3M17 13V22H21V13H17Z"/>
          </svg>
          <span>{{ property.bathrooms || 'N/A' }} baths</span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L22 12L20 14L12 6L4 14L2 12L12 2Z"/>
          </svg>
          <span>{{ property.area || 'N/A' }} sqft</span>
        </div>
      </div>
      
      <!-- Location -->
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2M12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
        </svg>
        <span>{{ property.location || 'Location not specified' }}</span>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button 
          @click="viewDetails"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          View Details
        </button>
        <button 
          @click="contactAgent"
          class="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4M20 8L12 13L4 8V6L12 11L20 6V8Z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/store/favorites'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.property._id)
})

const formatPrice = (price) => {
  if (!price) return 'Price on request'
  return new Intl.NumberFormat('en-US').format(price)
}

const toggleFavorite = async () => {
  try {
    await favoritesStore.toggleFavorite(props.property)
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  }
}

const viewDetails = () => {
  router.push(`/property/${props.property._id}`)
}

const contactAgent = () => {
  // TODO: Open contact modal or navigate to contact page
  console.log('Contact agent for property:', props.property._id)
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>