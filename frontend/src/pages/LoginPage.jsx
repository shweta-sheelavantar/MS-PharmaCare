import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import AuthLayout, { Alert, AuthLink, FormField, SubmitButton } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validateIdentifier = (val) => {
    if (!val || !val.trim()) return 'Email or Mobile Number is required';
    const clean = val.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
    const isMobile = /^[0-9]{10}$/.test(clean);
    if (!isEmail && !isMobile) {
      return 'Enter a valid email or 10-digit mobile number';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const identifierError = validateIdentifier(form.email);
    const passwordError = form.password ? '' : 'Password is required';
    setErrors({ email: identifierError, password: passwordError });
    if (identifierError || passwordError) return;

    setLoading(true);
    try {
      const response = await authApi.login(form);
      login(response.data.data);
      navigate('/');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Sign in to your account"
      footer={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <div>
            Don't have an account? <AuthLink to="/register">Sign up</AuthLink>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Are you an administrator?{' '}
            <a href="/admin/login" style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.color = '#4b5563'} onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
              Admin Login
            </a>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <Alert type="error" message={apiError} />

        <FormField label="Email or Mobile Number" error={errors.email}>
          <input name="email" type="text" value={form.email} onChange={handleChange} placeholder="you@example.com or 9876543210" />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
        </FormField>

        <div className="form-actions">
          <AuthLink to="/forgot-password">Forgot password?</AuthLink>
        </div>

        <SubmitButton loading={loading}>Login</SubmitButton>
      </form>
    </AuthLayout>
  );
}
