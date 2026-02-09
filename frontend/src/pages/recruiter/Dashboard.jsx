import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import JobForm from '../../components/recruiter/JobForm';
import RecruiterJobList from '../../components/recruiter/RecruiterJobList';
import AlertMessage from '../../components/common/AlertMessage';
import {
  createJobApi,
  deleteJobApi,
  getRecruiterJobsApi,
  updateJobApi
} from '../../api/recruiterApi';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setError('');

    try {
      const response = await getRecruiterJobsApi();
      setJobs(response.data.jobs || []);
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to load jobs.');
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSubmitJob = async (payload) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (editingJob?._id) {
        await updateJobApi(editingJob._id, payload);
        setMessage('Job updated successfully.');
      } else {
        await createJobApi(payload);
        setMessage('Job created successfully.');
      }

      setEditingJob(null);
      await loadJobs();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to save job.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    setError('');
    setMessage('');

    try {
      await deleteJobApi(jobId);
      setMessage('Job deleted successfully.');
      await loadJobs();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to delete job.');
    }
  };

  return (
    <DashboardLayout title="Recruiter Dashboard">
      <AlertMessage type="success" message={message} />
      <AlertMessage type="error" message={error} />

      <JobForm
        onSubmit={handleSubmitJob}
        loading={loading}
        initialValue={editingJob}
        onCancelEdit={() => setEditingJob(null)}
      />

      <RecruiterJobList jobs={jobs} onEdit={setEditingJob} onDelete={handleDelete} />
    </DashboardLayout>
  );
};

export default Dashboard;
