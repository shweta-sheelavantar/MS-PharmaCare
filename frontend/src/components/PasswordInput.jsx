import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({
  label,
  id,
  registration,
  error,
  placeholder = 'Enter password',
  showStrength = false,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const value = registration?.value || ''
  const strength = getStrength(value)

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`input-field pr-11 ${error ? 'error' : ''}`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1" id={`${id}-error`} role="alert">
          {error.message}
        </p>
      )}
      {showStrength && value && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i <= strength.level
                    ? strength.level <= 1
                      ? 'bg-red-500'
                      : strength.level === 2
                      ? 'bg-orange-500'
                      : strength.level === 3
                      ? 'bg-yellow-500'
                      : 'bg-[#82b53f]'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className={`text-xs font-medium ${
            strength.level <= 1 ? 'text-red-500' :
            strength.level === 2 ? 'text-orange-500' :
            strength.level === 3 ? 'text-yellow-600' :
            'text-[#82b53f]'
          }`}>
            {strength.label}
          </p>
        </div>
      )}
    </div>
  )
}

function getStrength(password) {
  if (!password) return { level: 0, label: '' }
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[@$!%*?&]/.test(password)) score++

  if (score <= 1) return { level: 1, label: 'Weak' }
  if (score === 2) return { level: 2, label: 'Fair' }
  if (score === 3) return { level: 3, label: 'Good' }
  return { level: 4, label: 'Strong' }
}
