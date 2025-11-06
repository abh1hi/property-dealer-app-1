<template>
  <div class="register-page min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L22 12L20 14L12 6L4 14L2 12L12 2M5 15H19V22H5V15M7 17V20H9V17H7M11 17V20H13V17H11M15 17V20H17V17H15Z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-600">Join PropertyDealer today</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
        {{ error }}
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M18.536 8.464a9.97 9.97 0 011.563 3.029 10.05 10.05 0 01-9.543 7A10.05 10.05 0 0112 19"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- User Type Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
          <div class="flex gap-2">
            <button
              type="button"
              @click="form.role = 'user'"
              :class="[
                'flex-1 py-2 px-4 rounded-md font-medium transition-colors',
                form.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              Buyer
            </button>
            <button
              type="button"
              @click="form.role = 'vendor'"
              :class="[
                'flex-1 py-2 px-4 rounded-md font-medium transition-colors',
                form.role === 'vendor' 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              Seller
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <!-- Links -->
      <div class="mt-6 text-center">
        <router-link
          to="/auth/login"
          class="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Already have an account? Sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'user' // Default to buyer
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await authStore.register(form.value)
    router.push('/')
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>