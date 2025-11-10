<template>
  <div class="min-h-screen bg-background">
    
    <!-- Hero Section -->
    <div class="relative h-[50vh] md:h-[60vh] bg-cover bg-center" :style="{ backgroundImage: `url(${heroImage})` }">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-center text-white">
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">Find Your Next Home</h1>
        <p class="mt-4 text-lg md:text-xl max-w-2xl mx-auto">The best place to find your dream property. We have a wide range of properties for you to choose from.</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="-mt-12 sticky top-20 z-30 px-4">
      <SearchBar class="max-w-4xl mx-auto shadow-2xl" />
    </div>
    
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <!-- Featured Properties -->
      <section v-if="featuredProperties.length">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold text-on-background">Featured Properties</h2>
          <router-link to="/search" class="text-primary font-semibold hover:underline">See All</router-link>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard v-for="property in featuredProperties" :key="property._id" :property="property" />
        </div>
      </section>
      
      <!-- Loading/Error State -->
      <div v-else class="text-center py-16">
        <div v-if="isLoading" class="space-y-4">
            <i class="fas fa-spinner fa-spin text-4xl text-primary"></i>
            <p class="text-lg text-secondary">Loading properties...</p>
        </div>
        <div v-if="error" class="space-y-4">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
            <p class="text-lg text-secondary">{{ error }}</p>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePropertyStore } from '@/store/properties';
import PropertyCard from '@/components/PropertyCard.vue';
import SearchBar from '@/components/SearchBar.vue';

const propertyStore = usePropertyStore();
const featuredProperties = ref([]);
const isLoading = ref(true);
const error = ref(null);

const heroImage = ref('https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg');

onMounted(async () => {
  try {
    await propertyStore.fetchProperties();
    featuredProperties.value = propertyStore.properties.slice(0, 3); // Take first 3 as featured
  } catch (e) {
    error.value = 'Failed to load properties. Please try again later.';
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});

</script>
