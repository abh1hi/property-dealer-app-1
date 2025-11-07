import { apiClient } from '../config/api';

/**
 * Register a new user with mobile, name, password (optional), and optionally Aadhaar.
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

  // Validate password if provided
  if (userData.password && userData.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const payload = {
    name: userData.name.trim(),
    mobile: cleanMobile,
  };

  // Include aadhaar if provided
  if (userData.aadhaar) {
    const cleanAadhaar = userData.aadhaar.toString().replace(/\D/g, '');
    payload.aadhaar = cleanAadhaar;
  }

  // Include password if provided
  if (userData.password) {
    payload.password = userData.password;
  }

  try {
    console.log('Registration payload:', { ...payload, password: payload.password ? '***' : undefined });
    const data = await apiClient.post('/auth/register', payload);
    return data; // Returns { message, userId, hasPassword }
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.[0]?.msg ||
                        error.message || 
                        'Registration failed';
    throw new Error(errorMessage);
  }
};

/**
 * Check which authentication methods are available for a mobile number
 */
const checkAuthMethod = async (mobile) => {
  if (!mobile) {
    throw new Error('Mobile number is required');
  }

  const cleanMobile = mobile.toString().replace(/\D/g, '');
  
  if (cleanMobile.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  try {
    const data = await apiClient.post('/auth/check-auth-method', { mobile: cleanMobile });
    return data; // Returns { mobile, hasPassword, availableMethods }
  } catch (error) {
    console.error('Check auth method error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to check authentication method';
    throw new Error(errorMessage);
  }
};

/**
 * Login with mobile number using OTP.
 * Backend will send OTP to the mobile number.
 * Returns userId for OTP verification step.
 */
const loginWithOTP = async (mobile) => {
  if (!mobile) {
    throw new Error('Mobile number is required');
  }

  const cleanMobile = mobile.toString().replace(/\D/g, '');
  
  if (cleanMobile.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  try {
    console.log('Login with OTP for mobile:', cleanMobile);
    const data = await apiClient.post('/auth/login/otp', { mobile: cleanMobile });
    return data; // Returns { message, userId }
  } catch (error) {
    console.error('OTP login error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.[0]?.msg ||
                        error.message || 
                        'OTP login failed';
    throw new Error(errorMessage);
  }
};

/**
 * Login with mobile number and password.
 * Returns user data with JWT token directly (no OTP needed).
 */
const loginWithPassword = async (mobile, password) => {
  if (!mobile || !password) {
    throw new Error('Mobile number and password are required');
  }

  const cleanMobile = mobile.toString().replace(/\D/g, '');
  
  if (cleanMobile.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  try {
    console.log('Login with password for mobile:', cleanMobile);
    const data = await apiClient.post('/auth/login/password', {
      mobile: cleanMobile,
      password: password,
    });

    // Store token and user data on successful login
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        mobile: data.mobile,
        aadhaar: data.aadhaar,
        role: data.role || 'buyer',
      }));
    }

    return data;
  } catch (error) {
    console.error('Password login error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.[0]?.msg ||
                        error.message || 
                        'Password login failed';
    throw new Error(errorMessage);
  }
};

/**
 * Verify OTP sent to mobile number.
 * On success, returns user data with JWT token.
 */
const verifyOTP = async (userId, otp) => {
  if (!userId || !otp) {
    throw new Error('User ID and OTP are required');
  }

  const cleanOTP = otp.toString().replace(/\D/g, '');
  
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
        role: data.role || 'buyer',
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

// Backward compatibility
const login = loginWithOTP;

export default {
  register,
  checkAuthMethod,
  login, // Backward compatible - uses OTP
  loginWithOTP,
  loginWithPassword,
  verifyOTP,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
};
