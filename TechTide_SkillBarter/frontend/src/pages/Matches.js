import React, { useState, useEffect } from 'react';
import { Users, Filter, MessageCircle, Calendar, Star, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { matchesService } from '../services/matches';
import { usersService } from '../services/users';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Matches = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('potential'); // 'potential', 'pending', 'accepted', 'completed'
  const [matches, setMatches] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minScore: 0,
    location: '',
    skills: []
  });
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    date: '',
    duration: 60,
    topic: '',
    notes: ''
  });

  useEffect(() => {
    fetchMatches();
    fetchPotentialMatches();
  }, [activeTab]);

  const fetchMatches = async () => {
    try {
      const matchesData = await matchesService.getUserMatches({
        status: activeTab === 'potential' ? undefined : activeTab
      });
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentialMatches = async () => {
    try {
      if (activeTab === 'potential') {
        const potential = await matchesService.getPotentialMatches();
        setPotentialMatches(potential);
      }
    } catch (error) {
      console.error('Error fetching potential matches:', error);
    }
  };

  const handleCreateMatch = async (targetUserId, user1Skill, user2Skill) => {
    try {
      await matchesService.createMatch({
        targetUserId,
        user1Skill,
        user2Skill
      });
      toast.success('Match request sent!');
      fetchMatches();
      fetchPotentialMatches();
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error('Failed to send match request');
    }
  };

  const handleMatchAction = async (matchId, action) => {
    try {
      await matchesService.updateMatchStatus(matchId, { status: action });
      toast.success(`Match ${action} successfully!`);
      fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
      toast.error('Failed to update match');
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      await matchesService.addSession(selectedMatch._id, sessionForm);
      toast.success('Session added successfully!');
      setShowSessionModal(false);
      setSelectedMatch(null);
      setSessionForm({
        date: '',
        duration: 60,
        topic: '',
        notes: ''
      });
      fetchMatches();
    } catch (error) {
      console.error('Error adding session:', error);
      toast.error('Failed to add session');
    }
  };

  const handleRateSession = async (matchId, sessionId, rating) => {
    try {
      await matchesService.rateSession(matchId, sessionId, { rating });
      toast.success('Rating submitted!');
      fetchMatches();
    } catch (error) {
      console.error('Error rating session:', error);
      toast.error('Failed to submit rating');
    }
  };

  const tabs = [
    { id: 'potential', name: 'Potential Matches', count: potentialMatches.length },
    { id: 'pending', name: 'Pending', count: matches.filter(m => m.status === 'pending').length },
    { id: 'accepted', name: 'Active', count: matches.filter(m => m.status === 'accepted').length },
    { id: 'completed', name: 'Completed', count: matches.filter(m => m.status === 'completed').length }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Skill Matches</h1>
        <p className="text-gray-600 mt-2">
          Discover potential skill exchange partners and manage your existing matches.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-outline btn-sm flex items-center"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Minimum Match Score</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                className="w-full"
              />
              <div className="text-sm text-gray-600 text-center">{filters.minScore}%</div>
            </div>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                placeholder="City or state..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Skills</label>
              <input
                type="text"
                placeholder="Filter by skills..."
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeTab === 'potential' ? (
          potentialMatches.length > 0 ? (
            potentialMatches.map((match, index) => (
              <PotentialMatchCard
                key={index}
                match={match}
                onCreateMatch={handleCreateMatch}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No potential matches found</h3>
              <p className="text-gray-600 mb-4">
                Update your skills profile to get better matches.
              </p>
            </div>
          )
        ) : matches.length > 0 ? (
          matches.map((match) => (
            <MatchCard
              key={match._id}
              match={match}
              currentUserId={user?.id}
              onMatchAction={handleMatchAction}
              onAddSession={(match) => {
                setSelectedMatch(match);
                setShowSessionModal(true);
              }}
              onRateSession={handleRateSession}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} matches
            </h3>
            <p className="text-gray-600">
              {activeTab === 'pending' && 'You have no pending match requests.'}
              {activeTab === 'accepted' && 'You have no active matches.'}
              {activeTab === 'completed' && 'You have no completed matches.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      <Modal
        isOpen={showSessionModal}
        onClose={() => {
          setShowSessionModal(false);
          setSelectedMatch(null);
        }}
        title="Schedule Learning Session"
      >
        {selectedMatch && (
          <form onSubmit={handleAddSession} className="space-y-4">
            <div>
              <label className="form-label">Session Date & Time</label>
              <input
                type="datetime-local"
                value={sessionForm.date}
                onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Duration (minutes)</label>
              <select
                value={sessionForm.duration}
                onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                className="form-select"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label className="form-label">Topic</label>
              <input
                type="text"
                value={sessionForm.topic}
                onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
                className="form-input"
                placeholder="What will you be learning/teaching?"
                required
              />
            </div>

            <div>
              <label className="form-label">Notes (Optional)</label>
              <textarea
                value={sessionForm.notes}
                onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                className="form-textarea"
                rows="3"
                placeholder="Any additional notes or preparation required..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowSessionModal(false)}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
              >
                Schedule Session
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

// Potential Match Card Component
const PotentialMatchCard = ({ match, onCreateMatch }) => {
  const otherUser = match.user;
  const primaryExchange = match.exchange?.[0];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
            {otherUser.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{otherUser.name}</div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              {otherUser.rating?.average || 'No ratings'}
            </div>
          </div>
        </div>
        <div className="match-score match-score-excellent">
          {match.score}%
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="text-sm text-orange-800 font-medium mb-1">You Can Learn</div>
          <div className="text-gray-900">{primaryExchange?.skill}</div>
          <div className="text-xs text-orange-600">
            {primaryExchange?.proficiency} level
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-800 font-medium mb-1">You Can Teach</div>
          <div className="text-gray-900">{primaryExchange?.skill}</div>
          <div className="text-xs text-green-600">
            {primaryExchange?.priority} priority
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => onCreateMatch(
            otherUser.id,
            { skill: primaryExchange.skill, proficiency: 'Intermediate' },
            { skill: primaryExchange.skill, proficiency: primaryExchange.proficiency }
          )}
          className="btn btn-primary flex-1"
        >
          Send Request
        </button>
      </div>
    </div>
  );
};

// Match Card Component
const MatchCard = ({ match, currentUserId, onMatchAction, onAddSession, onRateSession }) => {
  const isUser1 = match.user1._id === currentUserId;
  const otherUser = isUser1 ? match.user2 : match.user1;
  const userSkill = isUser1 ? match.skillExchange.user1Skill : match.skillExchange.user2Skill;
  const otherUserSkill = isUser1 ? match.skillExchange.user2Skill : match.skillExchange.user1Skill;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
            {otherUser.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{otherUser.name}</div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              {otherUser.rating?.average || 'No ratings'}
            </div>
          </div>
        </div>
        <div className={`badge ${
          match.status === 'accepted' ? 'badge-success' :
          match.status === 'pending' ? 'badge-warning' :
          match.status === 'completed' ? 'badge-info' : 'badge-error'
        }`}>
          {match.status}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="text-sm text-orange-800 font-medium mb-1">You're Learning</div>
          <div className="text-gray-900">{otherUserSkill.skill}</div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-green-800 font-medium mb-1">You're Teaching</div>
          <div className="text-gray-900">{userSkill.skill}</div>
        </div>
      </div>

      {/* Sessions */}
      {match.sessions && match.sessions.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-900 mb-2">
            Recent Sessions ({match.totalSessions})
          </div>
          <div className="space-y-2">
            {match.sessions.slice(-2).map((session) => (
              <div key={session._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="text-sm font-medium text-gray-900">{session.topic}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(session.date).toLocaleDateString()} • {session.duration}min
                  </div>
                </div>
                {!session.user1Rating && !session.user2Rating && (
                  <button
                    onClick={() => onRateSession(match._id, session._id, 5)}
                    className="btn btn-outline btn-sm"
                  >
                    Rate
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        {match.status === 'pending' && !isUser1 && (
          <>
            <button
              onClick={() => onMatchAction(match._id, 'accepted')}
              className="btn btn-primary flex-1"
            >
              Accept
            </button>
            <button
              onClick={() => onMatchAction(match._id, 'rejected')}
              className="btn btn-ghost flex-1"
            >
              Decline
            </button>
          </>
        )}

        {match.status === 'accepted' && (
          <>
            <button
              onClick={() => onAddSession(match)}
              className="btn btn-outline flex-1 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </button>
            <button
              onClick={() => onMatchAction(match._id, 'completed')}
              className="btn btn-primary flex-1"
            >
              Complete
            </button>
          </>
        )}

        {match.status === 'completed' && (
          <button className="btn btn-ghost flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </button>
        )}
      </div>
    </div>
  );
};

export default Matches;