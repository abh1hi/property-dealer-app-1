<template>
  <div class="login-page min-h-screen bg-white flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-bold text-blue-600">
          Apna Aashiyanaa
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900 mt-4 mb-2">Welcome Back</h1>
        <p class="text-gray-600">Sign in to continue</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
        {{ error }}
      </div>

      <!-- Step 1: Enter Mobile Number -->
      <form v-if="step === 1" @submit.prevent="handleCheckAuth" class="space-y-6">
        <div>
          <label for="mobile" class="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
          <input
            id="mobile"
            v-model="form.mobile"
            type="tel"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your mobile number"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {{ loading ? 'Continuing...' : 'Continue' }}
        </button>
      </form>

      <!-- Step 2: Choose Auth Method -->
      <div v-if="step === 2" class="space-y-4">
        <p class="text-center text-gray-600">
          Mobile: <strong>{{ form.mobile }}</strong>
        </p>
        <button
          v-if="authMethods.includes('password')"
          @click="setAuthMethod('password')"
          class="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 font-semibold"
        >
          Login with Password
        </button>
        <button
          @click="setAuthMethod('otp')"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Login with OTP
        </button>
        <button @click="reset" class="w-full text-sm text-gray-600 hover:underline mt-2">
          Back
        </button>
      </div>

      <!-- Step 3: Enter Password -->
      <form v-if="step === 3 && authMethod === 'password'" @submit.prevent="handlePasswordLogin" class="space-y-6">
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <!-- SVG for password visibility toggle -->
          </button>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <button @click="step = 2" class="w-full text-sm text-gray-600 hover:underline mt-2">
          Back
        </button>
      </form>

      <!-- Step 3: Enter OTP -->
      <form v-if="step === 3 && authMethod === 'otp'" @submit.prevent="handleOtpLogin" class="space-y-6">
        <p class="text-center text-gray-600">
          Enter the OTP sent to <strong>{{ form.mobile }}</strong>
        </p>
        <input
          id="otp"
          v-model="form.otp"
          type="text"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="------"
        />
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold"
        >
          {{ loading ? 'Verifying...' : 'Verify OTP' }}
        </button>
        <button @click="step = 2" class="w-full text-sm text-gray-600 hover:underline mt-2">
          Back
        </button>
      </form>

      <!-- Links -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link
            to="/auth/register"
            class="text-blue-600 hover:underline font-medium"
          >
            Sign up
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

const router = useRouter();
const authStore = useAuthStore();

const step = ref(1); // 1: mobile, 2: choose method, 3: enter password/otp
const authMethod = ref(''); // 'otp' or 'password'
const authMethods = ref([]);

const form = ref({
  mobile: '',
  password: '',
  otp: '',
  userId: '',
});

const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

const reset = () => {
  step.value = 1;
  authMethod.value = '';
  authMethods.value = [];
  form.value.password = '';
  form.value.otp = '';
  error.value = '';
};

const handleCheckAuth = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await authService.checkAuthMethod(form.value.mobile);
    authMethods.value = res.availableMethods;
    if (res.hasPassword) {
      step.value = 2;
    } else {
      // Automatically trigger OTP flow if no password is set
      setAuthMethod('otp');
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to check mobile number.';
  } finally {
    loading.value = false;
  }
};

const setAuthMethod = async (method) => {
  authMethod.value = method;
  step.value = 3;
  if (method === 'otp') {
    loading.value = true;
    error.value = '';
    try {
      const res = await authService.loginWithOTP(form.value.mobile);
      form.value.userId = res.userId;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to send OTP.';
      step.value = 2; // Go back if OTP sending fails
    } finally {
      loading.value = false;
    }
  }
};

const handlePasswordLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const user = await authService.loginWithPassword(form.value.mobile, form.value.password);
    authStore.setUser(user);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed.';
  } finally {
    loading.value = false;
  }
};

const handleOtpLogin = async () => {
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