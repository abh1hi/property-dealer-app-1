<template>
  <div id="app" class="min-h-screen bg-white">
    <!-- Show navbar on all pages except auth -->
    <Navbar v-if="!isAuthPage" />
    
    <!-- Main content -->
    <main class="flex-1">
      <router-view />
    </main>
    
    <!-- Footer (hide on mobile for better UX) -->
    <Footer v-if="!isAuthPage && !isMobile" />
    
    <!-- Bottom navigation for mobile -->
    <BottomNav v-if="!isAuthPage && isMobile" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()
const authStore = useAuthStore()
const isMobile = ref(false)

const isAuthPage = computed(() => {
  return route.path.startsWith('/auth')
})

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  // Check mobile status
  checkMobile()
  
  // Listen for resize events
  window.addEventListener('resize', checkMobile)
})
</script>

<style>
/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Global styles */
body {
  font-family: 'Inter', system-ui, sans-serif;
  margin: 0;
  padding: 0;
}

/* Focus styles for accessibility */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Utility classes */
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2.5rem;
  }
  
  .category-card {
    margin-bottom: 1rem;
  }
}
</style>