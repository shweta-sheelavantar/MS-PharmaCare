import React from 'react'

export default function FormInput({
  label,
  id,
  registration,
  error,
  type = 'text',
  placeholder = '',
  icon: Icon,
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'error' : ''}`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          {...registration}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1" id={`${id}-error`} role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}
