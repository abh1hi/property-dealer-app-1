<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
      <!-- Success Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <!-- Success Message -->
      <h1 class="text-3xl font-bold text-center text-gray-900 mb-4">
        Property Listed Successfully!
      </h1>
      <p class="text-center text-gray-600 mb-8">
        Your property has been submitted and is now under review. You will be notified once it's approved.
      </p>

      <!-- Property Preview -->
      <div v-if="property" class="border border-gray-200 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Property Details</h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Title:</span>
            <span class="font-medium">{{ property.title }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Type:</span>
            <span class="font-medium capitalize">{{ property.propertyType }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Price:</span>
            <span class="font-medium">₹{{ property.price?.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Area:</span>
            <span class="font-medium">{{ property.area }} sq ft</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Bedrooms:</span>
            <span class="font-medium">{{ property.bedrooms }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Status:</span>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
              {{ property.status || 'Pending' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          @click="viewProperty"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Property
        </button>
        <button 
          @click="addAnother"
          class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Add Another
        </button>
        <button 
          @click="goToDashboard"
          class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          My Properties
        </button>
      </div>

      <!-- Share Section (Optional) -->
      <div class="mt-8 pt-8 border-t border-gray-200">
        <h3 class="text-lg font-semibold mb-4 text-center">Share Your Property</h3>
        <div class="flex justify-center space-x-4">
          <button 
            @click="shareProperty('whatsapp')"
            class="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            title="Share on WhatsApp"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
          <button 
            @click="shareProperty('facebook')"
            class="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            title="Share on Facebook"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button 
            @click="copyLink"
            class="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
            title="Copy Link"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPropertyById } from '../services/propertyService';

export default {
  name: 'PropertySuccess',
  data() {
    return {
      property: null
    };
  },
  async mounted() {
    const propertyId = this.$route.params.id;
    if (propertyId) {
      try {
        this.property = await getPropertyById(propertyId);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    }
  },
  methods: {
    viewProperty() {
      if (this.property) {
        this.$router.push({ name: 'PropertyDetail', params: { id: this.property._id } });
      }
    },
    addAnother() {
      this.$router.push({ name: 'AddProperty' });
    },
    goToDashboard() {
      this.$router.push({ name: 'UserProperties' });
    },
    shareProperty(platform) {
      const url = window.location.origin + `/properties/${this.property._id}`;
      const text = `Check out this property: ${this.property.title}`;
      
      switch(platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
      }
    },
    copyLink() {
      const url = window.location.origin + `/properties/${this.property._id}`;
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }
};
</script>
