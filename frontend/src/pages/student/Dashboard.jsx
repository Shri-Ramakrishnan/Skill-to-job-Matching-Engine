import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import SkillEditor from '../../components/student/SkillEditor';
import MatchList from '../../components/student/MatchList';
import SkillGapChart from '../../components/student/SkillGapChart';
import AlertMessage from '../../components/common/AlertMessage';
import { getMatchesApi, updateSkillsApi } from '../../api/studentApi';
import { extractErrorMessage } from '../../utils/apiError';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const { user, refreshStudentProfile } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedSkills, setSavedSkills] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');

  useEffect(() => {
    if (Array.isArray(user?.skills)) {
      setSavedSkills(user.skills);
    }
  }, [user]);

  const handleSaveSkills = async (skills) => {
    setError('');
    setMessage('');

    if (!skills.length) {
      setError('Please add at least one skill before saving.');
      return;
    }

    setSkillsLoading(true);

    try {
      await updateSkillsApi({ skills });
      const refreshedProfile = await refreshStudentProfile();
      setSavedSkills(Array.isArray(refreshedProfile?.skills) ? refreshedProfile.skills : skills);
      setMessage('Skills updated successfully.');
    } catch (apiError) {
      setError(extractErrorMessage(apiError, 'Unable to update skills.'));
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleFindMatches = async () => {
    setError('');
    setMessage('');
    setMatchesLoading(true);

    try {
      const response = await getMatchesApi({ threshold: Number(threshold) || 0 });
      const sortedMatches = [...response.data.matches].sort((a, b) => b.matchScore - a.matchScore);
      setMatches(sortedMatches);
      setSelectedJobId(sortedMatches[0]?.jobId || '');
      setHasSearched(true);
      setMessage('Matching jobs fetched successfully.');
    } catch (apiError) {
      setError(extractErrorMessage(apiError, 'Unable to fetch matched jobs.'));
    } finally {
      setMatchesLoading(false);
    }
  };

  const selectedJob = matches.find((job) => job.jobId === selectedJobId) || null;
  const selectedJobSkillGapData = selectedJob
    ? selectedJob.missingSkills.map((skillName) => {
        const requiredSkill = selectedJob.requiredSkills.find(
          (skill) => skill.name.toLowerCase() === skillName.toLowerCase()
        );

        return {
          skill: skillName,
          weight: requiredSkill?.weight ?? 1
        };
      })
    : [];

  return (
    <DashboardLayout title="Student Dashboard">
      <AlertMessage type="success" message={message} />
      <AlertMessage type="error" message={error} />

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <h5 className="card-title mb-3">Current Skills</h5>
          {!savedSkills.length ? (
            <p className="text-muted mb-0">No skills added yet.</p>
          ) : (
            <div>
              {savedSkills.map((skill) => (
                <span className="skill-pill me-2 mb-2" key={skill.name}>
                  {skill.name} (L{skill.proficiency})
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <SkillEditor onSave={handleSaveSkills} loading={skillsLoading} />

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <h5 className="card-title mb-3">Matching Filter</h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label htmlFor="threshold" className="form-label">
                Minimum Match Score (%)
              </label>
              <input
                id="threshold"
                type="number"
                min="0"
                max="100"
                className="form-control"
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button type="button" className="btn btn-primary w-100" onClick={handleFindMatches} disabled={matchesLoading}>
                {matchesLoading ? 'Finding...' : 'Find Matching Jobs'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <MatchList jobs={matches} hasSearched={hasSearched} />

      {hasSearched && matches.length > 0 && selectedJob && selectedJobSkillGapData.length > 0 && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-3">
            <h5 className="card-title mb-3">Skill Gap Chart</h5>
            <div className="row g-3 align-items-end mb-3">
              <div className="col-md-6">
                <label htmlFor="selectedJob" className="form-label">
                  Select Job
                </label>
                <select
                  id="selectedJob"
                  className="form-select"
                  value={selectedJobId}
                  onChange={(event) => setSelectedJobId(event.target.value)}
                >
                  {matches.map((job) => (
                    <option key={job.jobId} value={job.jobId}>
                      {job.title} ({job.matchScore}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SkillGapChart data={selectedJobSkillGapData} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
