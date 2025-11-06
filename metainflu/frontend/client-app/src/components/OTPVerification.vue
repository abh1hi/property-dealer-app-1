<template>
  <div class="otp-verification">
    <h2 class="otp-title">Enter OTP</h2>
    <p class="otp-subtitle">We've sent a 6-digit code to {{ maskedMobile }}</p>
    
    <form @submit.prevent="handleVerify" class="otp-form">
      <div class="otp-input-container">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          :ref="el => setInputRef(el, index)"
          v-model="otpDigits[index]"
          @input="handleInput(index, $event)"
          @keydown="handleKeydown(index, $event)"
          @paste="handlePaste"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="otp-input"
          :class="{ 'otp-input-error': error }"
        />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <button 
        type="submit" 
        :disabled="isLoading || !isOtpComplete"
        class="verify-button"
        :class="{ 'button-loading': isLoading }"
      >
        <span v-if="!isLoading">Verify OTP</span>
        <span v-else>Verifying...</span>
      </button>

      <div class="resend-container">
        <span v-if="countdown > 0" class="countdown-text">
          Resend OTP in {{ countdown }}s
        </span>
        <button 
          v-else
          type="button"
          @click="handleResend"
          class="resend-button"
        >
          Resend OTP
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'OTPVerification',
  props: {
    mobile: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  emits: ['verify', 'resend'],
  data() {
    return {
      otpDigits: ['', '', '', '', '', ''],
      inputRefs: [],
      error: '',
      isLoading: false,
      countdown: 60
    }
  },
  computed: {
    maskedMobile() {
      if (!this.mobile) return '';
      const len = this.mobile.length;
      return this.mobile.substring(0, 2) + '*'.repeat(len - 4) + this.mobile.substring(len - 2);
    },
    isOtpComplete() {
      return this.otpDigits.every(digit => digit !== '');
    },
    otpValue() {
      return this.otpDigits.join('');
    }
  },
  mounted() {
    this.startCountdown();
    // Focus first input
    if (this.inputRefs[0]) {
      this.inputRefs[0].focus();
    }
  },
  methods: {
    setInputRef(el, index) {
      if (el) {
        this.inputRefs[index] = el;
      }
    },
    handleInput(index, event) {
      const value = event.target.value;
      
      // Only allow numbers
      if (!/^[0-9]$/.test(value) && value !== '') {
        this.otpDigits[index] = '';
        return;
      }

      this.error = '';

      // Move to next input if value is entered
      if (value && index < 5) {
        this.$nextTick(() => {
          this.inputRefs[index + 1]?.focus();
        });
      }
    },
    handleKeydown(index, event) {
      // Handle backspace
      if (event.key === 'Backspace') {
        if (!this.otpDigits[index] && index > 0) {
          this.otpDigits[index - 1] = '';
          this.$nextTick(() => {
            this.inputRefs[index - 1]?.focus();
          });
        }
      }
      // Handle arrow keys
      else if (event.key === 'ArrowLeft' && index > 0) {
        this.inputRefs[index - 1]?.focus();
      }
      else if (event.key === 'ArrowRight' && index < 5) {
        this.inputRefs[index + 1]?.focus();
      }
    },
    handlePaste(event) {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text').trim();
      
      // Validate pasted data is 6 digits
      if (/^[0-9]{6}$/.test(pastedData)) {
        this.otpDigits = pastedData.split('');
        this.error = '';
        // Focus last input
        this.$nextTick(() => {
          this.inputRefs[5]?.focus();
        });
      }
    },
    async handleVerify() {
      if (!this.isOtpComplete) {
        this.error = 'Please enter complete OTP';
        return;
      }

      this.error = '';
      this.isLoading = true;

      try {
        await this.$emit('verify', this.otpValue);
      } catch (err) {
        this.error = err.message || 'Invalid OTP. Please try again.';
        // Clear OTP on error
        this.otpDigits = ['', '', '', '', '', ''];
        this.$nextTick(() => {
          this.inputRefs[0]?.focus();
        });
      } finally {
        this.isLoading = false;
      }
    },
    handleResend() {
      this.otpDigits = ['', '', '', '', '', ''];
      this.error = '';
      this.countdown = 60;
      this.startCountdown();
      this.$emit('resend');
      this.$nextTick(() => {
        this.inputRefs[0]?.focus();
      });
    },
    startCountdown() {
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  }
}
</script>

<style scoped>
.otp-verification {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.otp-title {
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.otp-subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.otp-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.otp-input-container {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.otp-input {
  width: 3rem;
  height: 3.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.otp-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.otp-input-error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin: -0.5rem 0 0 0;
}

.verify-button {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #8b5cf6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.verify-button:hover:not(:disabled) {
  background-color: #7c3aed;
  transform: translateY(-1px);
}

.verify-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-loading {
  opacity: 0.7;
}

.resend-container {
  text-align: center;
}

.countdown-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.resend-button {
  background: none;
  border: none;
  color: #8b5cf6;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.resend-button:hover {
  color: #7c3aed;
  text-decoration: underline;
}
</style>
