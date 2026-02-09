import { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import SkillEditor from '../../components/student/SkillEditor';
import MatchList from '../../components/student/MatchList';
import AlertMessage from '../../components/common/AlertMessage';
import { getMatchesApi, updateSkillsApi } from '../../api/studentApi';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  const handleSaveSkills = async (skills) => {
    setError('');
    setMessage('');
    setSkillsLoading(true);

    try {
      await updateSkillsApi({ skills });
      setMessage('Skills updated successfully.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to update skills.');
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleFindMatches = async () => {
    setError('');
    setMessage('');
    setMatchesLoading(true);

    try {
      const response = await getMatchesApi();
      const sortedMatches = [...response.data.matches].sort((a, b) => b.matchScore - a.matchScore);
      setMatches(sortedMatches);
      setMessage('Matching jobs fetched successfully.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to fetch matched jobs.');
    } finally {
      setMatchesLoading(false);
    }
  };

  return (
    <DashboardLayout title="Student Dashboard">
      <AlertMessage type="success" message={message} />
      <AlertMessage type="error" message={error} />

      <SkillEditor onSave={handleSaveSkills} loading={skillsLoading} />

      <div className="card">
        <button type="button" onClick={handleFindMatches} disabled={matchesLoading}>
          {matchesLoading ? 'Finding...' : 'Find Matching Jobs'}
        </button>
      </div>

      <MatchList jobs={matches} />
    </DashboardLayout>
  );
};

export default Dashboard;
