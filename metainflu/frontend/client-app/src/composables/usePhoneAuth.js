import { ref, computed } from 'vue';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';

const user = ref(null);
const loading = ref(false);
const error = ref(null);
const confirmationResult = ref(null);
const recaptchaVerifier = ref(null);

export function usePhoneAuth() {
  const auth = getAuth();

  // Initialize reCAPTCHA
  const initRecaptcha = (containerId = 'recaptcha-container') => {
    try {
      if (!recaptchaVerifier.value) {
        recaptchaVerifier.value = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            error.value = 'reCAPTCHA expired. Please try again.';
          }
        });
      }
      return recaptchaVerifier.value;
    } catch (err) {
      console.error('reCAPTCHA initialization error:', err);
      error.value = 'Failed to initialize reCAPTCHA';
      return null;
    }
  };

  // Send OTP to phone number
  const sendOTP = async (phoneNumber) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Format phone number (ensure +91 prefix for India)
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone;
      }

      // Initialize reCAPTCHA if not already done
      const appVerifier = initRecaptcha();
      if (!appVerifier) {
        throw new Error('Failed to initialize reCAPTCHA');
      }

      // Send OTP
      confirmationResult.value = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      loading.value = false;
      return { success: true, message: 'OTP sent successfully' };
    } catch (err) {
      loading.value = false;
      console.error('OTP send error:', err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/invalid-phone-number') {
        error.value = 'Invalid phone number format';
      } else if (err.code === 'auth/too-many-requests') {
        error.value = 'Too many requests. Please try again later.';
      } else if (err.code === 'auth/quota-exceeded') {
        error.value = 'SMS quota exceeded. Please try again later.';
      } else {
        error.value = err.message || 'Failed to send OTP';
      }
      
      return { success: false, error: error.value };
    }
  };

  // Verify OTP code
  const verifyOTP = async (otpCode) => {
    loading.value = true;
    error.value = null;

    try {
      if (!confirmationResult.value) {
        throw new Error('No confirmation result. Please send OTP first.');
      }

      // Verify the OTP code
      const result = await confirmationResult.value.confirm(otpCode);
      user.value = result.user;
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber,
        token: await result.user.getIdToken()
      }));

      loading.value = false;
      return { success: true, user: result.user };
    } catch (err) {
      loading.value = false;
      console.error('OTP verification error:', err);
      
      if (err.code === 'auth/invalid-verification-code') {
        error.value = 'Invalid OTP code. Please check and try again.';
      } else if (err.code === 'auth/code-expired') {
        error.value = 'OTP code has expired. Please request a new one.';
      } else {
        error.value = err.message || 'Failed to verify OTP';
      }
      
      return { success: false, error: error.value };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await auth.signOut();
      user.value = null;
      localStorage.removeItem('user');
      confirmationResult.value = null;
      return { success: true };
    } catch (err) {
      console.error('Sign out error:', err);
      error.value = 'Failed to sign out';
      return { success: false, error: error.value };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = computed(() => {
    return !!user.value || !!localStorage.getItem('user');
  });

  // Get current user
  const getCurrentUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user.value) {
      user.value = JSON.parse(storedUser);
    }
    return user.value;
  };

  // Reset reCAPTCHA
  const resetRecaptcha = () => {
    if (recaptchaVerifier.value) {
      recaptchaVerifier.value.clear();
      recaptchaVerifier.value = null;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    initRecaptcha,
    sendOTP,
    verifyOTP,
    signOut,
    getCurrentUser,
    resetRecaptcha
  };
}
