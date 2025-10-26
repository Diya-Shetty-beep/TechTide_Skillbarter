// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      GET_CURRENT_USER: '/auth/me',
      UPDATE_PROFILE: '/auth/profile',
      UPDATE_PASSWORD: '/auth/password'
    },
    USERS: {
      GET_ALL: '/users',
      GET_BY_ID: '/users',
      UPDATE: '/users',
      DELETE: '/users',
      SEARCH: '/users/search',
      GET_SKILLS: '/users/skills',
      ADD_SKILL: '/users/skills',
      REMOVE_SKILL: '/users/skills'
    },
    SKILLS: {
      GET_ALL: '/skills',
      GET_BY_ID: '/skills',
      CREATE: '/skills',
      UPDATE: '/skills',
      DELETE: '/skills',
      SEARCH: '/skills/search',
      GET_CATEGORIES: '/skills/categories'
    },
    MATCHES: {
      GET_ALL: '/matches',
      GET_BY_ID: '/matches',
      CREATE: '/matches',
      UPDATE: '/matches',
      DELETE: '/matches',
      GET_POTENTIAL: '/matches/potential',
      ACCEPT: '/matches/accept',
      REJECT: '/matches/reject',
      COMPLETE: '/matches/complete'
    },
    CHAT: {
      GET_CONVERSATIONS: '/chats',
      GET_MESSAGES: '/chats/messages',
      SEND_MESSAGE: '/chats/messages',
      MARK_READ: '/chats/mark-read',
      GET_UNREAD_COUNT: '/chats/unread-count'
    },
    COMMUNITIES: {
      GET_ALL: '/communities',
      GET_BY_ID: '/communities',
      CREATE: '/communities',
      UPDATE: '/communities',
      DELETE: '/communities',
      JOIN: '/communities/join',
      LEAVE: '/communities/leave',
      GET_MEMBERS: '/communities/members'
    },
    TRANSACTIONS: {
      GET_ALL: '/transactions',
      GET_BY_ID: '/transactions',
      CREATE: '/transactions',
      UPDATE: '/transactions',
      COMPLETE: '/transactions/complete',
      RATE: '/transactions/rate'
    }
  }
};

// Skill Categories
export const SKILL_CATEGORIES = {
  TECHNOLOGY: {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    subcategories: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'DevOps',
      'Cybersecurity',
      'Cloud Computing',
      'Database Management',
      'UI/UX Design',
      'Game Development'
    ]
  },
  LANGUAGES: {
    id: 'languages',
    name: 'Languages',
    icon: '🗣️',
    subcategories: [
      'English',
      'Hindi',
      'Spanish',
      'French',
      'German',
      'Japanese',
      'Chinese',
      'Arabic',
      'Portuguese',
      'Russian'
    ]
  },
  CREATIVE: {
    id: 'creative',
    name: 'Creative Arts',
    icon: '🎨',
    subcategories: [
      'Photography',
      'Videography',
      'Graphic Design',
      'Music Production',
      'Writing',
      'Drawing',
      'Painting',
      'Sculpting',
      'Crafting',
      'Interior Design'
    ]
  },
  BUSINESS: {
    id: 'business',
    name: 'Business & Finance',
    icon: '💼',
    subcategories: [
      'Marketing',
      'Sales',
      'Accounting',
      'Project Management',
      'Business Strategy',
      'Financial Planning',
      'Digital Marketing',
      'Content Creation',
      'Social Media Management',
      'E-commerce'
    ]
  },
  LIFESTYLE: {
    id: 'lifestyle',
    name: 'Lifestyle & Wellness',
    icon: '🧘',
    subcategories: [
      'Fitness Training',
      'Yoga',
      'Meditation',
      'Cooking',
      'Nutrition',
      'Mental Health',
      'Life Coaching',
      'Personal Training',
      'Wellness Coaching',
      'Stress Management'
    ]
  },
  ACADEMIC: {
    id: 'academic',
    name: 'Academic & Education',
    icon: '📚',
    subcategories: [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'History',
      'Literature',
      'Philosophy',
      'Psychology',
      'Economics',
      'Political Science'
    ]
  },
  TRADES: {
    id: 'trades',
    name: 'Trades & Crafts',
    icon: '🔧',
    subcategories: [
      'Plumbing',
      'Electrical Work',
      'Carpentry',
      'Welding',
      'Automotive Repair',
      'HVAC',
      'Landscaping',
      'Gardening',
      'Home Improvement',
      'Appliance Repair'
    ]
  }
};

// Skill Proficiency Levels
export const SKILL_LEVELS = {
  BEGINNER: {
    id: 'beginner',
    name: 'Beginner',
    description: 'Basic understanding, can follow instructions',
    color: '#10B981',
    minValue: 0,
    maxValue: 25
  },
  INTERMEDIATE: {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Good understanding, can work independently',
    color: '#F59E0B',
    minValue: 26,
    maxValue: 50
  },
  ADVANCED: {
    id: 'advanced',
    name: 'Advanced',
    description: 'Strong skills, can teach others',
    color: '#EF4444',
    minValue: 51,
    maxValue: 75
  },
  EXPERT: {
    id: 'expert',
    name: 'Expert',
    description: 'Master level, industry professional',
    color: '#8B5CF6',
    minValue: 76,
    maxValue: 100
  }
};

// Match Status
export const MATCH_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  MATCH_FOUND: 'match_found',
  MESSAGE_RECEIVED: 'message_received',
  SKILL_ADDED: 'skill_added',
  TRANSACTION_COMPLETED: 'transaction_completed',
  COMMUNITY_JOINED: 'community_joined',
  PROFILE_UPDATED: 'profile_updated'
};

// UI Constants
export const UI_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50
  },
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 4000,
  MODAL_ANIMATION_DURATION: 200,
  LOADING_TIMEOUT: 10000
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address'
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s]+$/,
    MESSAGE: 'Name must be 2-50 characters and contain only letters and spaces'
  },
  PHONE: {
    PATTERN: /^[6-9]\d{9}$/,
    MESSAGE: 'Please enter a valid 10-digit Indian mobile number'
  },
  SKILL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    MESSAGE: 'Skill name must be 2-100 characters'
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
    MESSAGE: 'Description must not exceed 500 characters'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS: 'notifications',
  CHAT_HISTORY: 'chat_history'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_UPDATED: 'Password updated successfully!',
  SKILL_ADDED: 'Skill added successfully!',
  SKILL_REMOVED: 'Skill removed successfully!',
  MATCH_ACCEPTED: 'Match accepted successfully!',
  MATCH_REJECTED: 'Match rejected',
  MESSAGE_SENT: 'Message sent successfully!',
  TRANSACTION_COMPLETED: 'Transaction completed successfully!'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY h:mm A',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  TIME_ONLY: 'h:mm A',
  DATE_ONLY: 'MMM DD'
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

// Rating System
export const RATING_SYSTEM = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  DEFAULT_RATING: 0
};

// Chat Constants
export const CHAT_CONSTANTS = {
  MESSAGE_TYPES: {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    SYSTEM: 'system'
  },
  TYPING_INDICATOR_TIMEOUT: 3000,
  MESSAGE_LIMIT: 50,
  MAX_MESSAGE_LENGTH: 1000
};

// Matching Algorithm Constants
export const MATCHING_CONSTANTS = {
  SKILL_WEIGHT: 0.4,
  LOCATION_WEIGHT: 0.3,
  EXPERIENCE_WEIGHT: 0.2,
  RATING_WEIGHT: 0.1,
  MIN_MATCH_SCORE: 0.6,
  MAX_DISTANCE_KM: 50
};

// Community Constants
export const COMMUNITY_CONSTANTS = {
  MAX_MEMBERS: 1000,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NAME_LENGTH: 50
};

// Export all categories as an array for easy iteration
export const ALL_SKILL_CATEGORIES = Object.values(SKILL_CATEGORIES);

// Export all skill levels as an array
export const ALL_SKILL_LEVELS = Object.values(SKILL_LEVELS);
