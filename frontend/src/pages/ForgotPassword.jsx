import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { forgotPasswordSchema } from '../utils/validationSchemas'
import { authApi } from '../api/authApi'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const toast = useToast()
  const [serverError, setServerError] = useState('')
  const [sent, setSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      await authApi.forgotPassword(data.email)
    } catch (_) {
      // Always show success to prevent email enumeration
    }
    setSubmittedEmail(data.email)
    setSent(true)
    toast.info('OTP has been sent to your email')
  }

  if (sent) {
    return (
      <AuthLayout title="Check Your Email" subtitle="We've sent you a verification code">
        <div className="text-center">
          <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-sky-600" />
          </div>
          <p className="text-gray-600 text-sm mb-6">
            If <span className="font-semibold text-gray-900">{submittedEmail}</span> is registered,
            a 6-digit OTP has been sent. Check your inbox.
          </p>
          <button
            className="btn-primary flex items-center justify-center gap-2"
            onClick={() => navigate('/verify-otp', { state: { email: submittedEmail } })}
          >
            Enter OTP
          </button>
          <div className="mt-4">
            <Link
              to="/forgot-password"
              onClick={() => setSent(false)}
              className="text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              Try a different email
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700">
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset OTP">
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-slide-down">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          registration={register('email')}
          error={errors.email}
          placeholder="you@example.com"
          icon={Mail}
        />

        <button
          className="btn-primary flex items-center justify-center gap-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              Sending OTP...
            </>
          ) : (
            'Send OTP'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700">
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  )
}
