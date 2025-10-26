import api from './api';

export const skillsService = {
  getSkills: async (filters = {}) => {
    const response = await api.get('/skills', { params: filters });
    return response.data.data;
  },

  getCategories: async () => {
    const response = await api.get('/skills/categories');
    return response.data.data;
  },

  getPopularSkills: async () => {
    const response = await api.get('/skills/popular');
    return response.data.data;
  }
};