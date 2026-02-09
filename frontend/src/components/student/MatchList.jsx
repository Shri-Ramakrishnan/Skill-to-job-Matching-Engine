const MatchList = ({ jobs }) => {
  if (!jobs.length) {
    return <p className="card">No matched jobs found.</p>;
  }

  return (
    <div className="card">
      <h2>Matched Jobs</h2>
      <ul className="list">
        {jobs.map((job) => (
          <li key={job.jobId}>
            <p>
              <strong>{job.title}</strong> at {job.company}
            </p>
            <p>Match Score: {job.matchScore}%</p>
            <p>
              Skill Gap:{' '}
              {job.missingSkills.length > 0 ? job.missingSkills.join(', ') : 'No missing skills'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
