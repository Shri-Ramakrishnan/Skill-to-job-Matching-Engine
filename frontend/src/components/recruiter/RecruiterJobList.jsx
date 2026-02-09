const RecruiterJobList = ({ jobs, onEdit, onDelete, deletingJobId }) => {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-3">
        <h5 className="card-title mb-3">Posted Jobs</h5>

        {!jobs.length ? (
          <p className="text-muted mb-0">No jobs posted yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Skills</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div className="fw-semibold">{job.title}</div>
                      <small className="text-muted">{job.company}</small>
                    </td>
                    <td>{job.location}</td>
                    <td>{job.roleCategory}</td>
                    <td>
                      {job.requiredSkills.map((skill) => (
                        <span className="skill-pill-neutral me-1 mb-1" key={`${job._id}-${skill.name}`}>
                          {skill.name} ({skill.weight})
                        </span>
                      ))}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onEdit(job)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDelete(job._id)}
                          disabled={deletingJobId === job._id}
                        >
                          {deletingJobId === job._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterJobList;
