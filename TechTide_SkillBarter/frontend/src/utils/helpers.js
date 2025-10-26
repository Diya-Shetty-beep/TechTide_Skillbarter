import { 
  SKILL_LEVELS, 
  DATE_FORMATS, 
  RATING_SYSTEM,
  MATCHING_CONSTANTS,
  VALIDATION_RULES 
} from './constants';

// Date and Time Utilities
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  switch (format) {
    case DATE_FORMATS.DISPLAY:
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      });
    case DATE_FORMATS.DISPLAY_WITH_TIME:
      return d.toLocaleDateString('en-US', options);
    case DATE_FORMATS.TIME_ONLY:
      return d.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    case DATE_FORMATS.DATE_ONLY:
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit' 
      });
    default:
      return d.toLocaleDateString('en-US', options);
  }
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

export const isThisWeek = (date) => {
  if (!date) return false;
  const today = new Date();
  const checkDate = new Date(date);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return checkDate >= weekAgo && checkDate <= today;
};

// String Utilities
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(word => capitalizeFirst(word)).join(' ');
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Number Utilities
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

// Skill Utilities
export const getSkillLevel = (proficiency) => {
  const level = Object.values(SKILL_LEVELS).find(
    level => proficiency >= level.minValue && proficiency <= level.maxValue
  );
  return level || SKILL_LEVELS.BEGINNER;
};

export const getSkillLevelColor = (proficiency) => {
  return getSkillLevel(proficiency).color;
};

export const calculateSkillMatch = (userSkill, requiredSkill) => {
  if (!userSkill || !requiredSkill) return 0;
  
  const levelMatch = Math.abs(userSkill.proficiency - requiredSkill.proficiency) / 100;
  const categoryMatch = userSkill.category === requiredSkill.category ? 1 : 0;
  
  return Math.max(0, 1 - levelMatch + (categoryMatch * 0.2));
};

export const calculateOverallMatch = (userSkills, requiredSkills) => {
  if (!userSkills || !requiredSkills || requiredSkills.length === 0) return 0;
  
  let totalMatch = 0;
  let matchedSkills = 0;
  
  requiredSkills.forEach(requiredSkill => {
    const bestMatch = userSkills.reduce((best, userSkill) => {
      const match = calculateSkillMatch(userSkill, requiredSkill);
      return match > best.match ? { skill: userSkill, match } : best;
    }, { skill: null, match: 0 });
    
    if (bestMatch.match > 0.3) { // Minimum threshold for a match
      totalMatch += bestMatch.match;
      matchedSkills++;
    }
  });
  
  return matchedSkills > 0 ? totalMatch / requiredSkills.length : 0;
};

// Location Utilities
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const formatDistance = (distance) => {
  if (distance < 1) return `${Math.round(distance * 1000)}m`;
  return `${distance.toFixed(1)}km`;
};

// Rating Utilities
export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
  return sum / ratings.length;
};

export const formatRating = (rating, decimals = 1) => {
  if (rating === null || rating === undefined) return '0.0';
  return Number(rating).toFixed(decimals);
};

export const getRatingColor = (rating) => {
  if (rating >= 4.5) return '#10B981'; // Green
  if (rating >= 3.5) return '#F59E0B'; // Yellow
  if (rating >= 2.5) return '#EF4444'; // Red
  return '#6B7280'; // Gray
};

// Array Utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Object Utilities
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

export const pick = (obj, keys) => {
  const result = {};
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

// URL Utilities
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const parseQueryString = (queryString) => {
  const params = {};
  const searchParams = new URLSearchParams(queryString);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};

// Local Storage Utilities
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Debounce Utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle Utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// File Utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
};

// Color Utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const getContrastColor = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

// Validation Utilities
export const isValidEmail = (email) => {
  return VALIDATION_RULES.EMAIL.PATTERN.test(email);
};

export const isValidPhone = (phone) => {
  return VALIDATION_RULES.PHONE.PATTERN.test(phone);
};

export const isValidPassword = (password) => {
  return password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH &&
         VALIDATION_RULES.PASSWORD.PATTERN.test(password);
};

// Error Handling Utilities
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isServerError = (error) => {
  return error.response?.status >= 500;
};

export const isClientError = (error) => {
  return error.response?.status >= 400 && error.response?.status < 500;
};

// Search Utilities
export const searchItems = (items, query, searchFields) => {
  if (!query || !items || items.length === 0) return items;
  
  const lowercaseQuery = query.toLowerCase();
  
  return items.filter(item => {
    return searchFields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(lowercaseQuery);
    });
  });
};

export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Export all utilities as default object for convenience
export default {
  // Date utilities
  formatDate,
  getRelativeTime,
  isToday,
  isThisWeek,
  
  // String utilities
  capitalizeFirst,
  capitalizeWords,
  truncateText,
  slugify,
  generateInitials,
  
  // Number utilities
  formatNumber,
  formatCurrency,
  formatPercentage,
  
  // Skill utilities
  getSkillLevel,
  getSkillLevelColor,
  calculateSkillMatch,
  calculateOverallMatch,
  
  // Location utilities
  calculateDistance,
  formatDistance,
  
  // Rating utilities
  calculateAverageRating,
  formatRating,
  getRatingColor,
  
  // Array utilities
  groupBy,
  sortBy,
  uniqueBy,
  chunk,
  
  // Object utilities
  deepClone,
  isEmpty,
  pick,
  omit,
  
  // URL utilities
  buildQueryString,
  parseQueryString,
  
  // Storage utilities
  getFromStorage,
  setToStorage,
  removeFromStorage,
  
  // Function utilities
  debounce,
  throttle,
  
  // File utilities
  formatFileSize,
  getFileExtension,
  isImageFile,
  
  // Color utilities
  hexToRgb,
  rgbToHex,
  getContrastColor,
  
  // Validation utilities
  isValidEmail,
  isValidPhone,
  isValidPassword,
  
  // Error utilities
  getErrorMessage,
  isNetworkError,
  isServerError,
  isClientError,
  
  // Search utilities
  searchItems,
  getNestedValue
};
