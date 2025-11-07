import { apiClient } from '../config/api';

/**
 * Register a new user with mobile, name, password (optional), and optionally Aadhaar.
 * Backend will send OTP to the mobile number.
 * Returns userId for OTP verification step.
 */
const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Check which authentication methods are available for a mobile number
 */
const checkAuthMethod = async (mobile) => {
  try {
    const response = await apiClient.post('/auth/check-auth-method', { mobile });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Login with mobile number using OTP.
 */
const loginWithOTP = async (mobile) => {
  try {
    const response = await apiClient.post('/auth/login/otp', { mobile });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Login with mobile number and password.
 */
const loginWithPassword = async (mobile, password) => {
  try {
    const response = await apiClient.post('/auth/login/password', { mobile, password });
    
    // Store token and user data
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify OTP sent to mobile number.
 */
const verifyOTP = async (userId, otp) => {
  try {
    const response = await apiClient.post('/auth/verify-otp', { userId, otp });
    
    // Store token and user data
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user - clear local storage
 */
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const isAuthenticated = () => {
  return !!getToken();
};

export default {
  register,
  checkAuthMethod,
  loginWithOTP,
  loginWithPassword,
  verifyOTP,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
};