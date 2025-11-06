<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
    <div class="flex items-center justify-around max-w-md mx-auto">
      <router-link 
        to="/"
        class="flex flex-col items-center justify-center w-full h-16 text-xs transition-colors"
        :class="$route.path === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
        </svg>
        <span>Home</span>
      </router-link>

      <router-link 
        to="/property"
        class="flex flex-col items-center justify-center w-full h-16 text-xs transition-colors"
        :class="$route.path.startsWith('/property') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5A6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <span>Search</span>
      </router-link>

      <router-link 
        to="/user/favorites"
        class="flex flex-col items-center justify-center w-full h-16 text-xs transition-colors relative"
        :class="$route.path === '/user/favorites' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <span>Favorites</span>
        <div v-if="favoritesCount > 0" class="absolute top-2 right-4 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {{ favoritesCount }}
        </div>
      </router-link>

      <router-link 
        to="/user/profile"
        class="flex flex-col items-center justify-center w-full h-16 text-xs transition-colors"
        :class="$route.path.startsWith('/user') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <span>Profile</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '@/store/favorites'

const favoritesStore = useFavoritesStore()

const favoritesCount = computed(() => {
  return favoritesStore.favoritesCount
})
</script>