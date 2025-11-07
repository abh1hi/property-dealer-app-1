<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p class="mt-2 text-gray-600">Properties you've saved for later</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="favorites.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No favorites yet</h3>
        <p class="mt-2 text-gray-500">Start adding properties to your favorites!</p>
        <div class="mt-6">
          <router-link
            to="/buy"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Properties
          </router-link>
        </div>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="favorite in favorites"
          :key="favorite._id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- Property Image -->
          <div class="relative h-48 bg-gray-200">
            <img
              v-if="favorite.property?.images?.[0]"
              :src="favorite.property.images[0]"
              :alt="favorite.property.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            
            <!-- Remove Favorite Button -->
            <button
              @click="removeFavorite(favorite.property._id)"
              class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
            >
              <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <!-- Property Details -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ favorite.property?.title || 'Untitled Property' }}
            </h3>
            <p class="text-gray-600 text-sm mb-2">
              {{ favorite.property?.location || 'Location not specified' }}
            </p>
            <p class="text-blue-600 font-bold text-lg">
              ₹{{ formatPrice(favorite.property?.price) }}
            </p>
            <router-link
              :to="`/property/${favorite.property?._id}`"
              class="mt-4 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFavoritesStore } from '@/store/favorites'

const favoritesStore = useFavoritesStore()

const loading = computed(() => favoritesStore.loading)
const favorites = computed(() => favoritesStore.favorites)

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('en-IN').format(price)
}

const removeFavorite = async (propertyId) => {
  try {
    await favoritesStore.removeFromFavorites(propertyId)
  } catch (error) {
    console.error('Error removing favorite:', error)
    alert('Failed to remove favorite. Please try again.')
  }
}

onMounted(() => {
  favoritesStore.fetchFavorites()
})
</script>
