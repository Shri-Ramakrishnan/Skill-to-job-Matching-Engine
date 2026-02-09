const StatsCards = ({ stats }) => {
  return (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="card shadow-sm border-0 h-100 kpi-card">
          <div className="card-body">
            <h6 className="kpi-label mb-2">Total Users</h6>
            <p className="display-6 mb-0 kpi-value">{stats.totalUsers ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow-sm border-0 h-100 kpi-card">
          <div className="card-body">
            <h6 className="kpi-label mb-2">Total Jobs</h6>
            <p className="display-6 mb-0 kpi-value">{stats.totalJobs ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card shadow-sm border-0 analytics-card">
          <div className="card-body">
            <h5 className="card-title mb-3">Top Demanded Skills</h5>
            {!stats.topSkills?.length ? (
              <p className="text-muted mb-0">No skill analytics yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table analytics-table mb-0">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topSkills.map((skill) => (
                      <tr key={skill._id}>
                        <td className="text-capitalize">{skill._id}</td>
                        <td>{skill.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
