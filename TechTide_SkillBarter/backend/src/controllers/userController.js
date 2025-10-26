const User = require('../models/User');
const { formatUserResponse } = require('../utils/helpers');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-email -phone -isVerified');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user skills
// @route   PUT /api/users/skills
// @access  Private
exports.updateSkills = async (req, res, next) => {
  try {
    const { skillsOffered, skillsWanted } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        skillsOffered,
        skillsWanted
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: {
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add skill to offered skills
// @route   POST /api/users/skills/offered
// @access  Private
exports.addOfferedSkill = async (req, res, next) => {
  try {
    const { skill, proficiency, description } = req.body;

    const user = await User.findById(req.user.id);
    user.skillsOffered.push({ skill, proficiency, description });
    await user.save();

    res.status(200).json({
      success: true,
      data: user.skillsOffered
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add skill to wanted skills
// @route   POST /api/users/skills/wanted
// @access  Private
exports.addWantedSkill = async (req, res, next) => {
  try {
    const { skill, priority } = req.body;

    const user = await User.findById(req.user.id);
    user.skillsWanted.push({ skill, priority });
    await user.save();

    res.status(200).json({
      success: true,
      data: user.skillsWanted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove skill from offered skills
// @route   DELETE /api/users/skills/offered/:skillId
// @access  Private
exports.removeOfferedSkill = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.skillsOffered = user.skillsOffered.filter(
      skill => skill._id.toString() !== req.params.skillId
    );
    await user.save();

    res.status(200).json({
      success: true,
      data: user.skillsOffered
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove skill from wanted skills
// @route   DELETE /api/users/skills/wanted/:skillId
// @access  Private
exports.removeWantedSkill = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.skillsWanted = user.skillsWanted.filter(
      skill => skill._id.toString() !== req.params.skillId
    );
    await user.save();

    res.status(200).json({
      success: true,
      data: user.skillsWanted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('badges')
      .select('-password');

    const dashboardData = {
      user: formatUserResponse(user),
      stats: {
        totalMatches: 0, // Would be calculated from matches
        completedSessions: 0,
        skillPoints: user.skillPoints,
        badgesCount: user.badges.length
      },
      recentActivity: [] // Would be populated from transactions
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users by skills or location
// @route   GET /api/users/search
// @access  Public
exports.searchUsers = async (req, res, next) => {
  try {
    const { skill, location, page = 1, limit = 10 } = req.query;

    let query = { isVerified: true };

    if (skill) {
      query.$or = [
        { 'skillsOffered.skill': new RegExp(skill, 'i') },
        { 'skillsWanted.skill': new RegExp(skill, 'i') }
      ];
    }

    if (location) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') }
      );
    }

    const users = await User.find(query)
      .select('name avatar skillsOffered skillsWanted location rating skillPoints')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ skillPoints: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
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