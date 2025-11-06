import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  vendorLogin: (credentials) => api.post('/auth/vendor/login', credentials)
}

// Property API (using existing product endpoints)
export const propertyApi = {
  getProperties: (params = {}) => api.get('/products', { params }),
  getProperty: (id) => api.get(`/products/${id}`),
  createProperty: (propertyData) => api.post('/products', propertyData),
  updateProperty: (id, propertyData) => api.put(`/products/${id}`, propertyData),
  deleteProperty: (id) => api.delete(`/products/${id}`)
}

// Favorites API (using cart endpoints)
export const favoritesApi = {
  getFavorites: () => api.get('/cart'),
  addToFavorites: (propertyId) => api.post('/cart/add', { productId: propertyId }),
  removeFromFavorites: (propertyId) => api.delete(`/cart/remove/${propertyId}`)
}

// Categories API
export const categoryApi = {
  getCategories: () => api.get('/categories'),
  createCategory: (categoryData) => api.post('/categories', categoryData)
}

// User API
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData)
}

// Property data transformation
export const transformPropertyData = (backendData) => {
  return {
    _id: backendData._id,
    name: backendData.name,
    description: backendData.description,
    price: backendData.variants?.[0]?.price || backendData.price,
    images: backendData.images || [],
    location: backendData.location,
    type: backendData.categories?.[0]?.name || 'For Sale',
    bedrooms: backendData.specifications?.bedrooms,
    bathrooms: backendData.specifications?.bathrooms,
    area: backendData.specifications?.area,
    agent: backendData.user,
    createdAt: backendData.createdAt,
    updatedAt: backendData.updatedAt
  }
}

export default api