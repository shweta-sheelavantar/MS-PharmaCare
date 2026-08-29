import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { registerSchema } from '../utils/validationSchemas'
import { authApi } from '../api/authApi'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import PasswordInput from '../components/PasswordInput'

export default function Register() {
  const navigate = useNavigate()
  const toast = useToast()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      await authApi.register(data)
      setSuccess(true)
      toast.success('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.data && Object.values(err.response.data.data).join(', ')) ||
        'Registration failed. Please try again.'
      setServerError(msg)
      toast.error(msg)
    }
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join MS PharmaCare for better health management">
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-slide-down">
          {serverError}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-[#6c9834] rounded-lg text-sm animate-slide-down">
          Registration successful! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          label="Username"
          id="userName"
          registration={register('userName')}
          error={errors.userName}
          placeholder="e.g. John Doe"
          icon={User}
        />
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          registration={register('email')}
          error={errors.email}
          placeholder="you@example.com"
          icon={Mail}
        />
        <FormInput
          label="Mobile Number"
          id="mobileNumber"
          registration={register('mobileNumber')}
          error={errors.mobileNumber}
          placeholder="10-digit mobile number"
          icon={Phone}
        />
        <PasswordInput
          label="Password"
          id="password"
          registration={register('password')}
          error={errors.password}
          placeholder="Create a strong password"
          showStrength
        />
        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          registration={register('confirmPassword')}
          error={errors.confirmPassword}
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
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 transition-colors">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
