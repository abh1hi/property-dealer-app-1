<template>
  <div class="chat-page min-h-screen bg-background text-on-background">
    <!-- Page Header -->
    <div class="sticky top-16 md:top-0 z-30 bg-background/80 backdrop-blur-sm shadow-sm">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 class="text-2xl font-bold text-on-surface">Messages</h1>
        </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Chat Interface -->
      <div class="bg-surface rounded-xl shadow-md overflow-hidden">
        <div class="md:grid md:grid-cols-3 h-[calc(100vh-200px)]">
          <!-- Conversations List -->
          <div class="col-span-1 border-r border-outline overflow-y-auto">
            <div class="p-4 border-b border-outline">
                <input type="text" placeholder="Search chats..." class="w-full bg-surface-variant rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <ul>
              <li v-for="convo in conversations" :key="convo.id" @click="selectedConversation = convo" :class="{'bg-primary-container': selectedConversation && selectedConversation.id === convo.id}" class="p-4 hover:bg-surface-variant cursor-pointer flex items-center">
                <img :src="convo.avatar" class="w-12 h-12 rounded-full mr-4">
                <div>
                  <p class="font-semibold">{{ convo.name }}</p>
                  <p class="text-sm text-on-surface-variant truncate">{{ convo.lastMessage }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Messages View -->
          <div class="col-span-2 flex flex-col">
            <div v-if="selectedConversation" class="flex-1 p-6 overflow-y-auto">
              <!-- Message Bubbles -->
              <div v-for="message in selectedConversation.messages" :key="message.id" :class="message.sent ? 'justify-end' : 'justify-start'" class="flex mb-4">
                <div :class="message.sent ? 'bg-primary text-on-primary' : 'bg-surface-variant'" class="rounded-lg px-4 py-2 max-w-sm">
                  {{ message.text }}
                </div>
              </div>
            </div>
            <div v-else class="flex-1 flex items-center justify-center text-center">
                <div>
                    <i class="fas fa-comments text-6xl text-on-surface-variant/30"></i>
                    <p class="mt-4 text-on-surface-variant">Select a conversation to start messaging</p>
                </div>
            </div>

            <!-- Message Input -->
            <div v-if="selectedConversation" class="p-4 bg-surface-variant/50 border-t border-outline">
              <div class="flex items-center">
                <input type="text" placeholder="Type a message..." class="w-full bg-surface rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <button class="ml-4 p-3 bg-primary text-on-primary rounded-full"><i class="fas fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const conversations = ref([
  {
    id: 1, name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe',
    lastMessage: 'Hey, how are you?', 
    messages: [
        {id: 1, text: 'Hi there!', sent: false},
        {id: 2, text: 'Hey, how are you?', sent: true},
    ]
  },
  {
    id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane%20Smith',
    lastMessage: 'I am interested in the property...', 
    messages: [
        {id: 1, text: 'I am interested in the property you listed.', sent: false}
    ]
  }
]);

const selectedConversation = ref(null);
</script>
