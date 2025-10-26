import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersService } from '../services/users';
import { skillsService } from '../services/skills';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Skills = () => {
  const { user } = useAuth();
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('offered'); // 'offered' or 'wanted'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    skill: '',
    proficiency: 'Intermediate',
    description: '',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchUserSkills();
    fetchAvailableSkills();
    fetchCategories();
  }, []);

  const fetchUserSkills = async () => {
    try {
      // In a real app, this would come from the API
      setSkillsOffered(user?.skillsOffered || []);
      setSkillsWanted(user?.skillsWanted || []);
    } catch (error) {
      console.error('Error fetching user skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSkills = async () => {
    try {
      const skills = await skillsService.getSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error('Error fetching available skills:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await skillsService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddSkill = (type) => {
    setModalType(type);
    setFormData({
      skill: '',
      proficiency: 'Intermediate',
      description: '',
      priority: 'Medium'
    });
    setShowAddModal(true);
  };

  const handleSubmitSkill = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'offered') {
        await usersService.addOfferedSkill({
          skill: formData.skill,
          proficiency: formData.proficiency,
          description: formData.description
        });
        toast.success('Skill added successfully!');
      } else {
        await usersService.addWantedSkill({
          skill: formData.skill,
          priority: formData.priority
        });
        toast.success('Skill interest added successfully!');
      }
      
      setShowAddModal(false);
      fetchUserSkills(); // Refresh the list
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId, type) => {
    try {
      if (type === 'offered') {
        await usersService.removeOfferedSkill(skillId);
      } else {
        await usersService.removeWantedSkill(skillId);
      }
      
      toast.success('Skill removed successfully!');
      fetchUserSkills(); // Refresh the list
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error('Failed to remove skill');
    }
  };

  const filteredAvailableSkills = availableSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Your Skills</h1>
        <p className="text-gray-600 mt-2">
          List the skills you can teach and the skills you want to learn to find perfect matches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Offered */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Skills I Can Teach</h2>
            <button
              onClick={() => handleAddSkill('offered')}
              className="btn btn-primary btn-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </button>
          </div>

          {skillsOffered.length > 0 ? (
            <div className="space-y-4">
              {skillsOffered.map((skill) => (
                <div key={skill._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{skill.skill}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`badge skill-${skill.proficiency.toLowerCase()}`}>
                        {skill.proficiency}
                      </span>
                      {skill.description && (
                        <span className="text-sm text-gray-600">{skill.description}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill._id, 'offered')}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-gray-600 mb-4">
                No skills added yet. Add skills you can teach to start exchanging.
              </p>
              <button
                onClick={() => handleAddSkill('offered')}
                className="btn btn-primary"
              >
                Add Your First Skill
              </button>
            </div>
          )}
        </div>

        {/* Skills Wanted */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Skills I Want to Learn</h2>
            <button
              onClick={() => handleAddSkill('wanted')}
              className="btn btn-primary btn-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </button>
          </div>

          {skillsWanted.length > 0 ? (
            <div className="space-y-4">
              {skillsWanted.map((skill) => (
                <div key={skill._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{skill.skill}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`badge priority-${skill.priority.toLowerCase()}`}>
                        {skill.priority} Priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill._id, 'wanted')}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-4">
                No skills wanted yet. Add skills you want to learn to find teachers.
              </p>
              <button
                onClick={() => handleAddSkill('wanted')}
                className="btn btn-primary"
              >
                Add Skills to Learn
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Available Skills Browser */}
      <div className="card p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Browse Available Skills</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 pr-4"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAvailableSkills.map((skill) => (
            <div key={skill._id} className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{skill.name}</h3>
                <span className="badge badge-primary text-xs">
                  {skill.category}
                </span>
              </div>
              {skill.description && (
                <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setFormData({ ...formData, skill: skill.name });
                    setModalType('offered');
                    setShowAddModal(true);
                  }}
                  className="btn btn-outline btn-sm flex-1"
                >
                  Can Teach
                </button>
                <button
                  onClick={() => {
                    setFormData({ ...formData, skill: skill.name });
                    setModalType('wanted');
                    setShowAddModal(true);
                  }}
                  className="btn btn-primary btn-sm flex-1"
                >
                  Want to Learn
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAvailableSkills.length === 0 && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No skills found matching your search.</p>
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={modalType === 'offered' ? 'Add Skill to Teach' : 'Add Skill to Learn'}
      >
        <form onSubmit={handleSubmitSkill} className="space-y-4">
          <div>
            <label className="form-label">Skill</label>
            <input
              type="text"
              value={formData.skill}
              onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
              className="form-input"
              required
            />
          </div>

          {modalType === 'offered' ? (
            <>
              <div>
                <label className="form-label">Proficiency Level</label>
                <select
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                  className="form-select"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="form-label">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows="3"
                  placeholder="Brief description of your expertise..."
                />
              </div>
            </>
          ) : (
            <div>
              <label className="form-label">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="form-select"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              Add Skill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Skills;