import { apiClient } from '../config/api';

/**
 * Register a new user with mobile, name, and optionally Aadhaar.
 * Backend will send OTP to the mobile number.
 * Returns userId for OTP verification step.
 */
const register = async (userData) => {
  // Validate required fields
  if (!userData.name || !userData.mobile) {
    throw new Error('Name and mobile number are required');
  }

  // Validate mobile number format (basic check)
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(userData.mobile)) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  // Validate Aadhaar if provided (12 digits)
  if (userData.aadhaar && !/^[0-9]{12}$/.test(userData.aadhaar)) {
    throw new Error('Aadhaar must be exactly 12 digits');
  }

  const payload = {
    name: userData.name.trim(),
    mobile: userData.mobile.trim(),
  };

  // Only include aadhaar if provided
  if (userData.aadhaar) {
    payload.aadhaar = userData.aadhaar.trim();
  }

  try {
    const data = await apiClient.post('/auth/register', payload);
    return data; // Returns { message, userId }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login with mobile number.
 * Backend will send OTP to the mobile number.
 * Returns userId for OTP verification step.
 */
const login = async (mobile) => {
  // Validate mobile number
  if (!mobile) {
    throw new Error('Mobile number is required');
  }

  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  try {
    const data = await apiClient.post('/auth/login', { mobile: mobile.trim() });
    return data; // Returns { message, userId }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Verify OTP sent to mobile number.
 * On success, returns user data with JWT token.
 */
const verifyOTP = async (userId, otp) => {
  // Validate inputs
  if (!userId || !otp) {
    throw new Error('User ID and OTP are required');
  }

  // Validate OTP format (6 digits)
  if (!/^[0-9]{6}$/.test(otp)) {
    throw new Error('OTP must be 6 digits');
  }

  try {
    const data = await apiClient.post('/auth/verify-otp', {
      userId: userId.trim(),
      otp: otp.trim(),
    });

    // Store token and user data on successful verification
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        mobile: data.mobile,
        aadhaar: data.aadhaar,
        role: data.role || 'user',
      }));
    }

    return data;
  } catch (error) {
    console.error('OTP verification error:', error);
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

/**
 * Get current user from localStorage
 */
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get current token from localStorage
 */
const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = () => {
  return !!getToken();
};

export default {
  register,
  login,
  verifyOTP,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
};
