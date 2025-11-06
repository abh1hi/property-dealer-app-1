<template>
  <div class="property-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <!-- Property Image -->
    <div class="relative h-52 overflow-hidden">
      <img 
        :src="property.images?.[0]?.url || '/placeholder-property.jpg'" 
        :alt="property.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute top-3 right-3">
        <button 
          @click.stop.prevent="toggleFavorite"
          class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <svg class="w-5 h-5" :class="isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <h3 class="text-xl font-semibold text-white line-clamp-1">{{ property.name }}</h3>
        <p class="text-sm text-gray-200 line-clamp-1">{{ property.location || 'Location not specified' }}</p>
      </div>
    </div>
    
    <!-- Property Details -->
    <div class="p-4">
      <div class="flex items-center justify-between mb-3">
        <span class="text-2xl font-bold text-blue-600">${{ formatPrice(property.price) }}</span>
        <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
          {{ property.type || 'For Sale' }}
        </span>
      </div>
      
      <!-- Property Stats -->
      <div class="flex items-center gap-4 text-sm text-gray-600 border-t border-b border-gray-100 py-3 my-3">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span>{{ property.bedrooms || 'N/A' }} beds</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>{{ property.bathrooms || 'N/A' }} baths</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V8m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5 5"/>
          </svg>
          <span>{{ property.area || 'N/A' }} sqft</span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="mt-4">
        <button 
          @click="viewDetails"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
  if (!price) return 'On request'
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
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>