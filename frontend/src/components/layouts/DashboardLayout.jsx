import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const DashboardLayout = ({ title, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>{title}</h1>
          <p>
            Signed in as <strong>{user?.name}</strong> ({user?.role})
          </p>
        </div>
        <div className="header-actions">
          {user?.role === 'student' && <Link to="/student/dashboard">Student Dashboard</Link>}
          {user?.role === 'recruiter' && <Link to="/recruiter/dashboard">Recruiter Dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin/dashboard">Admin Dashboard</Link>}
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
