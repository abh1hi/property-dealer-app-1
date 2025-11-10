<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface border-t border-outline shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
    <div class="max-w-md mx-auto h-full flex justify-around items-center px-2">
      <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item" active-class="text-primary">
        <i :class="item.icon" class="text-2xl mb-1"></i>
        <span class="text-xs font-medium tracking-tight">{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const navItems = ref([
  { name: 'Home', path: '/', icon: 'fas fa-home' },
  { name: 'Search', path: '/search', icon: 'fas fa-search' },
  { name: 'Favorites', path: '/my-favorites', icon: 'fas fa-heart' },
  { name: 'Profile', path: '/profile', icon: 'fas fa-user-circle' },
]);
</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center justify-center text-secondary hover:text-primary transition-colors duration-200 w-16;
}

/* Exact active link styling */
.router-link-exact-active {
    @apply text-primary;
}
</style>
