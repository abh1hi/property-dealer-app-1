<template>
  <div class="profile-page min-h-screen bg-background text-on-background">
    
    <!-- Page Header -->
    <div class="sticky top-0 z-30 bg-background/80 backdrop-blur-sm shadow-sm">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-on-surface">Profile</h1>
            <router-link to="/user/profile/edit" class="btn-secondary">
              <i class="fas fa-pen mr-2"></i>
              Edit Profile
            </router-link>
        </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-on-surface-variant">Loading profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="w-24 h-24 bg-error-container text-error mx-auto rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-exclamation-triangle text-4xl"></i>
        </div>
        <h3 class="text-2xl font-semibold text-on-surface mb-2">Failed to load profile</h3>
        <p class="text-on-surface-variant mb-6 max-w-md mx-auto">{{ error }}</p>
        <button @click="fetchUser" class="btn-primary">
            Retry
        </button>
      </div>
      
      <!-- User Information -->
      <div v-else-if="user" class="bg-surface rounded-xl shadow-md p-6 md:p-8">
        <div class="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
          <div class="relative mb-6 md:mb-0">
            <img :src="userAvatar" alt="User avatar" class="w-32 h-32 rounded-full object-cover border-4 border-primary-variant">
          </div>
          <div class="flex-grow text-center md:text-left">
            <h2 class="text-3xl font-bold text-on-surface">{{ user.name }}</h2>
            <p class="text-primary font-medium text-lg mt-1">{{ user.role }}</p>
            <p class="text-on-surface-variant text-sm mt-4">Joined on {{ formattedDate(user.createdAt) }}</p>
          </div>
        </div>

        <div class="border-t border-outline my-8"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div class="info-item">
            <label class="info-label">Email Address</label>
            <p class="info-value">{{ user.email }}</p>
          </div>
          <div class="info-item">
            <label class="info-label">Mobile Number</label>
            <p class="info-value">{{ user.mobile || 'Not Provided' }}</p>
          </div>
          <div class="info-item">
            <label class="info-label">Aadhaar Number</label>
            <p class="info-value">{{ user.aadhaarNumber || 'Not Provided' }}</p>
          </div>
          <div class="info-item">
            <label class="info-label">User ID</label>
            <p class="info-value text-xs">{{ user._id }}</p>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, loading, error } = storeToRefs(authStore)

const userAvatar = computed(() => user.value?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.value?.name || 'User'}`)

const formattedDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const fetchUser = () => {
    authStore.fetchUser();
}

onMounted(() => {
  if (!user.value) {
    fetchUser()
  }
})
</script>

<style scoped>
.btn-primary {
    @apply bg-primary text-on-primary font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-0.5;
}
.btn-secondary {
    @apply bg-surface-variant text-on-surface-variant font-semibold py-2 px-5 rounded-full transition duration-300 ease-in-out hover:bg-primary-container;
}
.info-item {
  @apply bg-background rounded-lg p-4;
}
.info-label {
  @apply block text-xs font-medium text-on-surface-variant uppercase tracking-wider;
}
.info-value {
  @apply mt-1 text-base font-semibold text-on-surface;
}
</style>
