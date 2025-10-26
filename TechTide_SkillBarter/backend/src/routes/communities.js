const express = require('express');
const { body } = require('express-validator');
const {
  getCommunities,
  getCommunity,
  createCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunityMembers
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const communityValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Community name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .isIn([
      'Technology',
      'Languages',
      'Arts & Crafts',
      'Professional',
      'Life Skills',
      'Academic',
      'Regional',
      'Other'
    ])
    .withMessage('Invalid category'),
  body('language')
    .optional()
    .isIn(['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu'])
    .withMessage('Invalid language')
];

// Routes
router.get('/', getCommunities);
router.get('/:id', getCommunity);
router.get('/:id/members', getCommunityMembers);
router.post('/', protect, communityValidation, handleValidationErrors, createCommunity);
router.post('/:id/join', protect, joinCommunity);
router.post('/:id/leave', protect, leaveCommunity);

module.exports = router;