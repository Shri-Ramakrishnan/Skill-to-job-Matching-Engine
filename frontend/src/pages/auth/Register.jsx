import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import AlertMessage from '../../components/common/AlertMessage';

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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register(form);
      const nextUser = result.data.user;
      navigate(roleRouteMap[nextUser.role] || '/', { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container narrow">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <AlertMessage type="error" message={error} />
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          required
        />
        <select value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
