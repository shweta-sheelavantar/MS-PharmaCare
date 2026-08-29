import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { loginSchema } from '../utils/validationSchemas'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const toast = useToast()
  const [serverError, setServerError] = useState('')

  const message = location.state?.message

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    if (message) {
      toast.info(message)
      window.history.replaceState({}, '')
    }
  }, [])

  const onSubmit = async (data) => {
    setServerError('')
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.'
      setServerError(msg)
      toast.error(msg)
    }
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your MS PharmaCare account">
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

        <FormInput
          label="Password"
          id="password"
          type="password"
          registration={register('password')}
          error={errors.password}
          placeholder="Enter your password"
          icon={Lock}
        />

        <div className="text-right mb-4">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          className="btn-primary flex items-center justify-center gap-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700 transition-colors">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  )
}
