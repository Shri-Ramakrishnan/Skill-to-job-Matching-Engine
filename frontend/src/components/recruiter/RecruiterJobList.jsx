const RecruiterJobList = ({ jobs, onEdit, onDelete }) => {
  return (
    <div className="card">
      <h2>Posted Jobs</h2>
      {!jobs.length ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="list">
          {jobs.map((job) => (
            <li key={job._id}>
              <p>
                <strong>{job.title}</strong> ({job.company})
              </p>
              <p>{job.location} | {job.roleCategory}</p>
              <p>
                Skills: {job.requiredSkills.map((skill) => `${skill.name} (${skill.weight})`).join(', ')}
              </p>
              <div className="actions">
                <button type="button" onClick={() => onEdit(job)}>
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(job._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecruiterJobList;
