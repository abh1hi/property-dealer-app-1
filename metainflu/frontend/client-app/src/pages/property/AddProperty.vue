<template>
  <div class="add-property-page min-h-screen bg-background text-on-background py-6">
    <div class="max-w-3xl mx-auto px-4">

      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-on-surface">List Your Property</h1>
        <p class="text-on-surface-variant mt-2">Follow the steps to get your property listed.</p>
      </div>

      <!-- Stepper -->
      <div class="mb-8 p-2 bg-surface-variant rounded-full flex items-center justify-between">
        <div v-for="(step, index) in steps" :key="index" class="flex-1 text-center">
          <div 
            :class="[
              'py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300',
              currentStep === index ? 'bg-primary text-on-primary shadow-md' : 
              currentStep > index ? 'text-primary' : 'text-on-surface-variant/60'
            ]"
          >
            <i :class="[step.icon, currentStep === index ? 'mr-2' : '']"></i>
            <span :class="{'hidden md:inline': currentStep !== index}">{{ step.title }}</span>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="bg-surface rounded-xl shadow-lg p-6 md:p-8">
        <form @submit.prevent="handleSubmit">

          <h2 class="text-2xl font-bold text-on-surface mb-1">{{ steps[currentStep].title }}</h2>
          <p class="text-on-surface-variant mb-6">{{ steps[currentStep].description }}</p>

          <!-- Step 1: Basic Info -->
          <div v-show="currentStep === 0" class="space-y-5">
            <div class="form-group">
                <label>Property Title *</label>
                <input v-model="formData.title" type="text" required placeholder="e.g., Modern 2BHK with City View"/>
                <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
            </div>
            <div class="form-group">
                <label>Description *</label>
                <textarea v-model="formData.description" required rows="5" placeholder="Tell us what makes your property special..."></textarea>
                <p v-if="errors.description" class="error-text">{{ errors.description }}</p>
            </div>
             <div class="form-group">
                <label>Listing Type *</label>
                <div class="grid grid-cols-2 gap-3">
                    <button type="button" @click="formData.listingType = 'sale'" :class="{'active': formData.listingType === 'sale'}" class="option-button">
                        <i class="fas fa-tag"></i> For Sale
                    </button>
                     <button type="button" @click="formData.listingType = 'rent'" :class="{'active': formData.listingType === 'rent'}" class="option-button">
                        <i class="fas fa-key"></i> For Rent
                    </button>
                </div>
            </div>
          </div>

          <!-- Step 2: Details -->
          <div v-show="currentStep === 1" class="space-y-5">
            <div class="form-group">
                <label>Property Type *</label>
                <select v-model="formData.propertyType" required>
                    <option disabled value="">Select a property type</option>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Villa</option>
                    <option>Land</option>
                    <option>Commercial</option>
                </select>
            </div>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="form-group">
                    <label>Bedrooms *</label>
                    <input v-model.number="formData.bedrooms" type="number" min="0" required placeholder="e.g., 3"/>
                </div>
                <div class="form-group">
                    <label>Bathrooms *</label>
                    <input v-model.number="formData.bathrooms" type="number" min="0" required placeholder="e.g., 2"/>
                </div>
            </div>
            <div class="form-group">
                <label>Total Area (sq ft) *</label>
                <input v-model.number="formData.area" type="number" min="0" required placeholder="e.g., 1200"/>
            </div>
          </div>

          <!-- Step 3: Location -->
          <div v-show="currentStep === 2" class="space-y-5">
             <div class="form-group">
                <label>Address / Street *</label>
                <input v-model="formData.location.address" required placeholder="e.g., 123 Sunshine Avenue"/>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div class="form-group">
                  <label>City *</label>
                  <input v-model="formData.location.city" required placeholder="e.g., Mumbai"/>
              </div>
              <div class="form-group">
                  <label>State *</label>
                  <input v-model="formData.location.state" required placeholder="e.g., Maharashtra"/>
              </div>
            </div>
             <div class="form-group">
                <label>Pincode *</label>
                <input v-model="formData.location.pincode" required placeholder="e.g., 400001"/>
            </div>
          </div>

          <!-- Step 4: Pricing -->
           <div v-show="currentStep === 3" class="space-y-5">
                <div class="form-group">
                    <label>Expected Price (&#8377;) *</label>
                    <input v-model.number="formData.price" type="number" min="0" required placeholder="e.g., 7500000"/>
                </div>
            </div>

          <!-- Step 5: Amenities -->
          <div v-show="currentStep === 4" class="space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label v-for="amenity in availableAmenities" :key="amenity" class="amenity-label" :class="{'active': formData.amenities.includes(amenity)}">
                <input 
                  type="checkbox" 
                  :value="amenity" 
                  v-model="formData.amenities"
                  class="hidden"
                />
                <i class="fas fa-check-circle mr-2"></i>
                <span class="text-sm font-medium">{{ amenity }}</span>
              </label>
            </div>
          </div>

          <!-- Step 6: Images -->
          <div v-show="currentStep === 5">
            <PropertyImageUpload 
              @images-selected="handleImagesSelected" 
              :max-images="10"
            />
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between items-center mt-8">
            <button 
              type="button" 
              @click="previousStep"
              :class="{'opacity-0': currentStep === 0}"
              class="btn-secondary"
            >
              <i class="fas fa-arrow-left mr-2"></i> Previous
            </button>

            <button 
              v-if="currentStep < steps.length - 1"
              type="button" 
              @click="nextStep"
              class="btn-primary"
            >
              Next <i class="fas fa-arrow-right ml-2"></i>
            </button>
            <button 
              v-else
              type="submit" 
              :disabled="isSubmitting"
              class="btn-primary bg-secondary hover:bg-secondary-dark"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ isSubmitting ? 'Submitting...' : 'Submit Property' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PropertyImageUpload from '../../components/PropertyImageUpload.vue';
// import { createProperty } from '../../services/propertyService'; // Assuming you have this service

const router = useRouter();
const currentStep = ref(0);

const steps = [
  { title: 'Basics', icon: 'fas fa-info-circle', description: 'Let\'s start with the property title and description.' },
  { title: 'Details', icon: 'fas fa-ruler-combined', description: 'Provide key details like size and number of rooms.' },
  { title: 'Location', icon: 'fas fa-map-marker-alt', description: 'Where is your property located?' },
  { title: 'Pricing', icon: 'fas fa-rupee-sign', description: 'How much do you want to list it for?' },
  { title: 'Amenities', icon: 'fas fa-star', description: 'Select all the amenities available.' },
  { title: 'Images', icon: 'fas fa-images', description: 'Upload high-quality images of your property.' }
];

const formData = ref({
  title: '',
  description: '',
  listingType: 'sale',
  propertyType: '',
  bedrooms: null,
  bathrooms: null,
  area: null,
  price: null,
  location: {
    address: '',
    city: '',
    state: '',
    pincode: ''
  },
  amenities: []
});

const selectedImages = ref([]);

const availableAmenities = [
  'Parking', 'Garden', 'Pool', 'Gym', 'Security', 'Backup', 'Lift', 'Clubhouse', 'Play Area', 'WiFi'
];

const errors = ref({});
const isSubmitting = ref(false);

const validateStep = () => {
  errors.value = {};
  // Add validation logic here for each step
  // For example:
  if (currentStep.value === 0) {
    if (formData.value.title.length < 5) {
      errors.value.title = 'Title must be at least 5 characters';
      return false;
    }
  }
  return true;
};

const nextStep = () => {
  if (validateStep()) {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
    }
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleImagesSelected = (images) => {
  selectedImages.value = images;
};

const handleSubmit = async () => {
  if (!validateStep()) return;
  isSubmitting.value = true;

  // Simulate API Call
  console.log('Submitting:', formData.value, selectedImages.value);
  setTimeout(() => {
    isSubmitting.value = false;
    // On success, redirect
    router.push({
        name: 'PropertySuccess',
        params: { id: 'new-property-123' } 
    });
  }, 2000);

  // Real API call would look like this:
  /*
  try {
    const apiFormData = new FormData();
    // Append text data
    Object.keys(formData.value).forEach(key => {
      if (typeof formData.value[key] === 'object' && formData.value[key] !== null) {
        apiFormData.append(key, JSON.stringify(formData.value[key]));
      } else {
        apiFormData.append(key, formData.value[key]);
      }
    });
    // Append images
    selectedImages.value.forEach(imageFile => {
      apiFormData.append('images', imageFile);
    });
    const response = await createProperty(apiFormData);
    router.push({ name: 'PropertySuccess', params: { id: response.data.id } });
  } catch (error) {
    console.error('Failed to submit property:', error);
    errors.value.submit = 'An error occurred. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
  */
};

</script>

<style scoped>
.form-group label {
    @apply block text-sm font-bold text-on-surface-variant mb-2;
}

.form-group input, 
.form-group textarea, 
.form-group select {
    @apply w-full bg-surface-variant/70 border-2 border-transparent rounded-lg px-4 py-3 text-on-surface placeholder-on-surface-variant/50;
    @apply focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface;
}

.error-text {
    @apply text-red-500 text-sm mt-1;
}

.option-button {
    @apply w-full p-4 rounded-lg border-2 border-outline bg-surface-variant/50 text-on-surface-variant font-semibold flex items-center justify-center;
    @apply transition-all duration-200;
}

.option-button.active {
    @apply bg-primary-container border-primary text-primary;
}

.amenity-label {
    @apply flex items-center p-3 rounded-lg border-2 border-outline bg-surface-variant/50 cursor-pointer;
    @apply transition-all duration-200;
}

.amenity-label.active {
     @apply bg-primary-container border-primary text-primary;
}

.btn-primary {
    @apply bg-primary text-on-primary font-bold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg;
}

.btn-secondary {
     @apply bg-surface-variant text-on-surface-variant font-bold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-outline/50;
}

</style>
