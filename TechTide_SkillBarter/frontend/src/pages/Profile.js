import React, { useState, useEffect } from 'react';
import { 
  Edit2, 
  Save, 
  X, 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Award,
  Star,
  Users,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import { usersService } from '../services/users';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: {
      state: '',
      city: '',
      pincode: ''
    },
    language: 'en'
  });

  const [stats, setStats] = useState({
    totalMatches: 0,
    completedSessions: 0,
    skillPoints: 0,
    badgesCount: 0,
    averageRating: 0
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || {
          state: '',
          city: '',
          pincode: ''
        },
        language: user.language || 'en'
      });
      fetchUserStats();
    }
    setLoading(false);
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const dashboardData = await usersService.getDashboard();
      setStats(dashboardData.stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await authService.updateProfile(profileData);
      updateUser(updatedUser);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // In a real app, you would upload to cloud storage and update user avatar
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user avatar URL (simulated)
      const updatedUser = { ...user, avatar: URL.createObjectURL(file) };
      updateUser(updatedUser);
      
      setShowAvatarModal(false);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-green-500 rounded-2xl text-white p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white border-opacity-30">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute bottom-0 right-0 p-2 bg-orange-600 rounded-full hover:bg-orange-700 transition-colors duration-200"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {editing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-transparent border-b border-white border-opacity-50 focus:outline-none focus:border-opacity-100"
                    />
                  ) : (
                    user?.name
                  )}
                </h1>
                <div className="flex items-center justify-center md:justify-start space-x-4 text-white text-opacity-80">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {user?.location?.city && `${user.location.city}, `}
                      {user?.location?.state || 'Add location'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    <span>{stats.averageRating || 'No ratings yet'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                {editing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors duration-200 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setProfileData({
                          name: user.name || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          bio: user.bio || '',
                          location: user.location || { state: '', city: '', pincode: '' },
                          language: user.language || 'en'
                        });
                      }}
                      className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-colors duration-200 flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors duration-200 flex items-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              {editing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself and your skills..."
                  className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-2 text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:border-opacity-100 resize-none"
                  rows="3"
                />
              ) : (
                <p className="text-white text-opacity-90">
                  {user?.bio || 'No bio added yet. Tell us about yourself and your skills!'}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalMatches}</div>
                <div className="text-white text-opacity-80 text-sm">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.completedSessions}</div>
                <div className="text-white text-opacity-80 text-sm">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.skillPoints}</div>
                <div className="text-white text-opacity-80 text-sm">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.badgesCount}</div>
                <div className="text-white text-opacity-80 text-sm">Badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="text-gray-900">{user?.email}</div>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Phone</div>
                  {editing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="form-input w-full"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="text-gray-900">
                      {user?.phone || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">State</label>
                {editing ? (
                  <input
                    type="text"
                    value={profileData.location.state}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      location: { ...profileData.location, state: e.target.value }
                    })}
                    className="form-input"
                    placeholder="Enter your state"
                  />
                ) : (
                  <div className="text-gray-900">
                    {user?.location?.state || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">City</label>
                {editing ? (
                  <input
                    type="text"
                    value={profileData.location.city}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      location: { ...profileData.location, city: e.target.value }
                    })}
                    className="form-input"
                    placeholder="Enter your city"
                  />
                ) : (
                  <div className="text-gray-900">
                    {user?.location?.city || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Pincode</label>
                {editing ? (
                  <input
                    type="text"
                    value={profileData.location.pincode}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      location: { ...profileData.location, pincode: e.target.value }
                    })}
                    className="form-input"
                    placeholder="Enter pincode"
                  />
                ) : (
                  <div className="text-gray-900">
                    {user?.location?.pincode || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Language</label>
                {editing ? (
                  <select
                    value={profileData.language}
                    onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                    className="form-select"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-gray-900">
                    {languages.find(lang => lang.code === user?.language)?.name || 'English'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Skills & Badges */}
        <div className="space-y-6">
          {/* Skills Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Summary</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Skills Offered</span>
                  <span>{user?.skillsOffered?.length || 0}</span>
                </div>
                <div className="space-y-2">
                  {user?.skillsOffered?.slice(0, 3).map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                      <span className={`badge skill-${skill.proficiency.toLowerCase()} text-xs`}>
                        {skill.proficiency}
                      </span>
                    </div>
                  ))}
                  {(!user?.skillsOffered || user.skillsOffered.length === 0) && (
                    <p className="text-gray-500 text-sm">No skills added yet</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Skills Wanted</span>
                  <span>{user?.skillsWanted?.length || 0}</span>
                </div>
                <div className="space-y-2">
                  {user?.skillsWanted?.slice(0, 3).map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                      <span className={`badge priority-${skill.priority.toLowerCase()} text-xs`}>
                        {skill.priority}
                      </span>
                    </div>
                  ))}
                  {(!user?.skillsWanted || user.skillsWanted.length === 0) && (
                    <p className="text-gray-500 text-sm">No skills wanted yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Badges */}
          {user?.badges && user.badges.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Badges</h2>
              <div className="grid grid-cols-3 gap-4">
                {user.badges.slice(0, 6).map((badge, index) => (
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

      {/* Avatar Upload Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Update Profile Picture"
      >
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-600">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="btn btn-primary cursor-pointer">
              <Camera className="w-4 h-4 mr-2" />
              Choose Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <p className="text-sm text-gray-600">
            Recommended: Square image, at least 400x400 pixels
          </p>

          {uploading && (
            <div className="mt-4">
              <LoadingSpinner />
              <p className="text-sm text-gray-600 mt-2">Uploading...</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Profile;