<template>
  <div class="register-page min-h-screen bg-blue-50 flex items-center justify-center px-4 py-8">
    <div class="max-w-sm w-full bg-white p-6 md:p-8 rounded-lg shadow-xl border border-blue-100">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-4xl font-extrabold text-blue-700 tracking-tight">
          Apna Aashiyanaa
        </router-link>
        <h1 class="text-2xl font-bold text-gray-800 mt-4 mb-2">Create Account</h1>
        <p class="text-gray-600">Join us today</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
        {{ error }}
      </div>

      <!-- Step 1: Registration Form -->
      <form v-if="step === 1" @submit.prevent="handleRegister" class="space-y-5">
        <input-field v-model="form.name" id="name" label="Full Name" required />
        <input-field v-model="form.mobile" id="mobile" label="Mobile Number" type="tel" required />
        <input-field v-model="form.aadhaar" id="aadhaar" label="Aadhaar Number (Optional)" />
        <input-field v-model="form.password" id="password" label="Password (Optional)" :type="showPassword ? 'text' : 'password'">
          <template #icon>
            <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600">
              <!-- SVG for password visibility toggle -->
            </button>
          </template>
        </input-field>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-semibold transition-all duration-200 ease-in-out"
        >
          {{ loading ? 'Sending OTP...' : 'Send OTP' }}
        </button>
      </form>

      <!-- Step 2: OTP Verification -->
      <form v-if="step === 2" @submit.prevent="handleVerifyOtp" class="space-y-6">
        <p class="text-center text-gray-600">
          Enter the OTP sent to <strong>{{ form.mobile }}</strong>
        </p>
        <input-field v-model="form.otp" id="otp" label="OTP" required text-center />
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-semibold"
        >
          {{ loading ? 'Verifying...' : 'Create Account' }}
        </button>
        <button @click="step = 1" class="w-full text-sm text-gray-600 hover:underline mt-2">
          Back
        </button>
      </form>

      <!-- Links -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link to="/auth/login" class="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';
import { useAuthStore } from '@/store/auth';
import InputField from '../../components/InputField.vue'; // Assuming you have a reusable input field component

const router = useRouter();
const authStore = useAuthStore();

const step = ref(1); // 1: register, 2: verify otp

const form = ref({
  name: '',
  mobile: '',
  aadhaar: '',
  password: '',
  otp: '',
  userId: '',
});

const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    const userData = {
      name: form.value.name,
      mobile: form.value.mobile,
      aadhaar: form.value.aadhaar,
    };
    if (form.value.password) {
      userData.password = form.value.password;
    }
    const res = await authService.register(userData);
    form.value.userId = res.userId;
    step.value = 2;
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed.';
  } finally {
    loading.value = false;
  }
};

const handleVerifyOtp = async () => {
  loading.value = true;
  error.value = '';
  try {
    const user = await authService.verifyOTP(form.value.userId, form.value.otp);
    authStore.setUser(user);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'OTP verification failed.';
  } finally {
    loading.value = false;
  }
};
</script>