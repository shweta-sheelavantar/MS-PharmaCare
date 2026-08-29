import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import AuthLayout, { Alert, AuthLink, FormField, SubmitButton } from '../components/AuthLayout';
import { validateConfirmPassword, validatePassword } from '../utils/validation';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken || '';

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resetToken) {
      setApiError('Reset token missing. Please verify OTP again.');
      return;
    }

    const nextErrors = {
      newPassword: validatePassword(form.newPassword),
      confirmPassword: validateConfirmPassword(form.newPassword, form.confirmPassword),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await authApi.resetPassword({ resetToken, ...form });
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password"
      footer={
        <p>
          <AuthLink to="/login">Back to Login</AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <Alert type="error" message={apiError} />
        <Alert type="success" message={success} />

        <FormField label="New Password" error={errors.newPassword}>
          <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} />
        </FormField>

        <FormField label="Confirm Password" error={errors.confirmPassword}>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
        </FormField>

        <SubmitButton loading={loading}>Reset Password</SubmitButton>
      </form>
    </AuthLayout>
  );
}
