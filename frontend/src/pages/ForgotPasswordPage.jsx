import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import AuthLayout, { Alert, AuthLink, FormField, SubmitButton } from '../components/AuthLayout';
import { validateEmail } from '../utils/validation';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    const identifierError = validateIdentifier(email);
    setError(identifierError);
    if (identifierError) return;

    setLoading(true);
    setSuccess('');
    try {
      await authApi.forgotPassword({ email });
      setSuccess('OTP code has been sent to your email! (Check inbox or spam folder)');
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your registered Email or Mobile Number to receive an OTP"
      footer={
        <p>
          Remember your password? <AuthLink to="/login">Login</AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <FormField label="Email or Mobile Number" error={error}>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="you@example.com or 9876543210"
          />
        </FormField>

        <SubmitButton loading={loading}>Send OTP</SubmitButton>
      </form>
    </AuthLayout>
  );
}
