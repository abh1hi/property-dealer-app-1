<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Profile Header -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div class="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {{ userInitials }}
              </div>
            </div>
            
            <!-- User Info -->
            <div class="flex-1 text-center sm:text-left">
              <h1 class="text-3xl font-bold text-gray-900">{{ profile.name || 'User Profile' }}</h1>
              <p class="text-sm text-gray-500 mt-1">
                <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium uppercase">
                  {{ profile.role || 'buyer' }}
                </span>
              </p>
              <p class="text-gray-600 mt-2">Member since {{ formattedJoinDate }}</p>
            </div>

            <!-- Edit Button -->
            <div class="flex-shrink-0">
              <button
                v-if="!isEditing"
                @click="toggleEdit"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Edit Profile
              </button>
              <button
                v-else
                @click="toggleEdit"
                class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white shadow rounded-lg p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-800">{{ error }}</p>
        </div>
      </div>

      <!-- Profile Details -->
      <div v-else class="bg-white shadow rounded-lg">
        <div class="p-6 sm:p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                :disabled="!isEditing"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                :class="{
                  'bg-white': isEditing,
                  'bg-gray-50': !isEditing
                }"
              />
            </div>

            <!-- Mobile Field -->
            <div>
              <label for="mobile" class="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span class="text-red-500">*</span>
              </label>
              <input
                id="mobile"
                v-model="formData.mobile"
                type="tel"
                :disabled="!isEditing"
                required
                pattern="[0-9]{10}"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                :class="{
                  'bg-white': isEditing,
                  'bg-gray-50': !isEditing
                }"
              />
              <p class="mt-1 text-sm text-gray-500">10-digit mobile number</p>
            </div>

            <!-- Aadhaar Field -->
            <div>
              <label for="aadhaar" class="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Number
              </label>
              <input
                id="aadhaar"
                v-model="formData.aadhaar"
                type="text"
                :disabled="!isEditing"
                pattern="[0-9]{12}"
                maxlength="12"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                :class="{
                  'bg-white': isEditing,
                  'bg-gray-50': !isEditing
                }"
              />
              <p class="mt-1 text-sm text-gray-500">12-digit Aadhaar number (optional)</p>
            </div>

            <!-- Role Field (Read-only) -->
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <input
                id="role"
                v-model="profile.role"
                type="text"
                disabled
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            <!-- Account Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <p class="px-4 py-3 bg-gray-50 rounded-lg text-gray-600 font-mono text-sm">{{ profile._id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                <p class="px-4 py-3 bg-gray-50 rounded-lg text-gray-600">{{ formattedUpdateDate }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <div v-if="isEditing" class="flex gap-4 pt-6">
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                <span v-if="!saving">Save Changes</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              </button>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="text-green-800">{{ successMessage }}</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import userService from '@/services/userService'

const authStore = useAuthStore()

// State
const profile = ref({
  _id: '',
  name: '',
  mobile: '',
  aadhaar: '',
  role: 'buyer',
  createdAt: '',
  updatedAt: ''
})

const formData = ref({
  name: '',
  mobile: '',
  aadhaar: ''
})

const isEditing = ref(false)
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const successMessage = ref('')

// Computed Properties
const userInitials = computed(() => {
  if (!profile.value.name) return 'U'
  return profile.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const formattedJoinDate = computed(() => {
  if (!profile.value.createdAt) return 'N/A'
  return new Date(profile.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const formattedUpdateDate = computed(() => {
  if (!profile.value.updatedAt) return 'N/A'
  return new Date(profile.value.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Methods
const fetchUserProfile = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Get user ID from auth store
    const userId = authStore.user?._id || authStore.user?.id
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    const response = await userService.getUserProfile(userId)
    profile.value = response.data
    
    // Initialize form data
    formData.value = {
      name: response.data.name,
      mobile: response.data.mobile,
      aadhaar: response.data.aadhaar || ''
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    error.value = err.response?.data?.message || 'Failed to load profile. Please try again.'
  } finally {
    loading.value = false
  }
}

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  successMessage.value = ''
  
  if (!isEditing.value) {
    // Reset form data if canceling
    formData.value = {
      name: profile.value.name,
      mobile: profile.value.mobile,
      aadhaar: profile.value.aadhaar || ''
    }
  }
}

const handleSubmit = async () => {
  try {
    saving.value = true
    error.value = ''
    successMessage.value = ''

    const userId = authStore.user?._id || authStore.user?.id
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Prepare update data (only send non-empty fields)
    const updateData = {
      name: formData.value.name,
      mobile: formData.value.mobile
    }

    // Only include aadhaar if it's not empty
    if (formData.value.aadhaar && formData.value.aadhaar.trim()) {
      updateData.aadhaar = formData.value.aadhaar
    }

    const response = await userService.updateUserProfile(userId, updateData)
    
    // Update profile with response
    profile.value = { ...profile.value, ...response.data }
    
    // Update auth store user data
    authStore.setAuthData({ user: response.data, token: authStore.token })
    
    successMessage.value = 'Profile updated successfully!'
    isEditing.value = false

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = err.response?.data?.message || 'Failed to update profile. Please try again.'
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>