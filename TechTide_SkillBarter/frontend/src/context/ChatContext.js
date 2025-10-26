import React, { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { chatService } from '../services/chat';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
        auth: {
          token: token
        }
      });

      newSocket.emit('join-user', user.id);

      newSocket.on('receive-message', (data) => {
        setMessages(prev => [...prev, data.message]);
        
        // Update chats list with latest message
        setChats(prev => prev.map(chat => 
          chat._id === data.chatId 
            ? { ...chat, lastMessage: data.message }
            : chat
        ));
      });

      newSocket.on('user-typing', (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.userId]: data.userName
        }));
      });

      newSocket.on('user-stop-typing', (data) => {
        setTypingUsers(prev => {
          const updated = { ...prev };
          delete updated[data.userId];
          return updated;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, token]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const chatsData = await chatService.getUserChats();
      setChats(chatsData);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      setLoading(true);
      const chatData = await chatService.getChat(chatId);
      setActiveChat(chatData.chat);
      setMessages(chatData.messages);
      
      if (socket) {
        socket.emit('join-chat', chatId);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (chatId, content, messageType = 'text') => {
    try {
      const messageData = {
        content,
        messageType,
        chatId
      };

      if (socket) {
        socket.emit('send-message', messageData);
      }

      const newMessage = await chatService.sendMessage(chatId, { content, messageType });
      setMessages(prev => [...prev, newMessage]);
      
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const startTyping = (chatId) => {
    if (socket) {
      socket.emit('typing-start', {
        chatId,
        userId: user.id,
        userName: user.name
      });
    }
  };

  const stopTyping = (chatId) => {
    if (socket) {
      socket.emit('typing-stop', {
        chatId,
        userId: user.id
      });
    }
  };

  const markAsRead = async (chatId) => {
    try {
      await chatService.markAsRead(chatId);
      
      // Update local state
      setMessages(prev => prev.map(msg => ({
        ...msg,
        readBy: [...(msg.readBy || []), { user: user.id }]
      })));
      
      setChats(prev => prev.map(chat => 
        chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const createOrGetChat = async (matchId) => {
    try {
      const chatData = await chatService.getOrCreateChat(matchId);
      return chatData;
    } catch (error) {
      console.error('Error creating/getting chat:', error);
      throw error;
    }
  };

  const value = {
    socket,
    chats,
    activeChat,
    messages,
    typingUsers,
    loading,
    loadChats,
    loadChat,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    createOrGetChat,
    setActiveChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};