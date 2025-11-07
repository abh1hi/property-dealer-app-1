<template>
  <div class="auth-page bg-gray-50">
    <div class="auth-container">
      <div class="text-center">
        <h1 class="auth-title text-gray-900">Welcome Back</h1>
        <p class="auth-subtitle text-gray-600">
          {{ subtitleText }}
        </p>
      </div>

      <!-- Mobile Number Form (Initial Step) -->
      <form v-if="!showOTP && !showPasswordForm" class="auth-form" @submit.prevent="checkAuthMethod">
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

      <!-- Auth Method Selection -->
      <div v-if="showAuthMethods && !showOTP && !showPasswordForm" class="auth-methods">
        <p class="methods-title">Choose login method:</p>
        
        <button 
          v-if="availableMethods.includes('password')"
          @click="selectPasswordLogin"
          class="method-button bg-blue-600 hover:bg-blue-700"
        >
          <svg class="method-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Login with Password
        </button>

        <button 
          @click="selectOTPLogin"
          class="method-button bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <svg class="method-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Login with OTP
        </button>

        <button 
          @click="resetForm"
          class="back-button"
        >
          ← Back
        </button>
      </div>

      <!-- Password Login Form -->
      <form v-if="showPasswordForm && !showOTP" class="auth-form" @submit.prevent="handlePasswordLogin">
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
          :class="{ 'button-loading': isLoading }"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else>Logging in...</span>
        </button>

        <button 
          type="button"
          @click="switchToOTP"
          class="switch-method-button"
        >
          Use OTP instead
        </button>

        <button 
          type="button"
          @click="resetForm"
          class="back-button"
        >
          ← Back
        </button>
      </form>

      <!-- OTP Verification -->
      <OTPVerification
        v-if="showOTP"
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
      password: '',
      userId: '',
      showOTP: false,
      showPasswordForm: false,
      showAuthMethods: false,
      showPassword: false,
      availableMethods: [],
      error: '',
      isLoading: false,
    };
  },
  computed: {
    subtitleText() {
      if (this.showOTP) {
        return 'Enter the OTP sent to your mobile';
      } else if (this.showPasswordForm) {
        return 'Enter your password to continue';
      } else if (this.showAuthMethods) {
        return 'Select your preferred login method';
      } else {
        return 'Sign in with your mobile number';
      }
    }
  },
  methods: {
    async checkAuthMethod() {
      // Validate mobile number
      const mobileRegex = /^[0-9]{10}$/;
      if (!this.mobile || !mobileRegex.test(this.mobile)) {
        this.error = 'Please enter a valid 10-digit mobile number';
        return;
      }

      this.error = '';
      this.isLoading = true;

      try {
        const response = await authService.checkAuthMethod(this.mobile);
        this.availableMethods = response.availableMethods || ['otp'];
        
        // If only OTP is available, send OTP directly
        if (this.availableMethods.length === 1 && this.availableMethods[0] === 'otp') {
          await this.handleSendOTP();
        } else {
          // Show auth method selection
          this.showAuthMethods = true;
        }
        
        this.error = '';
      } catch (err) {
        console.error('Check auth method error:', err);
        this.error = err.message || 'Failed to check authentication method. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },

    selectPasswordLogin() {
      this.showAuthMethods = false;
      this.showPasswordForm = true;
    },

    selectOTPLogin() {
      this.showAuthMethods = false;
      this.handleSendOTP();
    },

    async handlePasswordLogin() {
      this.error = '';
      this.isLoading = true;

      try {
        const response = await authService.loginWithPassword(this.mobile, this.password);
        
        // Redirect to home or intended page
        const redirect = this.route.query.redirect || '/';
        this.router.push(redirect);
      } catch (err) {
        console.error('Password login error:', err);
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
        this.showOTP = true;
        this.showPasswordForm = false;
        this.showAuthMethods = false;
        this.error = '';
      } catch (err) {
        console.error('OTP login error:', err);
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

    switchToOTP() {
      this.password = '';
      this.showPasswordForm = false;
      if (this.availableMethods.length > 1) {
        this.showAuthMethods = true;
      } else {
        this.handleSendOTP();
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    resetForm() {
      this.showOTP = false;
      this.showPasswordForm = false;
      this.showAuthMethods = false;
      this.password = '';
      this.error = '';
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

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
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
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-error {
  border-color: #ef4444;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6b7280;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #374151;
}

.password-icon {
  width: 1.25rem;
  height: 1.25rem;
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
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.auth-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-loading {
  opacity: 0.7;
}

.auth-methods {
  margin-top: 2rem;
}

.methods-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  text-align: center;
}

.method-button {
  width: 100%;
  padding: 1rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.method-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.switch-method-button {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.switch-method-button:hover {
  color: #1d4ed8;
}

.back-button {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.back-button:hover {
  color: #374151;
}

.switch-auth-text {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.switch-auth-link {
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.switch-auth-link:hover {
  color: #1d4ed8;
}
</style>
