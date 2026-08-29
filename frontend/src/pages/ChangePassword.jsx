import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, KeyRound } from 'lucide-react'
import { authApi } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const toast = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!currentPassword) errs.currentPassword = 'Current password is required'
    if (!newPassword) errs.newPassword = 'New password is required'
    else if (newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters'
    else if (!/[a-z]/.test(newPassword)) errs.newPassword = 'Must contain a lowercase letter'
    else if (!/[A-Z]/.test(newPassword)) errs.newPassword = 'Must contain an uppercase letter'
    else if (!/\d/.test(newPassword)) errs.newPassword = 'Must contain a digit'
    else if (!/[@$!%*?&]/.test(newPassword)) errs.newPassword = 'Must contain a special character'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm new password'
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
      await authApi.changePassword({ currentPassword, newPassword, confirmPassword })
      toast.success('Password changed successfully! Please log in again.')
      await logout()
      navigate('/login', { state: { message: 'Password changed. Please log in with your new password.' } })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password.'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Change Password" subtitle="Update your account password">
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-slide-down">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 bg-sky-600 rounded-full flex items-center justify-center">
            <KeyRound className="w-7 h-7 text-sky-600" />
          </div>
        </div>

        <PasswordInput
          label="Current Password"
          id="currentPassword"
          registration={{
            value: currentPassword,
            onChange: (e) => setCurrentPassword(e.target.value),
          }}
          error={errors.currentPassword ? { message: errors.currentPassword } : null}
          placeholder="Enter current password"
        />
        <PasswordInput
          label="New Password"
          id="newPassword"
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
          registration={{
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
          }}
          error={errors.confirmPassword ? { message: errors.confirmPassword } : null}
          placeholder="Repeat new password"
        />

        <button
          className="btn-primary flex items-center justify-center gap-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              Updating...
            </>
          ) : (
            'Change Password'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <Link to="/dashboard" className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700">
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>
    </AuthLayout>
  )
}
