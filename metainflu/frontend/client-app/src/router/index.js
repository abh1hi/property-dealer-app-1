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
        },
        {
          path: 'otp-verify',
          name: 'OTPVerify',
          component: () => import('../pages/auth/OTPVerify.vue'),
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
        },
        {
          path: ':id',
          name: 'PropertyDetails',
          component: () => import('../pages/property/PropertyDetails.vue')
        },
        {
          path: 'add',
          name: 'AddProperty',
          component: () => import('../pages/property/AddProperty.vue'),
          meta: { requiresAuth: true, roles: ['vendor', 'admin'] }
        },
        {
          path: ':id/edit',
          name: 'EditProperty',
          component: () => import('../pages/property/EditProperty.vue'),
          meta: { requiresAuth: true, roles: ['vendor', 'admin'] }
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
      component: () => import('../pages/sell/SellPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tourist',
      children: [
        {
          path: 'short-stay',
          name: 'ShortStay',
          component: () => import('../pages/tourist/ShortStay.vue')
        }
      ]
    },

    // User Routes
    {
      path: '/user',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../pages/user/Profile.vue')
        },
        {
          path: 'my-listings',
          name: 'MyListings',
          component: () => import('../pages/user/MyListings.vue'),
          meta: { roles: ['vendor', 'admin'] }
        },
        {
          path: 'favorites',
          name: 'Favorites',
          component: () => import('../pages/user/Favorites.vue')
        }
      ]
    },

    // Admin Routes
    {
      path: '/admin',
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('../pages/admin/AdminDashboard.vue')
        },
        {
          path: 'users',
          name: 'ManageUsers',
          component: () => import('../pages/admin/ManageUsers.vue')
        },
        {
          path: 'listings',
          name: 'ManageListings',
          component: () => import('../pages/admin/ManageListings.vue')
        },
        {
          path: 'approve-listing/:id',
          name: 'ApproveListing',
          component: () => import('../pages/admin/ApproveListing.vue')
        }
      ]
    },

    // Search
    {
      path: '/search',
      name: 'SearchResults',
      component: () => import('../pages/search/SearchResults.vue')
    },

    // Keep existing routes for now (until pages are created)
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../pages/Contact.vue')
    },

    // Error Routes
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('../pages/error/NotFound.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
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