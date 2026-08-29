import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import AuthLayout, { Alert, AuthLink, FormField, SubmitButton } from '../components/AuthLayout';
import { validateEmail, validateOtp } from '../utils/validation';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: location.state?.email || '',
    otp: '',
  });
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
    const nextErrors = {
      email: validateIdentifier(form.email),
      otp: validateOtp(form.otp),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const response = await authApi.verifyOtp(form);
      navigate('/reset-password', { state: { resetToken: response.data.data.resetToken } });
    } catch (error) {
      setApiError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit OTP sent to your Email / Mobile"
      footer={
        <p>
          <AuthLink to="/forgot-password">Resend OTP</AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <Alert type="error" message={apiError} />

        <FormField label="Email or Mobile Number" error={errors.email}>
          <input name="email" type="text" value={form.email} onChange={handleChange} placeholder="you@example.com or 9876543210" />
        </FormField>

        <FormField label="OTP Code" error={errors.otp}>
          <input name="otp" value={form.otp} onChange={handleChange} placeholder="123456" maxLength={6} />
        </FormField>

        <SubmitButton loading={loading}>Verify OTP</SubmitButton>
      </form>
    </AuthLayout>
  );
}
