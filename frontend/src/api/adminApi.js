import axiosInstance from './axios';

export const getAdminStatsApi = async () => {
  const response = await axiosInstance.get('/admin/stats');
  return response.data;
};
