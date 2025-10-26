import api from './api';

export const usersService = {
  getDashboard: async () => {
    const response = await api.get('/users/dashboard/data');
    return response.data.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  },

  updateSkills: async (skillsData) => {
    const response = await api.put('/users/skills', skillsData);
    return response.data.data;
  },

  addOfferedSkill: async (skillData) => {
    const response = await api.post('/users/skills/offered', skillData);
    return response.data.data;
  },

  addWantedSkill: async (skillData) => {
    const response = await api.post('/users/skills/wanted', skillData);
    return response.data.data;
  },

  removeOfferedSkill: async (skillId) => {
    const response = await api.delete(`/users/skills/offered/${skillId}`);
    return response.data.data;
  },

  removeWantedSkill: async (skillId) => {
    const response = await api.delete(`/users/skills/wanted/${skillId}`);
    return response.data.data;
  },

  searchUsers: async (filters) => {
    const response = await api.get('/users/search', { params: filters });
    return response.data.data;
  }
};