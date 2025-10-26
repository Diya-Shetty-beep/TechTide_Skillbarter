const Match = require('../models/Match');
const User = require('../models/User');
const matchingAlgorithm = require('../utils/matchingAlgorithm');
const NotificationService = require('../utils/notifications');

// @desc    Get potential matches for user
// @route   GET /api/matches/potential
// @access  Private
exports.getPotentialMatches = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const potentialMatches = await matchingAlgorithm.findPotentialMatches(
      req.user.id,
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: potentialMatches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create match request
// @route   POST /api/matches
// @access  Private
exports.createMatch = async (req, res, next) => {
  try {
    const { targetUserId, user1Skill, user2Skill } = req.body;

    // Check if users exist
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }

    // Check if match already exists
    const existingMatch = await Match.findOne({
      $or: [
        { user1: req.user.id, user2: targetUserId },
        { user1: targetUserId, user2: req.user.id }
      ]
    });

    if (existingMatch) {
      return res.status(400).json({
        success: false,
        message: 'Match already exists'
      });
    }

    // Calculate match score
    const currentUser = await User.findById(req.user.id);
    const matchScore = matchingAlgorithm.calculateMatchScore(currentUser, targetUser);

    // Create match
    const match = await Match.create({
      user1: req.user.id,
      user2: targetUserId,
      skillExchange: {
        user1Skill,
        user2Skill
      },
      matchScore,
      initiatedBy: req.user.id,
      status: 'pending'
    });

    // Send notification
    await NotificationService.sendMatchNotification(match, req.user);

    // Populate user data for response
    await match.populate('user1', 'name avatar');
    await match.populate('user2', 'name avatar');

    res.status(201).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's matches
// @route   GET /api/matches
// @access  Private
exports.getUserMatches = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {
      $or: [
        { user1: req.user.id },
        { user2: req.user.id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const matches = await Match.find(query)
      .populate('user1', 'name avatar rating')
      .populate('user2', 'name avatar rating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments(query);

    res.status(200).json({
      success: true,
      data: matches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update match status
// @route   PUT /api/matches/:id/status
// @access  Private
exports.updateMatchStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const matchId = req.params.id;

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1: req.user.id },
        { user2: req.user.id }
      ]
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Only the recipient can accept/reject a pending match
    if (match.status === 'pending' && match.initiatedBy.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot accept/reject your own match request'
      });
    }

    match.status = status;
    
    if (status === 'accepted') {
      match.acceptedAt = new Date();
    } else if (status === 'completed') {
      match.completedAt = new Date();
    }

    await match.save();

    // Populate user data for response
    await match.populate('user1', 'name avatar');
    await match.populate('user2', 'name avatar');

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add session to match
// @route   POST /api/matches/:id/sessions
// @access  Private
exports.addSession = async (req, res, next) => {
  try {
    const { date, duration, topic, notes } = req.body;
    const matchId = req.params.id;

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1: req.user.id },
        { user2: req.user.id }
      ],
      status: 'accepted'
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found or not accepted'
      });
    }

    match.sessions.push({
      date,
      duration,
      topic,
      notes
    });

    match.totalSessions = match.sessions.length;
    await match.save();

    res.status(200).json({
      success: true,
      data: match.sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate session
// @route   PUT /api/matches/:matchId/sessions/:sessionId/rate
// @access  Private
exports.rateSession = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const { matchId, sessionId } = req.params;

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1: req.user.id },
        { user2: req.user.id }
      ]
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const session = match.sessions.id(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Determine which user is rating
    if (match.user1.toString() === req.user.id) {
      session.user1Rating = rating;
    } else {
      session.user2Rating = rating;
    }

    await match.save();

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};