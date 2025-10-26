const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillExchange: {
    user1Skill: {
      skill: String,
      proficiency: String
    },
    user2Skill: {
      skill: String,
      proficiency: String
    }
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessions: [{
    date: Date,
    duration: Number, // in minutes
    topic: String,
    notes: String,
    user1Rating: {
      type: Number,
      min: 1,
      max: 5
    },
    user2Rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  totalSessions: {
    type: Number,
    default: 0
  },
  completedAt: Date
}, {
  timestamps: true
});

// Ensure unique match between users for the same skill exchange
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);