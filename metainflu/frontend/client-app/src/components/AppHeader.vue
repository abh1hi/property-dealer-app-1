<template>
  <header class="bg-surface shadow-md sticky top-0 z-40">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-2xl font-bold text-primary">
            Apna Aashiyanaa
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex md:items-center md:space-x-8">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path" 
            class="text-on-surface hover:text-primary transition-colors duration-200 font-medium"
            active-class="text-primary">
            {{ item.name }}
          </router-link>
        </div>

        <!-- Right-side actions -->
        <div class="flex items-center space-x-4">
          
          <!-- User Menu -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-2 focus:outline-none">
              <img :src="userAvatar" alt="User avatar" class="w-10 h-10 rounded-full object-cover border-2 border-primary-variant">
              <span class="hidden lg:block font-medium text-on-surface">{{ authStore.user.name }}</span>
              <i class="fas fa-chevron-down text-xs text-secondary"></i>
            </button>

            <!-- User Dropdown -->
            <transition name="fade-down">
              <div v-if="isUserMenuOpen" v-click-outside="closeUserMenu" class="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 origin-top-right">
                <router-link to="/profile" class="dropdown-item">My Profile</router-link>
                <router-link to="/my-favorites" class="dropdown-item">My Favorites</router-link>
                <a href="#" @click.prevent="handleLogout" class="dropdown-item">Sign Out</a>
              </div>
            </transition>
          </div>
          
          <!-- Auth Buttons -->
          <div v-else class="hidden md:flex items-center space-x-2">
            <router-link to="/auth/login" class="btn-secondary">Log In</router-link>
            <router-link to="/auth/register" class="btn-primary">Sign Up</router-link>
          </div>

        </div>

      </div>
    </nav>

  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import vClickOutside from '@/directives/clickOutside';

const authStore = useAuthStore();
const router = useRouter();

const isUserMenuOpen = ref(false);

const navItems = [
  { name: 'For Sale', path: '/search' },
  { name: 'For Rent', path: '/search?type=rent' },
  { name: 'Agents', path: '/agents' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const userAvatar = computed(() => authStore.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${authStore.user?.name || 'User'}`);

const toggleUserMenu = () => isUserMenuOpen.value = !isUserMenuOpen.value;
const closeUserMenu = () => isUserMenuOpen.value = false;

const handleLogout = () => {
  authStore.logout();
  closeUserMenu();
  router.push('/');
};

</script>

<style scoped>
.dropdown-item {
  @apply block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant hover:text-primary transition-colors;
}

.fade-down-enter-active, .fade-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-down-enter-from, .fade-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.btn-primary {
    @apply bg-primary text-on-primary font-semibold py-2 px-5 rounded-full transition duration-200 hover:bg-opacity-90;
}
.btn-secondary {
    @apply bg-secondary-container text-on-secondary-container font-semibold py-2 px-5 rounded-full transition duration-200 hover:bg-opacity-90;
}
</style>
