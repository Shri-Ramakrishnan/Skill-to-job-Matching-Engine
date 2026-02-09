import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import AlertMessage from '../../components/common/AlertMessage';
import { extractErrorMessage } from '../../utils/apiError';

const roleRouteMap = {
  student: '/student/dashboard',
  recruiter: '/recruiter/dashboard',
  admin: '/admin/dashboard'
};

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const notice = localStorage.getItem('auth_notice');
    if (notice) {
      setInfo(notice);
      localStorage.removeItem('auth_notice');
    }
  }, []);

  if (isAuthenticated && user) {
    return <Navigate to={roleRouteMap[user.role] || '/'} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const result = await login(form);
      const nextUser = result.data.user;
      const from = location.state?.from;
      navigate(from || roleRouteMap[nextUser.role] || '/', { replace: true });
    } catch (apiError) {
      setError(extractErrorMessage(apiError, 'Unable to login.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4 auth-page">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-9 col-lg-6">
          <div className="text-center mb-4">
            <h1 className="auth-hero-title">Skill-to-Job Matching Engine</h1>
            <p className="auth-hero-subtitle mb-0">Discover the right career based on your skills</p>
          </div>

          <div className="card shadow-sm border-0 auth-card">
            <div className="card-body p-4">
              <h2 className="h4 mb-3 text-center auth-heading">Login</h2>
              <AlertMessage type="info" message={info} />
              <AlertMessage type="error" message={error} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label auth-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label auth-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p className="text-center mt-3 mb-0 auth-helper-text">
                No account?{' '}
                <Link className="auth-switch-link" to="/register">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
