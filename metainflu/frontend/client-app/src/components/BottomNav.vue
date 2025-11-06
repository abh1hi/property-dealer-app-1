<template>
  <nav class="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
    <div class="flex items-center justify-around py-2">
      <router-link 
        to="/" 
        class="flex flex-col items-center py-2 px-3 text-xs"
        :class="$route.path === '/' ? 'text-blue-600' : 'text-gray-500'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L22 12L20 14L12 6L4 14L2 12L12 2M5 15H19V22H5V15Z"/>
        </svg>
        <span>Home</span>
      </router-link>

      <router-link 
        to="/property" 
        class="flex flex-col items-center py-2 px-3 text-xs"
        :class="$route.path.startsWith('/property') ? 'text-blue-600' : 'text-gray-500'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 21L16.514 16.506L21 21ZM18 10.5C18 15.194 14.194 19 9.5 19S1 15.194 1 10.5 4.806 2 9.5 2 18 5.806 18 10.5Z"/>
        </svg>
        <span>Search</span>
      </router-link>

      <router-link 
        to="/user/favorites" 
        class="flex flex-col items-center py-2 px-3 text-xs relative"
        :class="$route.path === '/user/favorites' ? 'text-blue-600' : 'text-gray-500'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <span>Favorites</span>
        <div v-if="favoritesCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {{ favoritesCount }}
        </div>
      </router-link>

      <router-link 
        to="/user/profile" 
        class="flex flex-col items-center py-2 px-3 text-xs"
        :class="$route.path.startsWith('/user') ? 'text-blue-600' : 'text-gray-500'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
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