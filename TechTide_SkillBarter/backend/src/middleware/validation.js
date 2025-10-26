const { validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Custom validators
const validateSkillExchange = (req, res, next) => {
  const { skillsOffered, skillsWanted } = req.body;
  
  if (!skillsOffered || skillsOffered.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one skill to offer is required'
    });
  }
  
  if (!skillsWanted || skillsWanted.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one skill to learn is required'
    });
  }
  
  next();
};

module.exports = { handleValidationErrors, validateSkillExchange };