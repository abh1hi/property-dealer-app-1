<template>
  <div class="bg-surface rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 flex flex-col h-full">
    <!-- Image Section -->
    <div class="relative">
      <img :src="property.images[0] || 'https://via.placeholder.com/400x250'" :alt="property.title" class="w-full h-48 object-cover">
      <div class="absolute top-3 left-3 bg-surface/90 px-3 py-1 rounded-full text-xs font-semibold text-on-surface capitalize">
        {{ property.type }}
      </div>
      <button @click.stop.prevent="toggleFavorite" class="absolute top-3 right-3 text-white rounded-full p-2 transition-colors duration-200" :class="isFavorite ? 'bg-red-500/90' : 'bg-black/50 hover:bg-red-500/80'">
        <i class="fas fa-heart"></i>
      </button>
    </div>
    
    <!-- Content Section -->
    <div class="p-4 flex-grow flex flex-col">
      <!-- Title and Price -->
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-on-surface leading-tight truncate mr-2">{{ property.title }}</h3>
        <p class="font-bold text-lg text-primary flex-shrink-0">${{ Number(property.price).toLocaleString() }}</p>
      </div>

      <!-- Location -->
      <p class="text-sm text-secondary mb-3 flex items-center">
        <i class="fas fa-map-marker-alt text-xs mr-2"></i>
        <span>{{ property.location.city }}, {{ property.location.state }}</span>
      </p>

      <!-- Spacer -->
      <div class="flex-grow"></div>

      <!-- Key Features -->
      <div class="flex justify-around items-center text-sm text-secondary border-t border-outline pt-3 mt-auto">
        <div class="feature-item">
          <i class="fas fa-bed text-base mr-1.5"></i>
          <span>{{ property.bedrooms }} beds</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-bath text-base mr-1.5"></i>
          <span>{{ property.bathrooms }} baths</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-ruler-combined text-base mr-1.5"></i>
          <span>{{ property.area }} sqft</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();

// This is a placeholder for actual favorite logic
const isFavorite = computed(() => false);

const toggleFavorite = () => {
  if (!authStore.isAuthenticated) {
    // Or trigger a login modal
    alert('Please log in to add favorites');
    return;
  }
  console.log('Toggling favorite for property:', props.property._id);
  // Implement actual favorite toggling logic here
};
</script>

<style scoped>
.feature-item {
  @apply flex items-center text-on-surface-variant;
}
</style>
