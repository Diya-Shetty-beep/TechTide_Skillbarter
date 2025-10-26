const express = require('express');
const { body } = require('express-validator');
const {
  getUser,
  updateSkills,
  addOfferedSkill,
  addWantedSkill,
  removeOfferedSkill,
  removeWantedSkill,
  getDashboard,
  searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors, validateSkillExchange } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const skillValidation = [
  body('skill')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Skill must be between 2 and 50 characters'),
  body('proficiency')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Invalid proficiency level'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority level')
];

// Routes
router.get('/search', searchUsers);
router.get('/:id', getUser);
router.get('/dashboard/data', protect, getDashboard);

// Skill management routes
router.put('/skills', protect, validateSkillExchange, updateSkills);
router.post('/skills/offered', protect, skillValidation, handleValidationErrors, addOfferedSkill);
router.post('/skills/wanted', protect, skillValidation, handleValidationErrors, addWantedSkill);
router.delete('/skills/offered/:skillId', protect, removeOfferedSkill);
router.delete('/skills/wanted/:skillId', protect, removeWantedSkill);

module.exports = router;