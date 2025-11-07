<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p class="text-gray-600 mt-2">Fill in the details to list your property</p>
      </div>

      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div v-for="(step, index) in steps" :key="index" class="flex-1">
            <div class="flex items-center">
              <div 
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  currentStep > index ? 'bg-blue-600 text-white' : 
                  currentStep === index ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                ]"
              >
                {{ index + 1 }}
              </div>
              <div 
                v-if="index < steps.length - 1" 
                :class="[
                  'flex-1 h-1 mx-2',
                  currentStep > index ? 'bg-blue-600' : 'bg-gray-300'
                ]"
              ></div>
            </div>
            <p class="text-xs mt-2" :class="currentStep >= index ? 'text-blue-600 font-semibold' : 'text-gray-500'">
              {{ step.title }}
            </p>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit">
          <!-- Step 1: Basic Info -->
          <div v-show="currentStep === 0" class="space-y-4">
            <h2 class="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
              <input 
                v-model="formData.title" 
                type="text" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Beautiful 3BHK Apartment"
              />
              <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea 
                v-model="formData.description" 
                required
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your property in detail..."
              ></textarea>
              <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
              <select 
                v-model="formData.propertyType" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          <!-- Step 2: Details -->
          <div v-show="currentStep === 1" class="space-y-4">
            <h2 class="text-xl font-semibold mb-4">Property Details</h2>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Bedrooms *</label>
                <input 
                  v-model.number="formData.bedrooms" 
                  type="number" 
                  min="0"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Bathrooms *</label>
                <input 
                  v-model.number="formData.bathrooms" 
                  type="number" 
                  min="0"
                  step="0.5"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Area (sq ft) *</label>
                <input 
                  v-model.number="formData.area" 
                  type="number" 
                  min="0"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <input 
                  v-model.number="formData.price" 
                  type="number" 
                  min="0"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- Step 3: Location -->
          <div v-show="currentStep === 2" class="space-y-4">
            <h2 class="text-xl font-semibold mb-4">Location</h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <textarea 
                v-model="formData.address" 
                required
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter complete address"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input 
                  v-model.number="formData.latitude" 
                  type="number" 
                  step="any"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 28.6139"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input 
                  v-model.number="formData.longitude" 
                  type="number" 
                  step="any"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 77.2090"
                />
              </div>
            </div>
          </div>

          <!-- Step 4: Amenities -->
          <div v-show="currentStep === 3" class="space-y-4">
            <h2 class="text-xl font-semibold mb-4">Amenities</h2>
            
            <div class="grid grid-cols-2 gap-4">
              <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  :value="amenity" 
                  v-model="formData.amenities"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">{{ amenity }}</span>
              </label>
            </div>
          </div>

          <!-- Step 5: Images -->
          <div v-show="currentStep === 4" class="space-y-4">
            <h2 class="text-xl font-semibold mb-4">Property Images</h2>
            <PropertyImageUpload 
              @images-selected="handleImagesSelected" 
              :max-images="10"
            />
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-8">
            <button 
              v-if="currentStep > 0"
              type="button" 
              @click="previousStep"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <div v-else></div>

            <button 
              v-if="currentStep < steps.length - 1"
              type="button" 
              @click="nextStep"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
            <button 
              v-else
              type="submit" 
              :disabled="isSubmitting"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Property' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import PropertyImageUpload from '../components/PropertyImageUpload.vue';
import { createProperty } from '../services/propertyService';

export default {
  name: 'AddProperty',
  components: {
    PropertyImageUpload
  },
  data() {
    return {
      currentStep: 0,
      steps: [
        { title: 'Basic Info' },
        { title: 'Details' },
        { title: 'Location' },
        { title: 'Amenities' },
        { title: 'Images' }
      ],
      formData: {
        title: '',
        description: '',
        propertyType: '',
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        price: 0,
        address: '',
        latitude: null,
        longitude: null,
        amenities: []
      },
      selectedImages: [],
      availableAmenities: [
        'Parking',
        'Garden',
        'Swimming Pool',
        'Gym',
        'Security',
        'Power Backup',
        'Lift',
        'Club House',
        'Play Area',
        'WiFi'
      ],
      errors: {},
      isSubmitting: false
    };
  },
  methods: {
    nextStep() {
      if (this.validateStep()) {
        this.currentStep++;
      }
    },
    previousStep() {
      this.currentStep--;
    },
    validateStep() {
      this.errors = {};
      
      if (this.currentStep === 0) {
        if (this.formData.title.length < 5) {
          this.errors.title = 'Title must be at least 5 characters';
          return false;
        }
        if (this.formData.description.length < 20) {
          this.errors.description = 'Description must be at least 20 characters';
          return false;
        }
      }
      
      return true;
    },
    handleImagesSelected(images) {
      this.selectedImages = images;
    },
    async handleSubmit() {
      this.isSubmitting = true;
      
      try {
        const formData = new FormData();
        
        // Append all form fields
        Object.keys(this.formData).forEach(key => {
          if (key === 'amenities') {
            formData.append(key, JSON.stringify(this.formData[key]));
          } else if (this.formData[key] !== null && this.formData[key] !== '') {
            formData.append(key, this.formData[key]);
          }
        });
        
        // Append images
        this.selectedImages.forEach(image => {
          formData.append('images', image);
        });
        
        const response = await createProperty(formData);
        
        if (response.success) {
          this.$router.push({
            name: 'PropertySuccess',
            params: { id: response.data._id }
          });
        }
      } catch (error) {
        console.error('Error creating property:', error);
        alert('Failed to create property. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>
