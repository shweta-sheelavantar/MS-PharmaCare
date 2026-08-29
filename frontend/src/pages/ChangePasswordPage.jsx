import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import AuthLayout, { Alert, FormField, SubmitButton } from '../components/AuthLayout';
import { validateConfirmPassword, validatePassword } from '../utils/validation';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
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
    const nextErrors = {
      currentPassword: form.currentPassword ? '' : 'Current password is required',
      newPassword: validatePassword(form.newPassword),
      confirmPassword: validateConfirmPassword(form.newPassword, form.confirmPassword),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await authApi.changePassword(form);
      setSuccess('Password changed successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Change Password" subtitle="Update your account password">
      <form onSubmit={handleSubmit} className="auth-form">
        <Alert type="error" message={apiError} />
        <Alert type="success" message={success} />

        <FormField label="Current Password" error={errors.currentPassword}>
          <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} />
        </FormField>

        <FormField label="New Password" error={errors.newPassword}>
          <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} />
        </FormField>

        <FormField label="Confirm Password" error={errors.confirmPassword}>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
        </FormField>

        <SubmitButton loading={loading}>Change Password</SubmitButton>
      </form>
    </AuthLayout>
  );
}
