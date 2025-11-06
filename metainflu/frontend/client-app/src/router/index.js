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

    // Property Routes
    {
      path: '/property',
      children: [
        {
          path: '',
          name: 'PropertyList',
          component: () => import('../pages/property/PropertyList.vue')
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

    // Keep existing routes for now (until pages are created)
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../pages/Contact.vue')
    }
  ]
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/auth/login')
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