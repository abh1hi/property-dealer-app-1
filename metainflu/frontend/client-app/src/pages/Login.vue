<template>
  <div class="auth-page bg-gray-50">
    <div class="auth-container">
      <div class="text-center">
        <h1 class="auth-title text-gray-900">Welcome Back</h1>
        <p class="auth-subtitle text-gray-600">
          {{ showOTP ? 'Enter the OTP sent to your mobile' : 'Sign in with your mobile number' }}
        </p>
      </div>

      <!-- Mobile Number Form -->
      <form v-if="!showOTP" class="auth-form" @submit.prevent="handleSendOTP">
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
          class="auth-button"
          :class="{ 'button-loading': isLoading }"
        >
          <span v-if="!isLoading">Send OTP</span>
          <span v-else>Sending...</span>
        </button>
      </form>

      <!-- OTP Verification -->
      <OTPVerification
        v-else
        :mobile="mobile"
        :user-id="userId"
        @verify="handleVerifyOTP"
        @resend="handleSendOTP"
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
      userId: '',
      showOTP: false,
      error: '',
      isLoading: false,
    };
  },
  methods: {
    async handleSendOTP() {
      // Validate mobile number
      const mobileRegex = /^[0-9]{10}$/;
      if (!this.mobile || !mobileRegex.test(this.mobile)) {
        this.error = 'Please enter a valid 10-digit mobile number';
        return;
      }

      this.error = '';
      this.isLoading = true;

      try {
        const response = await authService.login(this.mobile);
        this.userId = response.userId;
        this.showOTP = true;
        this.error = '';
      } catch (err) {
        console.error('Login error:', err);
        this.error = err.message || 'Failed to send OTP. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },

    async handleVerifyOTP(otp) {
      this.error = '';

      try {
        const response = await authService.verifyOTP(this.userId, otp);
        
        // Redirect to home or intended page
        const redirect = this.route.query.redirect || '/';
        this.router.push(redirect);
      } catch (err) {
        console.error('OTP verification error:', err);
        throw new Error(err.message || 'Invalid OTP. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.auth-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.auth-subtitle {
  margin-top: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
}

.auth-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.auth-input {
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.auth-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.input-error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #8b5cf6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.auth-button:hover:not(:disabled) {
  background-color: #7c3aed;
  transform: translateY(-1px);
}

.auth-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-loading {
  opacity: 0.7;
}

.switch-auth-text {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.switch-auth-link {
  font-weight: 600;
  color: #8b5cf6;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.switch-auth-link:hover {
  color: #7c3aed;
}
</style>
