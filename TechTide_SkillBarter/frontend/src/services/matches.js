import api from './api';

export const matchesService = {
  getPotentialMatches: async (filters = {}) => {
    const response = await api.get('/matches/potential', { params: filters });
    return response.data.data;
  },

  getUserMatches: async (filters = {}) => {
    const response = await api.get('/matches', { params: filters });
    return response.data.data;
  },

  createMatch: async (matchData) => {
    const response = await api.post('/matches', matchData);
    return response.data.data;
  },

  updateMatchStatus: async (matchId, statusData) => {
    const response = await api.put(`/matches/${matchId}/status`, statusData);
    return response.data.data;
  },

  addSession: async (matchId, sessionData) => {
    const response = await api.post(`/matches/${matchId}/sessions`, sessionData);
    return response.data.data;
  },

  rateSession: async (matchId, sessionId, ratingData) => {
    const response = await api.put(`/matches/${matchId}/sessions/${sessionId}/rate`, ratingData);
    return response.data.data;
  }
};