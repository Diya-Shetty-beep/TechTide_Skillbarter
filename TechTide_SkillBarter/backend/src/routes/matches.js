const express = require('express');
const { body } = require('express-validator');
const {
  getPotentialMatches,
  createMatch,
  getUserMatches,
  updateMatchStatus,
  addSession,
  rateSession
} = require('../controllers/matchController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const createMatchValidation = [
  body('targetUserId')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('user1Skill.skill')
    .trim()
    .notEmpty()
    .withMessage('Skill is required'),
  body('user2Skill.skill')
    .trim()
    .notEmpty()
    .withMessage('Skill is required')
];

const sessionValidation = [
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('duration')
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  body('topic')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Topic must be between 2 and 100 characters')
];

const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

// Routes
router.get('/potential', protect, getPotentialMatches);
router.get('/', protect, getUserMatches);
router.post('/', protect, createMatchValidation, handleValidationErrors, createMatch);
router.put('/:id/status', protect, updateMatchStatus);
router.post('/:id/sessions', protect, sessionValidation, handleValidationErrors, addSession);
router.put('/:matchId/sessions/:sessionId/rate', protect, ratingValidation, handleValidationErrors, rateSession);

module.exports = router;