const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = new RegExp(search, 'i');
    }

    const skills = await Skill.find(query)
      .sort({ popularity: -1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Skill.countDocuments(query);

    res.status(200).json({
      success: true,
      data: skills,
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

// @desc    Get skill categories
// @route   GET /api/skills/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = [
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
    ];

    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Skill.countDocuments({ 
          category, 
          isActive: true 
        });
        return {
          name: category,
          count,
          icon: getCategoryIcon(category)
        };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular skills
// @route   GET /api/skills/popular
// @access  Public
exports.getPopularSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill (Admin only)
// @route   POST /api/skills
// @access  Private/Admin
exports.createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
exports.updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    await skill.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get category icons
function getCategoryIcon(category) {
  const icons = {
    'Technology': '💻',
    'Languages': '🗣️',
    'Arts & Crafts': '🎨',
    'Professional': '💼',
    'Life Skills': '🏠',
    'Academic': '📚',
    'Sports & Fitness': '⚽',
    'Culinary': '👨‍🍳',
    'Music': '🎵',
    'Other': '🔧'
  };
  return icons[category] || '🔧';
}