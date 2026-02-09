const getScoreClassName = (score) => {
  if (score >= 75) return 'match-badge match-badge-high';
  if (score >= 40) return 'match-badge match-badge-medium';
  return 'match-badge match-badge-low';
};

const MatchList = ({ jobs, hasSearched }) => {
  if (!hasSearched) {
    return (
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">Run matching to see recommended jobs.</div>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">No matching jobs found.</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-3">
        <h5 className="card-title mb-3">Matching Results</h5>
        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th>Job</th>
                <th>Match</th>
                <th>Missing Skills</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.jobId}>
                  <td>
                    <div className="fw-semibold">{job.title}</div>
                    <small className="text-muted">{job.company}</small>
                  </td>
                  <td>
                    <span className={getScoreClassName(job.matchScore)}>
                      {job.matchScore}%
                    </span>
                  </td>
                  <td>
                    {job.missingSkills.length > 0 ? (
                      job.missingSkills.map((skill) => (
                        <span className="skill-gap-badge me-1 mb-1" key={`${job.jobId}-${skill}`}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="skill-ok-badge">No missing skills</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatchList;
