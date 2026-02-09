import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatsCards from '../../components/admin/StatsCards';
import AlertMessage from '../../components/common/AlertMessage';
import { getAdminStatsApi } from '../../api/adminApi';
import { extractErrorMessage } from '../../utils/apiError';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setError('');
      setLoading(true);

      try {
        const response = await getAdminStatsApi();
        setStats(response.data);
      } catch (apiError) {
        setError(extractErrorMessage(apiError, 'Unable to load admin stats.'));
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard">
      <AlertMessage type="error" message={error} />
      {loading ? (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">Loading admin stats...</div>
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
