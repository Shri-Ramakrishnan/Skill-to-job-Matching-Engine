import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import AlertMessage from '../../components/common/AlertMessage';
import { extractErrorMessage } from '../../utils/apiError';

const roleRouteMap = {
  student: '/student/dashboard',
  recruiter: '/recruiter/dashboard',
  admin: '/admin/dashboard'
};

const Register = () => {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={roleRouteMap[user.role] || '/'} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register(form);
      const nextUser = result.data.user;
      navigate(roleRouteMap[nextUser.role] || '/', { replace: true });
    } catch (apiError) {
      setError(extractErrorMessage(apiError, 'Unable to register.'));
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
              <h2 className="h4 mb-3 text-center auth-heading">Register</h2>
              <AlertMessage type="error" message={error} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label auth-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
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
                <div className="mb-3">
                  <label className="form-label auth-label">Role</label>
                  <select
                    className="form-select"
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="student">Student</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <p className="text-center mt-3 mb-0 auth-helper-text">
                Already have an account?{' '}
                <Link className="auth-switch-link" to="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
