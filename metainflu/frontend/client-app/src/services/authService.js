import { 
  auth 
} from '../config/firebase';
import { 
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import api from './api';

class AuthService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }
  
  /**
   * Initialize reCAPTCHA
   */
  initRecaptcha(containerId = 'recaptcha-container') {
    if (!this.recaptchaVerifier) {
      // Corrected argument order: containerId, parameters, auth
      this.recaptchaVerifier = new RecaptchaVerifier(containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.recaptchaVerifier = null;
        }
      }, auth);
    }
    return this.recaptchaVerifier;
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phoneNumber) {
    try {
      // Ensure phone number has country code
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      // Initialize reCAPTCHA if not already done
      const appVerifier = this.initRecaptcha();
      
      // Send OTP
      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      
      return {
        success: true,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Reset reCAPTCHA on error
      this.recaptchaVerifier = null;
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
      };
    }
  }

  /**
   * Verify OTP and log in or register the user
   */
  async verifyOTP(otp) {
    try {
      if (!this.confirmationResult) {
        throw new Error('No OTP request found. Please request OTP first.');
      }

      // Verify OTP with Firebase
      const result = await this.confirmationResult.confirm(otp);
      const user = result.user;
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Send ID token to backend to register/login
      const response = await api.post('/auth/phone', { idToken });

      // Store user data and token from our backend
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: error.message || 'Invalid OTP'
      };
    }
  }

  async updateProfile(userData) {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      const response = await api.put(`/users/${user._id}`, userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get current user from local storage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get auth token from local storage
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Listen to auth state changes from Firebase
   */
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        callback({ user, idToken });
      } else {
        callback({ user: null, idToken: null });
      }
    });
  }
}

export default new AuthService();
