import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Send, 
  Search, 
  Users, 
  Video, 
  Phone, 
  MoreVertical,
  Paperclip,
  Smile,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chat.js';

import { matchesService } from '../services/matches';
import { socketService } from '../services/socket';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
    initializeSocket();
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchChat(chatId);
    } else if (chats.length > 0) {
      setActiveChat(chats[0]);
      fetchChat(chats[0]._id);
    }
  }, [chatId, chats]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    socketService.connect();
    
    socketService.on('receive-message', (data) => {
      if (data.chatId === activeChat?._id) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    socketService.on('user-typing', (data) => {
      // Handle typing indicators
      console.log(`${data.userName} is typing...`);
    });

    socketService.on('user-stop-typing', (data) => {
      // Handle stop typing
    });
  };

  const fetchChats = async () => {
    try {
      const chatsData = await chatService.getUserChats();
      setChats(chatsData);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchChat = async (id) => {
    try {
      const chatData = await chatService.getOrCreateChat(id);
      setActiveChat(chatData.chat);
      setMessages(chatData.messages || []);
      
      // Join chat room for real-time updates
      socketService.emit('join-chat', id);
    } catch (error) {
      console.error('Error fetching chat:', error);
      toast.error('Failed to load chat');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    setSending(true);
    try {
      const messageData = {
        content: newMessage.trim(),
        messageType: 'text'
      };

      // Send to API for persistence
      await chatService.sendMessage(activeChat._id, messageData);

      // Optimistically add message to UI
      const tempMessage = {
        _id: Date.now().toString(),
        sender: { _id: user.id, name: user.name, avatar: user.avatar },
        content: newMessage.trim(),
        messageType: 'text',
        createdAt: new Date().toISOString(),
        readBy: [{ user: user.id }]
      };

      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      // Send via socket for real-time
      socketService.emit('send-message', {
        chatId: activeChat._id,
        message: tempMessage
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (activeChat) {
      socketService.emit('typing-start', {
        chatId: activeChat._id,
        userId: user.id,
        userName: user.name
      });
    }
  };

  const handleStopTyping = () => {
    if (activeChat) {
      socketService.emit('typing-stop', {
        chatId: activeChat._id,
        userId: user.id
      });
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.participants.find(p => p._id !== user.id);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">
          Connect with your skill exchange partners and schedule learning sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Chats List */}
        <div className="lg:col-span-1 card overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 pr-4 w-full"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[500px]">
            {filteredChats.length > 0 ? (
              filteredChats.map(chat => {
                const otherUser = chat.participants.find(p => p._id !== user.id);
                const lastMessage = chat.lastMessage;
                
                return (
                  <Link
                    key={chat._id}
                    to={`/chat/${chat._id}`}
                    className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                      activeChat?._id === chat._id ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {otherUser?.name?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-gray-900 truncate">
                          {otherUser?.name || 'Unknown User'}
                        </div>
                        {lastMessage && (
                          <div className="text-xs text-gray-500">
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage?.content || 'No messages yet'}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3 card overflow-hidden">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {activeChat.participants.find(p => p._id !== user.id)?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {activeChat.participants.find(p => p._id !== user.id)?.name || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px] bg-gray-50">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <Message
                      key={message._id}
                      message={message}
                      isOwn={message.sender._id === user.id}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No messages yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Start a conversation by sending a message!
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={sendMessage} className="flex space-x-3">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onBlur={handleStopTyping}
                      placeholder="Type a message..."
                      className="form-input pr-12"
                      disabled={sending}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="btn btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <div className="spinner w-4 h-4"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No chat selected
                </h3>
                <p className="text-gray-600">
                  Select a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Message Component
const Message = ({ message, isOwn }) => {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isOwn 
          ? 'bg-orange-500 text-white rounded-br-none' 
          : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
      }`}>
        <div className="text-sm">{message.content}</div>
        <div className={`text-xs mt-1 ${
          isOwn ? 'text-orange-100' : 'text-gray-500'
        }`}>
          {time}
        </div>
      </div>
    </div>
  );
};

export default Chat;