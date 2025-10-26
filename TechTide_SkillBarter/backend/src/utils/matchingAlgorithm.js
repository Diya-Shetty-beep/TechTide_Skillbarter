const Match = require('../models/Match');
const User = require('../models/User');

class MatchingAlgorithm {
  constructor() {
    this.weights = {
      skillMatch: 0.4,
      location: 0.2,
      proficiency: 0.2,
      availability: 0.1,
      rating: 0.1
    };
  }

  // Calculate match score between two users
  calculateMatchScore(user1, user2) {
    let score = 0;
    
    // Skill matching (40%)
    const skillMatchScore = this.calculateSkillMatch(user1, user2);
    score += skillMatchScore * this.weights.skillMatch;
    
    // Location proximity (20%)
    const locationScore = this.calculateLocationScore(user1, user2);
    score += locationScore * this.weights.location;
    
    // Proficiency compatibility (20%)
    const proficiencyScore = this.calculateProficiencyScore(user1, user2);
    score += proficiencyScore * this.weights.proficiency;
    
    // Rating compatibility (10%)
    const ratingScore = this.calculateRatingScore(user1, user2);
    score += ratingScore * this.weights.rating;
    
    // Availability match (10%)
    const availabilityScore = this.calculateAvailabilityScore(user1, user2);
    score += availabilityScore * this.weights.availability;
    
    return Math.round(score * 100);
  }

  calculateSkillMatch(user1, user2) {
    let matchCount = 0;
    const totalPossible = Math.min(user1.skillsOffered.length, user2.skillsWanted.length) +
                         Math.min(user1.skillsWanted.length, user2.skillsOffered.length);

    if (totalPossible === 0) return 0;

    // Check if user1's offered skills match user2's wanted skills
    user1.skillsOffered.forEach(offered => {
      const match = user2.skillsWanted.find(wanted => 
        wanted.skill.toLowerCase() === offered.skill.toLowerCase()
      );
      if (match) matchCount++;
    });

    // Check if user1's wanted skills match user2's offered skills
    user1.skillsWanted.forEach(wanted => {
      const match = user2.skillsOffered.find(offered => 
        offered.skill.toLowerCase() === wanted.skill.toLowerCase()
      );
      if (match) matchCount++;
    });

    return matchCount / totalPossible;
  }

  calculateLocationScore(user1, user2) {
    if (!user1.location || !user2.location) return 0.5;
    
    if (user1.location.city === user2.location.city) return 1.0;
    if (user1.location.state === user2.location.state) return 0.7;
    
    return 0.3;
  }

  calculateProficiencyScore(user1, user2) {
    // Simple implementation - can be enhanced
    return 0.8; // Placeholder
  }

  calculateRatingScore(user1, user2) {
    const avgRating = (user1.rating.average + user2.rating.average) / 2;
    return avgRating / 5; // Normalize to 0-1
  }

  calculateAvailabilityScore(user1, user2) {
    // Simple implementation based on last active
    const daysSinceActive1 = (new Date() - user1.lastActive) / (1000 * 60 * 60 * 24);
    const daysSinceActive2 = (new Date() - user2.lastActive) / (1000 * 60 * 60 * 24);
    
    const avgDays = (daysSinceActive1 + daysSinceActive2) / 2;
    
    if (avgDays <= 1) return 1.0;
    if (avgDays <= 3) return 0.8;
    if (avgDays <= 7) return 0.5;
    return 0.2;
  }

  // Find potential matches for a user
  async findPotentialMatches(userId, limit = 10) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Find users who have skills this user wants and want skills this user has
      const potentialUsers = await User.find({
        _id: { $ne: userId },
        $or: [
          { 
            'skillsOffered.skill': { 
              $in: user.skillsWanted.map(s => s.skill) 
            } 
          },
          { 
            'skillsWanted.skill': { 
              $in: user.skillsOffered.map(s => s.skill) 
            } 
          }
        ]
      }).limit(50);

      // Calculate match scores and sort
      const matchesWithScores = potentialUsers.map(potentialUser => {
        const score = this.calculateMatchScore(user, potentialUser);
        return {
          user: potentialUser,
          score,
          exchange: this.findBestExchange(user, potentialUser)
        };
      });

      // Sort by score descending and return top matches
      return matchesWithScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      throw error;
    }
  }

  findBestExchange(user1, user2) {
    const exchanges = [];
    
    // Find skills user1 can teach that user2 wants to learn
    user1.skillsOffered.forEach(offered => {
      const wanted = user2.skillsWanted.find(w => 
        w.skill.toLowerCase() === offered.skill.toLowerCase()
      );
      if (wanted) {
        exchanges.push({
          fromUser: user1._id,
          toUser: user2._id,
          skill: offered.skill,
          proficiency: offered.proficiency,
          priority: wanted.priority
        });
      }
    });

    // Find skills user2 can teach that user1 wants to learn
    user2.skillsOffered.forEach(offered => {
      const wanted = user1.skillsWanted.find(w => 
        w.skill.toLowerCase() === offered.skill.toLowerCase()
      );
      if (wanted) {
        exchanges.push({
          fromUser: user2._id,
          toUser: user1._id,
          skill: offered.skill,
          proficiency: offered.proficiency,
          priority: wanted.priority
        });
      }
    });

    // Return the highest priority exchanges
    return exchanges.sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }).slice(0, 2); // Return top 2 exchanges
  }
}

module.exports = new MatchingAlgorithm();