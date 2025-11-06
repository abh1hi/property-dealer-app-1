<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50 safe-area-padding-top">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="text-xl sm:text-2xl font-bold text-blue-600">
          Apna Aashiyanaa
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <router-link 
            to="/buy" 
            class="text-gray-600 hover:text-blue-600 transition-colors"
            active-class="text-blue-600 font-semibold"
          >
            Buy
          </router-link>
          <router-link 
            to="/rent" 
            class="text-gray-600 hover:text-blue-600 transition-colors"
            active-class="text-blue-600 font-semibold"
          >
            Rent
          </router-link>
          <router-link 
            to="/sell" 
            class="text-gray-600 hover:text-blue-600 transition-colors"
            active-class="text-blue-600 font-semibold"
          >
            Sell
          </router-link>
        </div>

        <!-- User Actions -->
        <div class="flex items-center gap-4">
          <!-- Search -->
          <button 
            @click="toggleSearch"
            class="p-2 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          <!-- Favorites -->
          <router-link 
            to="/user/favorites" 
            class="p-2 text-gray-600 hover:text-blue-600 rounded-full transition-colors relative"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span v-if="favoritesCount > 0" class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ favoritesCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div class="relative" ref="userMenuRef">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2"
            >
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                {{ userInitials }}
              </div>
            </button>

            <!-- User Dropdown -->
            <div 
              v-if="showUserMenu"
              class="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
            >
              <router-link 
                to="/user/profile" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                My Profile
              </router-link>
              <router-link 
                to="/user/my-listings" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                My Listings
              </router-link>
              <router-link 
                to="/property/add" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Add Property
              </router-link>
              <div class="border-t border-gray-200 my-1"></div>
              <button 
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Search -->
      <div v-if="showSearch" class="pb-4 md:hidden">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Search properties..." 
            class="w-full bg-gray-100 text-gray-800 placeholder-gray-500 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="searchQuery"
            @keyup.enter="performSearch"
          >
          <button 
            @click="performSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useFavoritesStore } from '@/store/favorites'

const router = useRouter()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const showSearch = ref(false)
const showUserMenu = ref(false)
const userMenuRef = ref(null)
const searchQuery = ref('')

const userInitials = computed(() => {
  return authStore.userInitials
})

const favoritesCount = computed(() => {
  return favoritesStore.favoritesCount
})

const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value }
    })
    showSearch.value = false
    searchQuery.value = ''
  }
}

const logout = () => {
  authStore.logout()
  router.push('/auth/login')
  showUserMenu.value = false
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Load favorites count
  favoritesStore.fetchFavorites()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.safe-area-padding-top {
  padding-top: env(safe-area-inset-top);
}
</style>