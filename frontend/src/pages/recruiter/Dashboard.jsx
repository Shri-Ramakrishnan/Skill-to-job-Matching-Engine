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
import { extractErrorMessage } from '../../utils/apiError';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [savingJob, setSavingJob] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [deletingJobId, setDeletingJobId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setError('');
    setJobsLoading(true);

    try {
      const response = await getRecruiterJobsApi();
      setJobs(response.data.jobs || []);
    } catch (apiError) {
      setError(extractErrorMessage(apiError, 'Unable to load jobs.'));
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSubmitJob = async (payload) => {
    setError('');
    setMessage('');
    setSavingJob(true);

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
      setError(extractErrorMessage(apiError, 'Unable to save job.'));
    } finally {
      setSavingJob(false);
    }
  };

  const handleDelete = async (jobId) => {
    setError('');
    setMessage('');
    setDeletingJobId(jobId);

    try {
      await deleteJobApi(jobId);
      setMessage('Job deleted successfully.');
      await loadJobs();
    } catch (apiError) {
      setError(extractErrorMessage(apiError, 'Unable to delete job.'));
    } finally {
      setDeletingJobId('');
    }
  };

  return (
    <DashboardLayout title="Recruiter Dashboard">
      <AlertMessage type="success" message={message} />
      <AlertMessage type="error" message={error} />

      <JobForm
        onSubmit={handleSubmitJob}
        loading={savingJob}
        initialValue={editingJob}
        onCancelEdit={() => setEditingJob(null)}
      />

      {jobsLoading ? (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">Loading posted jobs...</div>
        </div>
      ) : (
        <RecruiterJobList
          jobs={jobs}
          onEdit={setEditingJob}
          onDelete={handleDelete}
          deletingJobId={deletingJobId}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
