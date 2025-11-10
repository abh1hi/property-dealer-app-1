<template>
  <div>
    <Hero />
    <main class="py-12 md:py-20 bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Featured Properties Section -->
        <section>
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-extrabold text-on-surface">Featured Properties</h2>
            <p class="mt-3 text-lg text-secondary max-w-2xl mx-auto">Explore our handpicked selection of premier properties.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PropertyCard 
              v-for="property in featuredProperties" 
              :key="property._id" 
              :property="property"
            />
          </div>

          <div class="text-center mt-12">
            <button @click="goToSearch" class="bg-primary text-on-primary font-bold py-3 px-8 rounded-full text-lg transition-transform duration-200 transform hover:scale-105 active:scale-100">
              View All Properties
            </button>
          </div>
        </section>

        <!-- Call to Action Section -->
        <section class="mt-20 bg-surface-variant rounded-2xl p-10 text-center">
            <h3 class="text-3xl font-bold text-on-surface-variant mb-4">Ready to Find Your Home?</h3>
            <p class="text-lg text-secondary mb-6">Let us help you find the perfect place to call home. Browse our listings or contact an agent today.</p>
            <button @click="goToContact" class="bg-secondary-container text-on-secondary-container font-bold py-3 px-8 rounded-full text-lg transition-transform duration-200 transform hover:scale-105 active:scale-100">
              Contact Us
            </button>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Hero from '@/components/Hero.vue';
import PropertyCard from '@/components/PropertyCard.vue';

const router = useRouter();

const featuredProperties = ref([
  {
    _id: '1',
    name: 'Luxury Beachfront Villa',
    location: 'Miami, FL',
    price: 3500000,
    bedrooms: 4,
    bathrooms: 5,
    area: 4500,
    type: 'sale',
    images: [{ url: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg' }]
  },
  {
    _id: '2',
    name: 'Modern Downtown Loft',
    location: 'New York, NY',
    price: 8500,
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    type: 'rent',
    images: [{ url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg' }]
  },
  {
    _id: '3',
    name: 'Cozy Suburban Home',
    location: 'Austin, TX',
    price: 750000,
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    type: 'sale',
    images: [{ url: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg' }]
  },
]);

const goToSearch = () => {
  router.push('/search');
};

const goToContact = () => {
  router.push('/contact'); // Assuming you have a contact page route
};
</script>
