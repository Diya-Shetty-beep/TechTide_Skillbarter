const express = require('express');
const { body } = require('express-validator');
const {
  getSkills,
  getCategories,
  getPopularSkills,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const skillCreateValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Skill name must be between 2 and 50 characters'),
  body('category')
    .isIn([
      'Technology',
      'Languages',
      'Arts & Crafts',
      'Professional',
      'Life Skills',
      'Academic',
      'Sports & Fitness',
      'Culinary',
      'Music',
      'Other'
    ])
    .withMessage('Invalid category'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot be more than 200 characters')
];

// Public routes
router.get('/', getSkills);
router.get('/categories', getCategories);
router.get('/popular', getPopularSkills);

// Admin routes
router.post('/', protect, authorize('admin'), skillCreateValidation, handleValidationErrors, createSkill);
router.put('/:id', protect, authorize('admin'), skillCreateValidation, handleValidationErrors, updateSkill);
router.delete('/:id', protect, authorize('admin'), deleteSkill);

module.exports = router;