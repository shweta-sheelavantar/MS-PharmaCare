import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import AuthLayout, { Alert, AuthLink, FormField, SubmitButton } from '../components/AuthLayout';
import {
  validateConfirmPassword,
  validateEmail,
  validateuserName,
  validateMobile,
  validatePassword,
} from '../utils/validation';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: '',
    email: '',
    mobileNumber: '',
    role: 'CUSTOMER',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validateForm = () => {
    const nextErrors = {
      userName: validateuserName(form.userName),
      email: validateEmail(form.email),
      mobileNumber: validateMobile(form.mobileNumber),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!agreeTerms) {
      setApiError('You must agree to the Terms and Conditions');
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      await authApi.register(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account"
      subtitle="Join PharmCare today"
      footer={
        <>
          Already have an account? <AuthLink to="/login">Sign in</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <Alert type="error" message={apiError} />
        <Alert type="success" message={success} />

        <FormField label="Username" error={errors.userName}>
          <input name="userName" value={form.userName} onChange={handleChange} placeholder="John Doe" />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        </FormField>

        <FormField label="Mobile Number" error={errors.mobileNumber}>
          <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="9876543210" />
        </FormField>

        <FormField label="Role">
          <select name="role" value={form.role} onChange={handleChange} id="role-select">
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </FormField>

        <FormField label="Password" error={errors.password}>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
        </FormField>

        <FormField label="Confirm Password" error={errors.confirmPassword}>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />
        </FormField>

        <div className="checkbox-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              setApiError('');
            }}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="agreeTerms" style={{ fontSize: '0.875rem', color: '#475569', cursor: 'pointer' }}>
            I agree to the Terms & Conditions
          </label>
        </div>

        <SubmitButton loading={loading}>Register</SubmitButton>
      </form>
    </AuthLayout>
  );
}
