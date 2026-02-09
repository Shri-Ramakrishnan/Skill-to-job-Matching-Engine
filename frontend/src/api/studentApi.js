import axiosInstance from './axios';

export const getStudentProfileApi = async () => {
  const response = await axiosInstance.get('/students/profile');
  return response.data;
};

export const updateSkillsApi = async (payload) => {
  const response = await axiosInstance.put('/students/skills', payload);
  return response.data;
};

export const getMatchesApi = async (params = {}) => {
  const response = await axiosInstance.get('/students/matches', { params });
  return response.data;
};
