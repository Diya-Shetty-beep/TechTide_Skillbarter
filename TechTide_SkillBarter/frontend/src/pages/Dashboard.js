import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersService } from '../services/users';
import { matchesService } from '../services/matches';
import { 
  TrendingUp, 
  Users, 
  Award, 
  Clock,
  ArrowRight,
  Star,
  Calendar,
  MessageCircle
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [potentialMatches, setPotentialMatches] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchPotentialMatches();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await usersService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentialMatches = async () => {
    try {
      const matches = await matchesService.getPotentialMatches({ limit: 3 });
      setPotentialMatches(matches);
    } catch (error) {
      console.error('Error fetching potential matches:', error);
    }
  };

  const handleQuickMatch = async (targetUserId, user1Skill, user2Skill) => {
    try {
      await matchesService.createMatch({
        targetUserId,
        user1Skill,
        user2Skill
      });
      // Refresh matches after creating new one
      fetchPotentialMatches();
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = dashboardData?.stats || {
    totalMatches: 0,
    completedSessions: 0,
    skillPoints: user?.skillPoints || 0,
    badgesCount: user?.badges?.length || 0
  };

  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Continue your skill exchange journey and discover new learning opportunities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.skillPoints}
              </div>
              <div className="text-gray-600">Skill Points</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalMatches}
              </div>
              <div className="text-gray-600">Total Matches</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.badgesCount}
              </div>
              <div className="text-gray-600">Badges Earned</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.completedSessions}
              </div>
              <div className="text-gray-600">Sessions Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Actions & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/skills"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200 text-center"
              >
                <div className="text-orange-500 mb-2">
                  <Award className="w-8 h-8 mx-auto" />
                </div>
                <div className="font-medium text-gray-900">Manage Skills</div>
                <div className="text-sm text-gray-600">Update your skills profile</div>
              </Link>

              <Link
                to="/matches"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200 text-center"
              >
                <div className="text-green-500 mb-2">
                  <Users className="w-8 h-8 mx-auto" />
                </div>
                <div className="font-medium text-gray-900">Find Matches</div>
                <div className="text-sm text-gray-600">Discover new partners</div>
              </Link>

              <Link
                to="/community"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-center"
              >
                <div className="text-blue-500 mb-2">
                  <MessageCircle className="w-8 h-8 mx-auto" />
                </div>
                <div className="font-medium text-gray-900">Join Community</div>
                <div className="text-sm text-gray-600">Connect with learners</div>
              </Link>

              <Link
                to="/chat"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200 text-center"
              >
                <div className="text-purple-500 mb-2">
                  <Calendar className="w-8 h-8 mx-auto" />
                </div>
                <div className="font-medium text-gray-900">Schedule Session</div>
                <div className="text-sm text-gray-600">Plan your next exchange</div>
              </Link>
            </div>
          </div>

          {/* Potential Matches */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Potential Matches
              </h2>
              <Link
                to="/matches"
                className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {potentialMatches.length > 0 ? (
              <div className="space-y-4">
                {potentialMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {match.user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {match.user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Match Score: {match.score}%
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickMatch(
                        match.user.id,
                        match.exchange[0],
                        match.exchange[1]
                      )}
                      className="btn btn-primary btn-sm"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  No potential matches found. Update your skills to get better matches.
                </p>
                <Link to="/skills" className="btn btn-primary">
                  Update Skills
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Profile & Recent Activity */}
        <div className="space-y-8">
          {/* Profile Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Profile
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-sm text-gray-600">{user?.email}</div>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {user?.rating?.average || 'No ratings yet'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">
                    {user?.skillsOffered?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Skills Offered</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">
                    {user?.skillsWanted?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Skills Wanted</div>
                </div>
              </div>

              <Link
                to="/profile"
                className="w-full btn btn-outline"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                      {activity.type === 'match' ? '👥' : '⭐'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">
                  No recent activity. Start by updating your skills!
                </p>
              </div>
            )}
          </div>

          {/* Badges Preview */}
          {user?.badges && user.badges.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Badges
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {user.badges.slice(0, 3).map((badge, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-2">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-medium text-gray-900 truncate">
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;