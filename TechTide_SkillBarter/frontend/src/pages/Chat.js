// src/services/chat.js
import api from '../services/api'; // use your axios instance or base api

const chatService = {
  // Get all chats for logged-in user
  getUserChats: async () => {
    const res = await api.get('/chats');
    return res.data;
  },

  // Get an existing chat or create new one
  getOrCreateChat: async (chatId) => {
    const res = await api.get(`/chats/${chatId}`);
    return res.data;
  },

  // Send a message
  sendMessage: async (chatId, messageData) => {
    const res = await api.post(`/chats/${chatId}/messages`, messageData);
    return res.data;
  }
};

export default chatService;
