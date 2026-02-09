const StatsCards = ({ stats }) => {
  return (
    <div className="grid-2">
      <div className="card">
        <h2>Total Users</h2>
        <p>{stats.totalUsers ?? 0}</p>
      </div>
      <div className="card">
        <h2>Total Jobs</h2>
        <p>{stats.totalJobs ?? 0}</p>
      </div>
      <div className="card full-width">
        <h2>Top Demanded Skills</h2>
        {!stats.topSkills?.length ? (
          <p>No skill analytics yet.</p>
        ) : (
          <ul className="list">
            {stats.topSkills.map((skill) => (
              <li key={skill._id}>
                {skill._id} - {skill.count}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StatsCards;
