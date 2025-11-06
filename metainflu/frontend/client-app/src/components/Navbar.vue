<template>
  <nav class="navbar bg-blue-600 text-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 text-xl font-bold">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L22 12L20 14L12 6L4 14L2 12L12 2M5 15H19V22H5V15M7 17V20H9V17H7M11 17V20H13V17H11M15 17V20H17V17H15Z"/>
          </svg>
          PropertyDealer
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <router-link 
            to="/buy" 
            class="hover:text-blue-200 transition-colors"
            active-class="text-blue-200"
          >
            Buy
          </router-link>
          <router-link 
            to="/rent" 
            class="hover:text-blue-200 transition-colors"
            active-class="text-blue-200"
          >
            Rent
          </router-link>
          <router-link 
            to="/sell" 
            class="hover:text-blue-200 transition-colors"
            active-class="text-blue-200"
          >
            Sell
          </router-link>
          <router-link 
            to="/tourist/short-stay" 
            class="hover:text-blue-200 transition-colors"
            active-class="text-blue-200"
          >
            Short Stay
          </router-link>
        </div>

        <!-- User Actions -->
        <div class="flex items-center gap-3">
          <!-- Search -->
          <button 
            @click="toggleSearch"
            class="p-2 hover:bg-blue-700 rounded-md transition-colors md:hidden"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          <!-- Favorites -->
          <router-link 
            to="/user/favorites" 
            class="p-2 hover:bg-blue-700 rounded-md transition-colors relative"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span v-if="favoritesCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ favoritesCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div class="relative" ref="userMenuRef">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 p-2 hover:bg-blue-700 rounded-md transition-colors"
            >
              <div class="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center text-sm">
                {{ userInitials }}
              </div>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 7L10 11.5L14.5 7H5.5Z"/>
              </svg>
            </button>

            <!-- User Dropdown -->
            <div 
              v-if="showUserMenu"
              class="absolute right-0 top-full mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg border border-gray-200 py-1 z-50"
            >
              <router-link 
                to="/user/profile" 
                class="block px-4 py-2 text-sm hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                My Profile
              </router-link>
              <router-link 
                to="/user/my-listings" 
                class="block px-4 py-2 text-sm hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                My Listings
              </router-link>
              <router-link 
                to="/property/add" 
                class="block px-4 py-2 text-sm hover:bg-gray-100"
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

          <!-- Mobile Menu Toggle -->
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="p-2 hover:bg-blue-700 rounded-md transition-colors md:hidden"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Search -->
      <div v-if="showSearch" class="pb-4 md:hidden">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Search properties..." 
            class="w-full bg-blue-700 text-white placeholder-blue-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:bg-blue-800"
            v-model="searchQuery"
            @keyup.enter="performSearch"
          >
          <button 
            @click="performSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-if="showMobileMenu" 
      class="md:hidden bg-blue-700 border-t border-blue-500"
    >
      <div class="px-4 py-2 space-y-1">
        <router-link 
          to="/buy" 
          class="block py-2 text-white hover:text-blue-200"
          @click="showMobileMenu = false"
        >
          Buy
        </router-link>
        <router-link 
          to="/rent" 
          class="block py-2 text-white hover:text-blue-200"
          @click="showMobileMenu = false"
        >
          Rent
        </router-link>
        <router-link 
          to="/sell" 
          class="block py-2 text-white hover:text-blue-200"
          @click="showMobileMenu = false"
        >
          Sell
        </router-link>
        <router-link 
          to="/tourist/short-stay" 
          class="block py-2 text-white hover:text-blue-200"
          @click="showMobileMenu = false"
        >
          Short Stay
        </router-link>
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
const showMobileMenu = ref(false)
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