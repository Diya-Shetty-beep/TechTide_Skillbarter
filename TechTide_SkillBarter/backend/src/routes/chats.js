const express = require('express');
const { body } = require('express-validator');
const {
  getOrCreateChat,
  sendMessage,
  markAsRead,
  getUserChats
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const messageValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'file', 'system'])
    .withMessage('Invalid message type')
];

// Routes
router.get('/', protect, getUserChats);
router.get('/match/:matchId', protect, getOrCreateChat);
router.post('/:chatId/messages', protect, messageValidation, handleValidationErrors, sendMessage);
router.put('/:chatId/messages/read', protect, markAsRead);

module.exports = router;