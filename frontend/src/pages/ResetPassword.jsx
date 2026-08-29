import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, KeyRound } from 'lucide-react'
import { authApi } from '../api/authApi'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const resetToken = location.state?.resetToken || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!resetToken) {
      navigate('/forgot-password')
    }
  }, [resetToken, navigate])

  const validate = () => {
    const errs = {}
    if (!newPassword) errs.newPassword = 'Password is required'
    else if (newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters'
    else if (!/[a-z]/.test(newPassword)) errs.newPassword = 'Must contain a lowercase letter'
    else if (!/[A-Z]/.test(newPassword)) errs.newPassword = 'Must contain an uppercase letter'
    else if (!/\d/.test(newPassword)) errs.newPassword = 'Must contain a digit'
    else if (!/[@$!%*?&]/.test(newPassword)) errs.newPassword = 'Must contain a special character'

    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await authApi.resetPassword(resetToken, newPassword, confirmPassword)
      setSuccess(true)
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password.'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Set New Password" subtitle="Choose a strong password for your account">
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-slide-down">
          {serverError}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-[#6c9834] rounded-lg text-sm flex items-center gap-2 animate-slide-down">
          <CheckCircle size={16} />
          Password reset successfully! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 bg-sky-600 rounded-full flex items-center justify-center">
            <KeyRound className="w-7 h-7 text-sky-600" />
          </div>
        </div>

        <PasswordInput
          label="New Password"
          id="newPassword"
          value={newPassword}
          onChange={(val) => setNewPassword(val)}
          registration={{
            value: newPassword,
            onChange: (e) => setNewPassword(e.target.value),
          }}
          error={errors.newPassword ? { message: errors.newPassword } : null}
          placeholder="Create a strong password"
          showStrength
        />
        <PasswordInput
          label="Confirm New Password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(val) => setConfirmPassword(val)}
          registration={{
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
          }}
          error={errors.confirmPassword ? { message: errors.confirmPassword } : null}
          placeholder="Repeat your password"
        />

        <button
          className="btn-primary flex items-center justify-center gap-2"
          type="submit"
          disabled={isSubmitting || success}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Password'
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
