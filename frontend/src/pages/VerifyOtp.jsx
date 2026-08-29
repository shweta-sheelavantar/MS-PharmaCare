import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react'
import { authApi } from '../api/authApi'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/AuthLayout'
import OtpInput from '../components/OtpInput'

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const handleResend = useCallback(async () => {
    setCanResend(false)
    setCountdown(60)
    setServerError('')
    try {
      await authApi.forgotPassword(email)
    } catch (_) {
      // Always show success to prevent email enumeration
    }
    toast.info('A new OTP has been sent to your email')
  }, [email, toast])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (otp.length !== 6) {
      setServerError('Please enter the complete 6-digit OTP')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await authApi.verifyOtp(email, otp)
      const resetToken = res.data.data
      toast.success('OTP verified successfully!')
      navigate('/reset-password', { state: { resetToken } })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP.'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Verify OTP" subtitle={`Enter the 6-digit code sent to ${email || 'your email'}`}>
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-slide-down">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 bg-sky-600 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-sky-600" />
          </div>
        </div>

        <OtpInput
          value={otp}
          onChange={setOtp}
          error={serverError && !otp ? { message: serverError } : null}
          onResend={handleResend}
          resendDisabled={!canResend}
        />

        <button
          className="btn-primary flex items-center justify-center gap-2 mt-4"
          type="submit"
          disabled={isSubmitting || otp.length !== 6}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <Link to="/forgot-password" className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700">
          <ArrowLeft size={14} />
          Back to Forgot Password
        </Link>
      </div>
    </AuthLayout>
  )
}
