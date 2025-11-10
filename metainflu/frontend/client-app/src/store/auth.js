import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// A more modern, composition API-style store
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);

  // Check for stored user on initialization
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      console.error('Error parsing stored user:', e);
      localStorage.removeItem('user');
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userInitials = computed(() => {
    if (user.value && user.value.name) {
      return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  });

  function setAuth({ user: userData, token: newToken }) {
    user.value = userData;
    token.value = newToken;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', newToken);
  }

  function updateUser(userData) {
    user.value = { ...user.value, ...userData };
    localStorage.setItem('user', JSON.stringify(user.value));
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // The favorites store should listen to auth changes or be cleared via an action subscription.
  }

  // This would be your action to call after a successful API login
  async function login(credentials) {
    // This is a placeholder for your actual API call.
    // Replace with: const { user, token } = await api.auth.login(credentials);
    console.log('Simulating login for', credentials.email);
    const mockUser = {
      _id: 'd9f8c7b6a5e4d3c2b1a0',
      name: 'John Doe',
      email: credentials.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe`,
    };
    const mockToken = 'jwt-mock-token-for-testing-purpose';

    setAuth({ user: mockUser, token: mockToken });

    return mockUser;
  }
  
  async function register(userData) {
    console.log('Simulating registration for', userData.email);
    const mockUser = {
      _id: 'new-user-id-from-backend',
      name: userData.name,
      email: userData.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`,
    };
    const mockToken = 'jwt-mock-token-for-new-user';
    setAuth({ user: mockUser, token: mockToken });
    return mockUser;
  }

  return {
    user,
    token,
    isAuthenticated,
    userInitials,
    login,
    register,
    logout,
    updateUser,
    setAuth,
  };
});
