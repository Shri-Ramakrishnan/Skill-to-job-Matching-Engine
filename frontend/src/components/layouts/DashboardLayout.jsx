import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

const DashboardLayout = ({ title, children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : '';

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg app-navbar">
        <div className="container">
          <span className="navbar-brand fw-semibold mb-0">Skill-to-Job Matching Engine</span>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <span className="role-chip">{roleLabel}</span>
            <button type="button" className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀'}
            </button>
            <button type="button" className="btn btn-danger btn-sm px-3" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <div className="mb-3">
          <h2 className="h4 mb-1">{title}</h2>
          <p className="text-muted mb-0">
            Signed in as <strong>{user?.name}</strong> ({user?.role})
          </p>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
