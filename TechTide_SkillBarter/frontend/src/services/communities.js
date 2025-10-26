import api from './api';

export const communitiesService = {
  getCommunities: async (filters = {}) => {
    const response = await api.get('/communities', { params: filters });
    return response.data.data;
  },

  getCommunity: async (communityId) => {
    const response = await api.get(`/communities/${communityId}`);
    return response.data.data;
  },

  createCommunity: async (communityData) => {
    const response = await api.post('/communities', communityData);
    return response.data.data;
  },

  joinCommunity: async (communityId) => {
    const response = await api.post(`/communities/${communityId}/join`);
    return response.data.data;
  },

  leaveCommunity: async (communityId) => {
    const response = await api.post(`/communities/${communityId}/leave`);
    return response.data.data;
  },

  getCommunityMembers: async (communityId, filters = {}) => {
    const response = await api.get(`/communities/${communityId}/members`, { params: filters });
    return response.data.data;
  }
};