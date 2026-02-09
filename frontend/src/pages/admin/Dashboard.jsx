import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatsCards from '../../components/admin/StatsCards';
import AlertMessage from '../../components/common/AlertMessage';
import { getAdminStatsApi } from '../../api/adminApi';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setError('');

      try {
        const response = await getAdminStatsApi();
        setStats(response.data);
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Unable to load admin stats.');
      }
    };

    loadStats();
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard">
      <AlertMessage type="error" message={error} />
      <StatsCards stats={stats} />
    </DashboardLayout>
  );
};

export default Dashboard;
