import React, { useState, useEffect } from 'react';
import { Search, Users, Plus, Settings, MessageCircle, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { communitiesService } from '../services/communities';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Community = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover', 'my-communities'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    category: '',
    location: {
      city: '',
      state: '',
      isVirtual: false
    },
    language: 'en',
    skills: [],
    isPublic: true
  });

  useEffect(() => {
    fetchCommunities();
    fetchMyCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const communitiesData = await communitiesService.getCommunities();
      setCommunities(communitiesData);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCommunities = async () => {
    try {
      // This would typically come from a separate endpoint
      // For now, we'll filter communities where user is a member
      const allCommunities = await communitiesService.getCommunities();
      const myComms = allCommunities.filter(community => 
        community.members?.some(member => member.user._id === user?.id)
      );
      setMyCommunities(myComms);
    } catch (error) {
      console.error('Error fetching my communities:', error);
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    try {
      await communitiesService.createCommunity(createForm);
      toast.success('Community created successfully!');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        category: '',
        location: {
          city: '',
          state: '',
          isVirtual: false
        },
        language: 'en',
        skills: [],
        isPublic: true
      });
      fetchCommunities();
      fetchMyCommunities();
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Failed to create community');
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      await communitiesService.joinCommunity(communityId);
      toast.success('Joined community successfully!');
      fetchCommunities();
      fetchMyCommunities();
    } catch (error) {
      console.error('Error joining community:', error);
      toast.error('Failed to join community');
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      await communitiesService.leaveCommunity(communityId);
      toast.success('Left community successfully!');
      fetchCommunities();
      fetchMyCommunities();
    } catch (error) {
      console.error('Error leaving community:', error);
      toast.error('Failed to leave community');
    }
  };

  const categories = [
    'Technology',
    'Languages',
    'Arts & Crafts',
    'Professional',
    'Life Skills',
    'Academic',
    'Regional',
    'Other'
  ];

  const filteredCommunities = (activeTab === 'discover' ? communities : myCommunities).filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Skill Communities</h1>
            <p className="text-gray-600 mt-2">
              Join skill circles and learn together with people in your area.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Community
          </button>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'discover'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Discover Communities
          </button>
          <button
            onClick={() => setActiveTab('my-communities')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'my-communities'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            My Communities ({myCommunities.length})
          </button>
        </div>

        <div className="flex space-x-4">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 pr-4 w-full sm:w-64"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select w-full sm:w-48"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map(community => (
            <CommunityCard
              key={community._id}
              community={community}
              currentUserId={user?.id}
              onJoin={handleJoinCommunity}
              onLeave={handleLeaveCommunity}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'discover' ? 'No communities found' : 'No communities joined'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'discover' 
                ? 'Try adjusting your search or create a new community.'
                : 'Join some communities to see them here.'
              }
            </p>
            {activeTab === 'discover' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                Create Community
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Community"
      >
        <form onSubmit={handleCreateCommunity} className="space-y-4">
          <div>
            <label className="form-label">Community Name</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="form-input"
              placeholder="e.g., Delhi Python Learners"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="form-textarea"
              rows="3"
              placeholder="Describe your community's purpose and activities..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category</label>
              <select
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="form-select"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Primary Language</label>
              <select
                value={createForm.language}
                onChange={(e) => setCreateForm({ ...createForm, language: e.target.value })}
                className="form-select"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="bn">Bengali</option>
                <option value="mr">Marathi</option>
                <option value="gu">Gujarati</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">City</label>
              <input
                type="text"
                value={createForm.location.city}
                onChange={(e) => setCreateForm({
                  ...createForm,
                  location: { ...createForm.location, city: e.target.value }
                })}
                className="form-input"
                placeholder="City name"
              />
            </div>

            <div>
              <label className="form-label">State</label>
              <input
                type="text"
                value={createForm.location.state}
                onChange={(e) => setCreateForm({
                  ...createForm,
                  location: { ...createForm.location, state: e.target.value }
                })}
                className="form-input"
                placeholder="State name"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isVirtual"
              checked={createForm.location.isVirtual}
              onChange={(e) => setCreateForm({
                ...createForm,
                location: { ...createForm.location, isVirtual: e.target.checked }
              })}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="isVirtual" className="ml-2 text-sm text-gray-700">
              This is a virtual/online community
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={createForm.isPublic}
              onChange={(e) => setCreateForm({ ...createForm, isPublic: e.target.checked })}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              Public community (anyone can join)
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              Create Community
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Community Card Component
const CommunityCard = ({ community, currentUserId, onJoin, onLeave }) => {
  const isMember = community.members?.some(member => member.user._id === currentUserId);
  const isAdmin = community.admin._id === currentUserId;

  return (
    <div className="card-hover overflow-hidden">
      {/* Community Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {isAdmin && (
          <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200">
            <Settings className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Community Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-white rounded-lg border-4 border-white shadow-lg -mt-8 flex items-center justify-center text-blue-600 font-bold text-lg">
                {community.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {community.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="badge badge-primary">
                    {community.category}
                  </span>
                  {community.language !== 'en' && (
                    <span className="badge badge-secondary text-xs">
                      {community.language.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {community.description}
        </p>

        {/* Community Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {community.location.isVirtual ? (
              <span>Virtual Community</span>
            ) : (
              <span>
                {community.location.city && `${community.location.city}, `}
                {community.location.state}
              </span>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{community.memberCount} members</span>
          </div>
        </div>

        {/* Skills */}
        {community.skills && community.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {community.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="badge badge-gray text-xs">
                  {skill}
                </span>
              ))}
              {community.skills.length > 3 && (
                <span className="badge badge-gray text-xs">
                  +{community.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {isMember ? (
            <>
              <button className="btn btn-outline flex-1 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </button>
              <button
                onClick={() => onLeave(community._id)}
                className="btn btn-ghost"
              >
                Leave
              </button>
            </>
          ) : (
            <button
              onClick={() => onJoin(community._id)}
              className="btn btn-primary flex-1"
            >
              Join Community
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;