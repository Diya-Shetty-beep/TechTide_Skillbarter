import { useState, useEffect } from 'react';
import { skillsService } from '../services/skills';

export const useSkills = (initialFilters = {}) => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularSkills, setPopularSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSkills(initialFilters);
    loadCategories();
    loadPopularSkills();
  }, []);

  const loadSkills = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const skillsData = await skillsService.getSkills(filters);
      setSkills(skillsData);
      return skillsData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await skillsService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadPopularSkills = async () => {
    try {
      const popularSkillsData = await skillsService.getPopularSkills();
      setPopularSkills(popularSkillsData);
    } catch (err) {
      console.error('Error loading popular skills:', err);
    }
  };

  const searchSkills = async (searchTerm) => {
    try {
      setLoading(true);
      const skillsData = await skillsService.getSkills({ search: searchTerm });
      setSkills(skillsData);
      return skillsData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSkillsByCategory = async (category) => {
    try {
      setLoading(true);
      const skillsData = await skillsService.getSkills({ category });
      setSkills(skillsData);
      return skillsData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    skills,
    categories,
    popularSkills,
    loading,
    error,
    loadSkills,
    searchSkills,
    getSkillsByCategory,
    refetch: () => loadSkills(initialFilters)
  };
};