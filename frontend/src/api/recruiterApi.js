import axiosInstance from './axios';

export const getRecruiterJobsApi = async () => {
  const response = await axiosInstance.get('/recruiters/jobs');
  return response.data;
};

export const createJobApi = async (payload) => {
  const response = await axiosInstance.post('/recruiters/jobs', payload);
  return response.data;
};

export const updateJobApi = async (jobId, payload) => {
  const response = await axiosInstance.put(`/recruiters/jobs/${jobId}`, payload);
  return response.data;
};

export const deleteJobApi = async (jobId) => {
  const response = await axiosInstance.delete(`/recruiters/jobs/${jobId}`);
  return response.data;
};
