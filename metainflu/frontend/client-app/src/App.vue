<template>
  <div id="app" class="bg-background text-on-background min-h-screen flex flex-col">
    <AppHeader />
    
    <main class="flex-grow pb-20 md:pb-0">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <AppFooter />
    <BottomNavBar />
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import BottomNavBar from '@/components/BottomNavBar.vue';
</script>

<style>
/* Global styles, including transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
