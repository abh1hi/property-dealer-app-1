import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public Routes
    {
      path: '/',
      name: 'HomePage',
      component: () => import('../pages/home/HomePage.vue')
    },
    
    // Authentication Routes
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('../pages/auth/Login.vue'),
          meta: { requiresGuest: true }
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('../pages/auth/Register.vue'),
          meta: { requiresGuest: true }
        }
      ]
    },

    // Backward compatibility - keep old auth routes
    {
      path: '/login',
      redirect: '/auth/login'
    },
    {
      path: '/register',
      redirect: '/auth/register'
    },

    // Property Routes
    {
      path: '/property',
      children: [
        {
          path: '',
          name: 'PropertyList',
          component: () => import('../pages/property/PropertyList.vue')
        },
        {
          path: 'add',
          name: 'AddProperty',
          component: () => import('../pages/property/AddProperty.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },

    // User Routes
    {
      path: '/user',
      children: [
        {
          path: 'profile',
          name: 'UserProfile',
          component: () => import('../pages/user/Profile.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'my-listings',
          name: 'MyListings',
          component: () => import('../pages/user/MyListings.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'favorites',
          name: 'UserFavorites',
          component: () => import('../pages/user/Favorites.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },

    // Category Routes
    {
      path: '/buy',
      name: 'BuyPage',
      component: () => import('../pages/buy/BuyPage.vue')
    },
    {
      path: '/rent',
      name: 'RentPage',
      component: () => import('../pages/rent/RentPage.vue')
    },
    {
      path: '/sell',
      name: 'SellPage',
      component: () => import('../pages/property/AddProperty.vue'),
      meta: { requiresAuth: true }
    },

    // Keep existing routes for now (until pages are created)
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../pages/Contact.vue')
    },

    // 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/NotFound.vue')
    }
  ]
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage if not already initialized
  if (!authStore.isAuthenticated && localStorage.getItem('token')) {
    await authStore.checkAuth()
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/auth/login', query: { redirect: to.fullPath } })
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/')
  }
  
  // Check role-based access
  if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    return next('/404')
  }
  
  next()
})

export default router
