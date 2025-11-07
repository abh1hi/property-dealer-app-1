<template>
  <div class="auth-page bg-gray-50">
    <div class="auth-container">
      <div class="text-center">
        <h1 class="auth-title text-gray-900">Welcome Back</h1>
        <p class="auth-subtitle text-gray-600">{{ subtitleText }}</p>
      </div>

      <!-- Step 1: Mobile Input -->
      <form v-if="!checkedMethods" class="auth-form" @submit.prevent="handleMobileSubmit">
        <div class="form-group">
          <label for="mobile" class="sr-only">Mobile Number</label>
          <input
            id="mobile"
            v-model="mobile"
            type="tel"
            inputmode="numeric"
            maxlength="10"
            required
            placeholder="Mobile Number (10 digits)"
            class="auth-input"
            :class="{ 'input-error': error }"
          />
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="auth-button bg-blue-600 hover:bg-blue-700"
          :class="{ 'button-loading': isLoading }"
        >
          <span v-if="!isLoading">Continue</span>
          <span v-else>Checking...</span>
        </button>
      </form>

      <!-- Step 2: Auth Method Selection -->
      <div v-if="checkedMethods && !authMethodChosen" class="auth-methods">
        <p v-if="error" class="error-message">{{ error }}</p>
        <p class="methods-title">Choose login method:</p>

        <button 
          v-if="availableMethods.includes('password')"
          @click="chooseAuthMethod('password')"
          class="method-button bg-blue-600 hover:bg-blue-700 text-white"
        >
          Login with Password
        </button>

        <button 
          v-if="availableMethods.includes('otp')"
          @click="chooseAuthMethod('otp')"
          class="method-button bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Login with OTP
        </button>

        <button 
          @click="resetForm"
          class="back-button"
        >
          ← Back
        </button>
      </div>

      <!-- Step 3: Password Login -->
      <form v-if="authMethodChosen && selectedMethod === 'password'" class="auth-form" @submit.prevent="handlePasswordLogin">
        <div class="form-group">
          <label for="mobile-display" class="input-label">Mobile Number</label>
          <input
            id="mobile-display"
            v-model="mobile"
            type="tel"
            disabled
            class="auth-input bg-gray-100"
          />
        </div>

        <div class="form-group">
          <label for="password" class="input-label">Password</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Enter your password"
              class="auth-input"
              :class="{ 'input-error': error }"
            />
            <button 
              type="button"
              @click="togglePasswordVisibility"
              class="password-toggle"
            >
              <svg v-if="!showPassword" class="password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button 
          type="submit"
          :disabled="isLoading"
          class="auth-button bg-blue-600 hover:bg-blue-700"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else>Logging in...</span>
        </button>
        <button 
          type="button"
          @click="resetForm"
          class="back-button"
        >
          ← Back
        </button>
      </form>

      <!-- Step 3: OTP Verification -->
      <OTPVerification
        v-if="authMethodChosen && selectedMethod === 'otp'"
        :mobile="mobile"
        :user-id="userId"
        @verify="handleVerifyOTP"
        @resend="handleSendOTP"
        @back="resetForm"
      />

      <p class="switch-auth-text">
        Don't have an account? 
        <router-link to="/register" class="switch-auth-link">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';
import OTPVerification from '../components/OTPVerification.vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'Login',
  components: {
    OTPVerification
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },
  data() {
    return {
      mobile: '',
      password: '',
      userId: '',
      showPassword: false,
      error: '',
      isLoading: false,
      checkedMethods: false,
      availableMethods: [],
      selectedMethod: '',
      authMethodChosen: false,
    };
  },
  computed: {
    subtitleText() {
      if (this.selectedMethod === 'otp') {
        return 'Enter the OTP sent to your mobile';
      } else if (this.selectedMethod === 'password') {
        return 'Enter your password to continue';
      } else if (this.checkedMethods && !this.authMethodChosen) {
        return 'Select your preferred login method';
      }
      return 'Sign in with your mobile number';
    }
  },
  methods: {
    async handleMobileSubmit() {
      const mobileRegex = /^[0-9]{10}$/;
      if (!this.mobile || !mobileRegex.test(this.mobile)) {
        this.error = 'Please enter a valid 10-digit mobile number';
        return;
      }
      this.error = '';
      this.isLoading = true;
      try {
        // First, check available auth methods
        const response = await authService.checkAuthMethod(this.mobile);
        this.availableMethods = response.availableMethods;
        this.checkedMethods = true;
        this.error = '';
      } catch (err) {
        this.error = err.message || 'Failed to check authentication method.';
      } finally {
        this.isLoading = false;
      }
    },
    chooseAuthMethod(method) {
      this.selectedMethod = method;
      this.authMethodChosen = true;
      if (method === 'otp') {
        this.handleSendOTP();
      }
    },
    async handlePasswordLogin() {
      this.error = '';
      this.isLoading = true;
      try {
        const response = await authService.loginWithPassword(this.mobile, this.password);
        const redirect = this.route.query.redirect || '/';
        this.router.push(redirect);
      } catch (err) {
        this.error = err.message || 'Invalid credentials. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    async handleSendOTP() {
      this.error = '';
      this.isLoading = true;
      try {
        const response = await authService.loginWithOTP(this.mobile);
        this.userId = response.userId;
        this.error = '';
      } catch (err) {
        this.error = err.message || 'Failed to send OTP. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    async handleVerifyOTP(otp) {
      this.error = '';
      try {
        await authService.verifyOTP(this.userId, otp);
        const redirect = this.route.query.redirect || '/';
        this.router.push(redirect);
      } catch (err) {
        this.error = err.message || 'Invalid OTP. Please try again.';
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    resetForm() {
      this.checkedMethods = false;
      this.selectedMethod = '';
      this.authMethodChosen = false;
      this.mobile = '';
      this.password = '';
      this.userId = '';
      this.error = '';
    }
  },
};
</script>

<style scoped>
  /* ...same styles as before... */
</style>
