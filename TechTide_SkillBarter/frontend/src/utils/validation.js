import { VALIDATION_RULES } from './constants';

// Basic validation functions
export const validateEmail = (email) => {
  if (!email) return { isValid: false, message: 'Email is required' };
  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return { isValid: false, message: VALIDATION_RULES.EMAIL.MESSAGE };
  }
  return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return { isValid: false, message: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters` };
  }
  if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
    return { isValid: false, message: VALIDATION_RULES.PASSWORD.MESSAGE };
  }
  return { isValid: true, message: '' };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return { isValid: false, message: 'Please confirm your password' };
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  return { isValid: true, message: '' };
};

export const validateName = (name) => {
  if (!name) return { isValid: false, message: 'Name is required' };
  if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return { isValid: false, message: `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters` };
  }
  if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return { isValid: false, message: `Name must not exceed ${VALIDATION_RULES.NAME.MAX_LENGTH} characters` };
  }
  if (!VALIDATION_RULES.NAME.PATTERN.test(name)) {
    return { isValid: false, message: VALIDATION_RULES.NAME.MESSAGE };
  }
  return { isValid: true, message: '' };
};

export const validatePhone = (phone) => {
  if (!phone) return { isValid: false, message: 'Phone number is required' };
  if (!VALIDATION_RULES.PHONE.PATTERN.test(phone)) {
    return { isValid: false, message: VALIDATION_RULES.PHONE.MESSAGE };
  }
  return { isValid: true, message: '' };
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value) return { isValid: false, message: `${fieldName} is required` };
  if (value.length < minLength) {
    return { isValid: false, message: `${fieldName} must be at least ${minLength} characters` };
  }
  return { isValid: true, message: '' };
};

export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (!value) return { isValid: true, message: '' };
  if (value.length > maxLength) {
    return { isValid: false, message: `${fieldName} must not exceed ${maxLength} characters` };
  }
  return { isValid: true, message: '' };
};

export const validateNumber = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  if (isNaN(value) || isNaN(parseFloat(value))) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }
  return { isValid: true, message: '' };
};

export const validateMinValue = (value, minValue, fieldName = 'This field') => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }
  if (numValue < minValue) {
    return { isValid: false, message: `${fieldName} must be at least ${minValue}` };
  }
  return { isValid: true, message: '' };
};

export const validateMaxValue = (value, maxValue, fieldName = 'This field') => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }
  if (numValue > maxValue) {
    return { isValid: false, message: `${fieldName} must not exceed ${maxValue}` };
  }
  return { isValid: true, message: '' };
};

export const validateUrl = (url) => {
  if (!url) return { isValid: true, message: '' }; // URL is optional
  try {
    new URL(url);
    return { isValid: true, message: '' };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
};

export const validateDate = (date) => {
  if (!date) return { isValid: false, message: 'Date is required' };
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: 'Please enter a valid date' };
  }
  return { isValid: true, message: '' };
};

export const validateFutureDate = (date) => {
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) return dateValidation;
  
  const dateObj = new Date(date);
  const now = new Date();
  if (dateObj <= now) {
    return { isValid: false, message: 'Date must be in the future' };
  }
  return { isValid: true, message: '' };
};

export const validatePastDate = (date) => {
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) return dateValidation;
  
  const dateObj = new Date(date);
  const now = new Date();
  if (dateObj >= now) {
    return { isValid: false, message: 'Date must be in the past' };
  }
  return { isValid: true, message: '' };
};

// Skill-specific validation
export const validateSkillName = (name) => {
  if (!name) return { isValid: false, message: 'Skill name is required' };
  if (name.length < VALIDATION_RULES.SKILL_NAME.MIN_LENGTH) {
    return { isValid: false, message: `Skill name must be at least ${VALIDATION_RULES.SKILL_NAME.MIN_LENGTH} characters` };
  }
  if (name.length > VALIDATION_RULES.SKILL_NAME.MAX_LENGTH) {
    return { isValid: false, message: `Skill name must not exceed ${VALIDATION_RULES.SKILL_NAME.MAX_LENGTH} characters` };
  }
  return { isValid: true, message: '' };
};

export const validateSkillProficiency = (proficiency) => {
  const numberValidation = validateNumber(proficiency, 'Proficiency level');
  if (!numberValidation.isValid) return numberValidation;
  
  const minValidation = validateMinValue(proficiency, 0, 'Proficiency level');
  if (!minValidation.isValid) return minValidation;
  
  const maxValidation = validateMaxValue(proficiency, 100, 'Proficiency level');
  if (!maxValidation.isValid) return maxValidation;
  
  return { isValid: true, message: '' };
};

export const validateDescription = (description) => {
  if (!description) return { isValid: true, message: '' }; // Description is optional
  if (description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
    return { isValid: false, message: VALIDATION_RULES.DESCRIPTION.MESSAGE };
  }
  return { isValid: true, message: '' };
};

// Form validation schemas
export const loginSchema = {
  email: (value) => validateEmail(value),
  password: (value) => validateRequired(value, 'Password')
};

export const registerSchema = {
  name: (value) => validateName(value),
  email: (value) => validateEmail(value),
  password: (value) => validatePassword(value),
  confirmPassword: (value, formData) => validateConfirmPassword(formData.password, value),
  phone: (value) => validatePhone(value)
};

export const profileUpdateSchema = {
  name: (value) => validateName(value),
  email: (value) => validateEmail(value),
  phone: (value) => validatePhone(value),
  bio: (value) => validateMaxLength(value, 500, 'Bio'),
  location: (value) => validateMaxLength(value, 100, 'Location'),
  website: (value) => validateUrl(value)
};

export const skillSchema = {
  name: (value) => validateSkillName(value),
  category: (value) => validateRequired(value, 'Category'),
  proficiency: (value) => validateSkillProficiency(value),
  description: (value) => validateDescription(value)
};

export const passwordChangeSchema = {
  currentPassword: (value) => validateRequired(value, 'Current password'),
  newPassword: (value) => validatePassword(value),
  confirmPassword: (value, formData) => validateConfirmPassword(formData.newPassword, value)
};

export const communitySchema = {
  name: (value) => validateMinLength(value, 3, 'Community name'),
  description: (value) => validateMinLength(value, 10, 'Description'),
  category: (value) => validateRequired(value, 'Category')
};

export const messageSchema = {
  content: (value) => validateRequired(value, 'Message content')
};

// Validation helper functions
export const validateForm = (formData, schema) => {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach(field => {
    const validator = schema[field];
    const result = validator(formData[field], formData);
    
    if (!result.isValid) {
      errors[field] = result.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export const validateField = (fieldName, value, schema, formData = {}) => {
  const validator = schema[fieldName];
  if (!validator) return { isValid: true, message: '' };
  
  return validator(value, formData);
};

export const getFieldError = (fieldName, errors) => {
  return errors[fieldName] || '';
};

export const hasFieldError = (fieldName, errors) => {
  return !!errors[fieldName];
};

export const hasAnyErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

// Real-time validation helpers
export const createFieldValidator = (schema) => {
  return (fieldName, value, formData = {}) => {
    return validateField(fieldName, value, schema, formData);
  };
};

export const createFormValidator = (schema) => {
  return (formData) => {
    return validateForm(formData, schema);
  };
};

// Custom validation rules
export const createCustomValidator = (validatorFn, errorMessage) => {
  return (value) => {
    if (!value) return { isValid: true, message: '' }; // Allow empty values for optional fields
    return validatorFn(value) 
      ? { isValid: true, message: '' }
      : { isValid: false, message: errorMessage };
  };
};

export const createAsyncValidator = (validatorFn, errorMessage) => {
  return async (value) => {
    if (!value) return { isValid: true, message: '' };
    try {
      const result = await validatorFn(value);
      return result 
        ? { isValid: true, message: '' }
        : { isValid: false, message: errorMessage };
    } catch (error) {
      return { isValid: false, message: errorMessage };
    }
  };
};

// Validation composition
export const composeValidators = (...validators) => {
  return (value, formData = {}) => {
    for (const validator of validators) {
      const result = validator(value, formData);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true, message: '' };
  };
};

export const createConditionalValidator = (condition, validator) => {
  return (value, formData = {}) => {
    if (!condition(formData)) {
      return { isValid: true, message: '' };
    }
    return validator(value, formData);
  };
};

// File validation
export const validateFileSize = (file, maxSizeInMB = 5) => {
  if (!file) return { isValid: true, message: '' };
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return { isValid: false, message: `File size must not exceed ${maxSizeInMB}MB` };
  }
  return { isValid: true, message: '' };
};

export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  if (!file) return { isValid: true, message: '' };
  
  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1]).join(', ');
    return { isValid: false, message: `File type must be one of: ${allowedExtensions}` };
  }
  return { isValid: true, message: '' };
};

// Array validation
export const validateArrayMinLength = (array, minLength, fieldName = 'This field') => {
  if (!Array.isArray(array)) {
    return { isValid: false, message: `${fieldName} must be an array` };
  }
  if (array.length < minLength) {
    return { isValid: false, message: `${fieldName} must have at least ${minLength} items` };
  }
  return { isValid: true, message: '' };
};

export const validateArrayMaxLength = (array, maxLength, fieldName = 'This field') => {
  if (!Array.isArray(array)) {
    return { isValid: false, message: `${fieldName} must be an array` };
  }
  if (array.length > maxLength) {
    return { isValid: false, message: `${fieldName} must not exceed ${maxLength} items` };
  }
  return { isValid: true, message: '' };
};

// Object validation
export const validateObjectKeys = (obj, requiredKeys, fieldName = 'This field') => {
  if (!obj || typeof obj !== 'object') {
    return { isValid: false, message: `${fieldName} must be an object` };
  }
  
  const missingKeys = requiredKeys.filter(key => !(key in obj));
  if (missingKeys.length > 0) {
    return { isValid: false, message: `${fieldName} is missing required keys: ${missingKeys.join(', ')}` };
  }
  
  return { isValid: true, message: '' };
};

// Export all validation functions as default object
export default {
  // Basic validators
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
  validateMinValue,
  validateMaxValue,
  validateUrl,
  validateDate,
  validateFutureDate,
  validatePastDate,
  
  // Skill validators
  validateSkillName,
  validateSkillProficiency,
  validateDescription,
  
  // Form schemas
  loginSchema,
  registerSchema,
  profileUpdateSchema,
  skillSchema,
  passwordChangeSchema,
  communitySchema,
  messageSchema,
  
  // Validation helpers
  validateForm,
  validateField,
  getFieldError,
  hasFieldError,
  hasAnyErrors,
  createFieldValidator,
  createFormValidator,
  
  // Custom validators
  createCustomValidator,
  createAsyncValidator,
  composeValidators,
  createConditionalValidator,
  
  // File validators
  validateFileSize,
  validateFileType,
  
  // Array validators
  validateArrayMinLength,
  validateArrayMaxLength,
  
  // Object validators
  validateObjectKeys
};
