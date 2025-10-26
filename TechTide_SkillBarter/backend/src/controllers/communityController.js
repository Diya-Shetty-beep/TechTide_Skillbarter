const Community = require('../models/Community');
const User = require('../models/User');

// @desc    Get all communities
// @route   GET /api/communities
// @access  Public
exports.getCommunities = async (req, res, next) => {
  try {
    const { category, location, search, page = 1, limit = 10 } = req.query;

    let query = { isActive: true, isPublic: true };

    if (category) {
      query.category = category;
    }

    if (location) {
      query.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') }
      ];
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const communities = await Community.find(query)
      .populate('admin', 'name avatar')
      .populate('moderators', 'name avatar')
      .sort({ memberCount: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Community.countDocuments(query);

    res.status(200).json({
      success: true,
      data: communities,
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

// @desc    Get single community
// @route   GET /api/communities/:id
// @access  Public
exports.getCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('admin', 'name avatar')
      .populate('moderators', 'name avatar')
      .populate('members.user', 'name avatar skillsOffered skillsWanted rating');

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.status(200).json({
      success: true,
      data: community
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create community
// @route   POST /api/communities
// @access  Private
exports.createCommunity = async (req, res, next) => {
  try {
    const { name, description, category, location, language, skills, isPublic } = req.body;

    const community = await Community.create({
      name,
      description,
      category,
      location,
      language,
      skills,
      isPublic,
      admin: req.user.id,
      moderators: [req.user.id],
      members: [{
        user: req.user.id,
        role: 'moderator'
      }],
      memberCount: 1
    });

    await community.populate('admin', 'name avatar');

    res.status(201).json({
      success: true,
      data: community
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join community
// @route   POST /api/communities/:id/join
// @access  Private
exports.joinCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is already a member
    const isMember = community.members.some(
      member => member.user.toString() === req.user.id
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this community'
      });
    }

    community.members.push({
      user: req.user.id,
      role: 'member'
    });
    community.memberCount += 1;

    await community.save();

    res.status(200).json({
      success: true,
      data: { joined: true, memberCount: community.memberCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave community
// @route   POST /api/communities/:id/leave
// @access  Private
exports.leaveCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is a member
    const memberIndex = community.members.findIndex(
      member => member.user.toString() === req.user.id
    );

    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this community'
      });
    }

    // Remove from members array
    community.members.splice(memberIndex, 1);
    community.memberCount -= 1;

    // Remove from moderators if they were one
    const modIndex = community.moderators.indexOf(req.user.id);
    if (modIndex > -1) {
      community.moderators.splice(modIndex, 1);
    }

    await community.save();

    res.status(200).json({
      success: true,
      data: { left: true, memberCount: community.memberCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get community members
// @route   GET /api/communities/:id/members
// @access  Public
exports.getCommunityMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const community = await Community.findById(req.params.id)
      .populate({
        path: 'members.user',
        select: 'name avatar skillsOffered skillsWanted rating skillPoints',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit
        }
      });

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.status(200).json({
      success: true,
      data: community.members,
      pagination: {
        page,
        limit,
        total: community.memberCount,
        pages: Math.ceil(community.memberCount / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};