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

  // Clean and validate mobile number - remove any non-digits
  const cleanMobile = userData.mobile.toString().replace(/\D/g, '');
  
  // Validate mobile number format (basic check)
  if (cleanMobile.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  // Validate Aadhaar if provided (12 digits)
  if (userData.aadhaar) {
    const cleanAadhaar = userData.aadhaar.toString().replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      throw new Error('Aadhaar must be exactly 12 digits');
    }
  }

  const payload = {
    name: userData.name.trim(),
    mobile: cleanMobile, // Send cleaned mobile number
  };

  // Only include aadhaar if provided
  if (userData.aadhaar) {
    const cleanAadhaar = userData.aadhaar.toString().replace(/\D/g, '');
    payload.aadhaar = cleanAadhaar;
  }

  try {
    console.log('Registration payload:', payload);
    const data = await apiClient.post('/auth/register', payload);
    return data; // Returns { message, userId }
  } catch (error) {
    console.error('Registration error:', error);
    // Extract more detailed error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.[0]?.msg ||
                        error.message || 
                        'Registration failed';
    throw new Error(errorMessage);
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

  // Clean mobile number - remove any non-digits
  const cleanMobile = mobile.toString().replace(/\D/g, '');
  
  if (cleanMobile.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  try {
    console.log('Login with mobile:', cleanMobile);
    const data = await apiClient.post('/auth/login', { mobile: cleanMobile });
    return data; // Returns { message, userId }
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.[0]?.msg ||
                        error.message || 
                        'Login failed';
    throw new Error(errorMessage);
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

  // Clean OTP - remove any non-digits
  const cleanOTP = otp.toString().replace(/\D/g, '');
  
  // Validate OTP format (6 digits)
  if (cleanOTP.length !== 6) {
    throw new Error('OTP must be 6 digits');
  }

  try {
    console.log('Verifying OTP for user:', userId);
    const data = await apiClient.post('/auth/verify-otp', {
      userId: userId.trim(),
      otp: cleanOTP,
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
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.[0]?.msg ||
                        error.message || 
                        'OTP verification failed';
    throw new Error(errorMessage);
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
