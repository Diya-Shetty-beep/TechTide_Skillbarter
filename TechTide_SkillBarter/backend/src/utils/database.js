const mongoose = require('mongoose');

// Sample skills data for seeding
const sampleSkills = [
  { name: 'JavaScript', category: 'Technology' },
  { name: 'Python', category: 'Technology' },
  { name: 'Graphic Design', category: 'Arts & Crafts' },
  { name: 'Cooking', category: 'Culinary' },
  { name: 'Yoga', category: 'Sports & Fitness' },
  { name: 'English Speaking', category: 'Languages' },
  { name: 'Hindi Speaking', category: 'Languages' },
  { name: 'Tailoring', category: 'Arts & Crafts' },
  { name: 'Photography', category: 'Arts & Crafts' },
  { name: 'Digital Marketing', category: 'Professional' },
  { name: 'Financial Planning', category: 'Life Skills' },
  { name: 'Gardening', category: 'Life Skills' },
  { name: 'Carpentry', category: 'Arts & Crafts' },
  { name: 'Mobile Repair', category: 'Technology' },
  { name: 'Public Speaking', category: 'Professional' }
];

// Seed database with sample skills
const seedSkills = async (Skill) => {
  try {
    const count = await Skill.countDocuments();
    if (count === 0) {
      await Skill.insertMany(sampleSkills);
      console.log('Sample skills seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding skills:', error);
  }
};

module.exports = { seedSkills };